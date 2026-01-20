import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for Web Speech API (Text-to-Speech and Speech Recognition)
 * Free browser-based solution for auditory learning
 */
export const useSpeech = () => {
    const [isSupported, setIsSupported] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Check browser support
        const hasSpeechSynthesis = 'speechSynthesis' in window;
        const hasSpeechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

        setIsSupported({
            synthesis: hasSpeechSynthesis,
            recognition: hasSpeechRecognition
        });

        // Initialize speech recognition
        if (hasSpeechRecognition) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';
        }

        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    /**
     * Get the best available natural-sounding voice
     */
    const getBestVoice = useCallback(() => {
        const voices = window.speechSynthesis.getVoices();

        // Preferred voices in order of preference
        const preferredVoices = [
            'Google US English',
            'Microsoft Zira - English (United States)',
            'Microsoft David - English (United States)',
            'Samantha',
            'Karen',
            'Alex'
        ];

        // Try to find a preferred voice
        for (const voiceName of preferredVoices) {
            const voice = voices.find(v => v.name === voiceName);
            if (voice) return voice;
        }

        // Fallback: Find any Google or Microsoft English voice
        const naturalVoice = voices.find(v =>
            v.lang.startsWith('en') &&
            (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Natural'))
        );
        if (naturalVoice) return naturalVoice;

        // Last resort: Any English female voice (generally more pleasant)
        const femaleVoice = voices.find(v =>
            v.lang.startsWith('en') &&
            (v.name.includes('Female') || v.name.toLowerCase().includes('female'))
        );

        return femaleVoice || voices.find(v => v.lang.startsWith('en')) || voices[0];
    }, []);

    /**
     * Text-to-Speech
     */
    const speak = useCallback((text, options = {}) => {
        if (!isSupported.synthesis) {
            console.warn('Speech synthesis not supported');
            return Promise.reject(new Error('Speech synthesis not supported'));
        }

        return new Promise((resolve, reject) => {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            // Configure voice options with improved defaults
            utterance.rate = options.rate || 0.95;  // Slightly slower for warmth and clarity
            utterance.pitch = options.pitch || 1.1; // Slightly higher for a friendlier tone
            utterance.volume = options.volume || 1.0;
            utterance.lang = options.lang || 'en-US';

            // Select voice - use specified voice or find the best natural one
            if (options.voice) {
                const voices = window.speechSynthesis.getVoices();
                const selectedVoice = voices.find(v => v.name === options.voice);
                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }
            } else {
                // Auto-select the best natural-sounding voice
                const bestVoice = getBestVoice();
                if (bestVoice) {
                    utterance.voice = bestVoice;
                }
            }

            utterance.onstart = () => {
                setIsSpeaking(true);
            };

            utterance.onend = () => {
                setIsSpeaking(false);
                resolve();
            };

            utterance.onerror = (event) => {
                setIsSpeaking(false);
                reject(event.error);
            };

            window.speechSynthesis.speak(utterance);
        });
    }, [isSupported, getBestVoice]);

    /**
     * Stop speaking
     */
    const stopSpeaking = useCallback(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, []);

    /**
     * Pause speaking
     */
    const pauseSpeaking = useCallback(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.pause();
        }
    }, []);

    /**
     * Resume speaking
     */
    const resumeSpeaking = useCallback(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.resume();
        }
    }, []);

    /**
     * Speech Recognition (Voice Input)
     */
    const listen = useCallback((onResult, onError) => {
        if (!isSupported.recognition || !recognitionRef.current) {
            console.warn('Speech recognition not supported');
            if (onError) onError(new Error('Speech recognition not supported'));
            return;
        }

        const recognition = recognitionRef.current;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const confidence = event.results[0][0].confidence;

            if (onResult) {
                onResult({
                    transcript,
                    confidence,
                    isFinal: event.results[0].isFinal
                });
            }
        };

        recognition.onerror = (event) => {
            setIsListening(false);
            if (onError) onError(event.error);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        try {
            // Stop any existing recognition before starting
            try {
                recognition.stop();
            } catch (e) {
                // Ignore error if not running
            }

            // Small delay to ensure previous session is fully stopped
            setTimeout(() => {
                try {
                    recognition.start();
                } catch (error) {
                    console.error('Error starting recognition:', error);
                    setIsListening(false);
                    if (onError) onError(error);
                }
            }, 100);
        } catch (error) {
            console.error('Error in listen setup:', error);
            setIsListening(false);
            if (onError) onError(error);
        }
    }, [isSupported]);

    /**
     * Stop listening
     */
    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);

    /**
     * Get available voices
     */
    const getVoices = useCallback(() => {
        if (!isSupported.synthesis) return [];
        return window.speechSynthesis.getVoices();
    }, [isSupported]);

    return {
        isSupported,
        isSpeaking,
        isListening,
        speak,
        stopSpeaking,
        pauseSpeaking,
        resumeSpeaking,
        listen,
        stopListening,
        getVoices
    };
};
