import React from 'react';
import { useSpeech } from '../../hooks/useSpeech';
import './AudioControls.css';

const AudioControls = ({ text, autoPlay = false, onSpeakStart, onSpeakEnd }) => {
    const {
        isSupported,
        isSpeaking,
        speak,
        stopSpeaking,
        pauseSpeaking,
        resumeSpeaking
    } = useSpeech();

    const [rate, setRate] = React.useState(1.0);
    const [volume, setVolume] = React.useState(1.0);
    const [isPaused, setIsPaused] = React.useState(false);

    React.useEffect(() => {
        if (autoPlay && text && isSupported.synthesis) {
            handleSpeak();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoPlay, text]);

    const handleSpeak = async () => {
        if (!text) return;

        try {
            if (onSpeakStart) onSpeakStart();
            setIsPaused(false);
            await speak(text, { rate, volume });
            if (onSpeakEnd) onSpeakEnd();
        } catch (error) {
            console.error('Speech error:', error);
        }
    };

    const handleStop = () => {
        stopSpeaking();
        setIsPaused(false);
    };

    const handlePauseResume = () => {
        if (isPaused) {
            resumeSpeaking();
            setIsPaused(false);
        } else {
            pauseSpeaking();
            setIsPaused(true);
        }
    };

    if (!isSupported.synthesis) {
        return (
            <div className="audio-controls-unsupported">
                <span>🔇</span>
                <span>Text-to-speech not supported in this browser</span>
            </div>
        );
    }

    return (
        <div className="audio-controls">
            <div className="audio-controls-header">
                <span className="audio-icon">🔊</span>
                <span>Audio Controls</span>
            </div>

            <div className="audio-controls-buttons">
                <button
                    className={`audio-btn play-btn ${isSpeaking ? 'active' : ''}`}
                    onClick={handleSpeak}
                    disabled={isSpeaking}
                    title="Play"
                >
                    <span>▶</span>
                </button>

                {isSpeaking && (
                    <button
                        className="audio-btn pause-btn"
                        onClick={handlePauseResume}
                        title={isPaused ? 'Resume' : 'Pause'}
                    >
                        <span>{isPaused ? '▶' : '⏸'}</span>
                    </button>
                )}

                <button
                    className="audio-btn stop-btn"
                    onClick={handleStop}
                    disabled={!isSpeaking}
                    title="Stop"
                >
                    <span>⏹</span>
                </button>
            </div>

            <div className="audio-controls-sliders">
                <div className="slider-group">
                    <label>
                        <span className="slider-icon">⏩</span>
                        <span>Speed: {rate.toFixed(1)}x</span>
                    </label>
                    <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value))}
                        className="audio-slider"
                    />
                </div>

                <div className="slider-group">
                    <label>
                        <span className="slider-icon">🔊</span>
                        <span>Volume: {Math.round(volume * 100)}%</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="audio-slider"
                    />
                </div>
            </div>

            {isSpeaking && (
                <div className="audio-waveform">
                    <div className="waveform-bar"></div>
                    <div className="waveform-bar"></div>
                    <div className="waveform-bar"></div>
                    <div className="waveform-bar"></div>
                    <div className="waveform-bar"></div>
                </div>
            )}
        </div>
    );
};

export default AudioControls;
