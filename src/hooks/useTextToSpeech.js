import { useState, useCallback } from 'react';

export default function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);

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

    // Split into chunks of ~200 words to prevent browser cutoff
    const sentences = cleanedText.match(/[^.!?]+[.!?]+/g) || [cleanedText];
    let chunks = [];
    let currentChunk = '';

    sentences.forEach((sentence) => {
      const words = currentChunk.split(' ').length + sentence.split(' ').length;
      if (words > 200) {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    });
    if (currentChunk) chunks.push(currentChunk);

    let chunkIndex = 0;

    const speakChunk = () => {
      if (chunkIndex >= chunks.length) {
        setIsSpeaking(false);
        setCurrentUtterance(null);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.lang = 'en-US';

      // Select best available voice
      const voices = window.speechSynthesis.getVoices();
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
      const voice = preferredNames
        .map((name) => voices.find((v) => v.name.includes(name)))
        .find(Boolean);
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        chunkIndex++;
        setTimeout(speakChunk, 300); // 300ms pause between chunks
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentUtterance(null);
      };

      setCurrentUtterance(utterance);
      window.speechSynthesis.speak(utterance);
    };

    speakChunk();
  }, []);

  const stop = useCallback(() => {
    if (!window.speechSynthesis) return;
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
