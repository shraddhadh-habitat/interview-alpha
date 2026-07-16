import { useState, useCallback, useEffect, useRef } from 'react';

export default function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const [voices, setVoices] = useState([]);
  const resumeTimerRef = useRef(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!window.speechSynthesis) return;
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) setVoices(availableVoices);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
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
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .trim();
  };

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    cancelledRef.current = false;
    const cleanedText = cleanText(text);
    if (!cleanedText) return;

    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const chunkLimit = isMobile ? 30 : 150;

    const sentences = cleanedText.match(/[^.!?]+[.!?]+/g) || [cleanedText];
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

    const speakChunk = () => {
      if (cancelledRef.current || chunkIndex >= chunks.length) {
        if (resumeTimerRef.current) {
          clearInterval(resumeTimerRef.current);
          resumeTimerRef.current = null;
        }
        setIsSpeaking(false);
        setCurrentUtterance(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
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
          // Desktop Chrome bug fix only - mobile doesn't need this
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
        if (!cancelledRef.current) {
          chunkIndex++;
          setTimeout(speakChunk, isMobile ? 100 : 300);
        }
      };

      utterance.onerror = (error) => {
        console.error('[TTS] Error:', error);
        if (resumeTimerRef.current) {
          clearInterval(resumeTimerRef.current);
          resumeTimerRef.current = null;
        }
        if (isMobile) {
          chunkIndex++;
          setTimeout(speakChunk, 100);
        } else {
          setIsSpeaking(false);
          setCurrentUtterance(null);
        }
      };

      setCurrentUtterance(utterance);
      window.speechSynthesis.speak(utterance);
    };

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
    cancelledRef.current = true;
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
