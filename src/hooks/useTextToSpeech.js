import { useState, useCallback, useEffect, useRef } from 'react';

export default function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const [voices, setVoices] = useState([]);
  const resumeTimerRef = useRef(null);

  // Load voices when component mounts
  useEffect(() => {
    if (!window.speechSynthesis) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    // Load immediately in case voices are already cached
    loadVoices();

    // Listen for voices to load (on first use or after browser loads them)
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      // Cleanup: stop any ongoing speech and clear timers
      if (resumeTimerRef.current) {
        clearInterval(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const cleanText = (text) => {
    if (!text) return '';
    return text
      .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/\*\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .trim();
  };

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const cleanedText = cleanText(text);
    if (!cleanedText) return;

    // Detect mobile
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

    // Split into sentences first
    const sentences = cleanedText.match(/[^.!?]+[.!?]+/g) || [cleanedText];

    // Mobile: 20 words per chunk. Desktop: 150 words per chunk
    const chunkLimit = isMobile ? 20 : 150;

    let chunks = [];
    let currentChunk = '';
    sentences.forEach((sentence) => {
      const words = currentChunk.split(' ').length + sentence.split(' ').length;
      if (words > chunkLimit) {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    });
    if (currentChunk) chunks.push(currentChunk.trim());

    let chunkIndex = 0;
    let cancelled = false;

    const speakChunk = () => {
      if (cancelled || chunkIndex >= chunks.length) {
        if (resumeTimerRef.current) {
          clearInterval(resumeTimerRef.current);
          resumeTimerRef.current = null;
        }
        setIsSpeaking(false);
        setCurrentUtterance(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
      utterance.rate = isMobile ? 0.9 : 0.92;
      utterance.pitch = 1.05;
      utterance.lang = 'en-US';

      const preferredNames = [
        'Google UK English Female',
        'Google US English',
        'Samantha',
        'Karen',
        'Daniel',
        'Moira',
        'Fiona',
        'Microsoft Zira',
        'Microsoft David',
      ];
      const selectedVoice = preferredNames
        .map((name) => voices.find((v) => v.name.includes(name)))
        .find(Boolean);
      if (selectedVoice) utterance.voice = selectedVoice;

      utterance.onstart = () => {
        setIsSpeaking(true);
        if (!isMobile) {
          // Desktop Chrome bug fix: pause/resume every 10s
          resumeTimerRef.current = setInterval(() => {
            if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
              window.speechSynthesis.pause();
              window.speechSynthesis.resume();
            }
          }, 10000);
        }
      };

      utterance.onend = () => {
        if (resumeTimerRef.current) {
          clearInterval(resumeTimerRef.current);
          resumeTimerRef.current = null;
        }
        if (!cancelled) {
          chunkIndex++;
          setTimeout(speakChunk, isMobile ? 50 : 300);
        }
      };

      utterance.onerror = (error) => {
        console.error('[TTS] Error:', error);
        if (resumeTimerRef.current) {
          clearInterval(resumeTimerRef.current);
          resumeTimerRef.current = null;
        }
        // On mobile, try next chunk on error instead of stopping
        if (isMobile && !cancelled) {
          chunkIndex++;
          setTimeout(speakChunk, 100);
        } else {
          setIsSpeaking(false);
          setCurrentUtterance(null);
        }
      };

      setCurrentUtterance(utterance);
      window.speechSynthesis.speak(utterance);

      // Mobile safety net: if onend doesn't fire within expected time,
      // force move to next chunk
      if (isMobile) {
        const wordCount = chunks[chunkIndex].split(' ').length;
        const expectedDuration = (wordCount / 0.9) * 1000 + 500; // ms
        setTimeout(() => {
          if (!cancelled && window.speechSynthesis.speaking === false && chunkIndex < chunks.length) {
            chunkIndex++;
            speakChunk();
          }
        }, expectedDuration);
      }
    };

    // Store cancel function
    const originalCancel = window.speechSynthesis.cancel.bind(window.speechSynthesis);

    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        const freshVoices = window.speechSynthesis.getVoices();
        if (freshVoices.length > 0) {
          setVoices(freshVoices);
          speakChunk();
          window.speechSynthesis.onvoiceschanged = null;
        }
      };
    } else {
      speakChunk();
    }
  }, [voices]);

  const stop = useCallback(() => {
    if (!window.speechSynthesis) return;
    if (resumeTimerRef.current) {
      clearInterval(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentUtterance(null);
  }, []);

  const pause = useCallback(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.pause();
  }, []);

  const resume = useCallback(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.resume();
  }, []);

  const isSupported = typeof window !== 'undefined' && !!window.speechSynthesis;

  return { speak, stop, pause, resume, isSpeaking, isSupported };
}
