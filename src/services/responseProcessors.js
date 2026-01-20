// Process visual learning responses - use Stability AI generated images
export const processVisualResponse = async (response, media) => {
  try {
    return {
      text: response,
      media: media || { type: 'text' }
    };
  } catch (error) {
    console.error('Error processing visual response:', error);
    return { text: response, media: null };
  }
};

// Process auditory learning responses - use PlayHT generated audio
export const processAuditoryResponse = async (response, media) => {
  try {
    if (media?.type === 'audio' && media.url) {
      // Create audio element for the generated audio
      const audio = new Audio(media.url);

      return {
        text: response,
        media: {
          type: 'audio',
          play: () => audio.play(),
          stop: () => {
            audio.pause();
            audio.currentTime = 0;
          }
        }
      };
    }

    // Fallback to browser's speech synthesis if no audio URL
    const utterance = new SpeechSynthesisUtterance(response);

    // Select a pleasant, natural-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoices = [
      'Google US English',
      'Microsoft Zira - English (United States)',
      'Microsoft David - English (United States)',
      'Samantha',
      'Karen',
      'Alex'
    ];

    // Find the first available preferred voice, or use a female voice as fallback
    let selectedVoice = null;
    for (const voiceName of preferredVoices) {
      selectedVoice = voices.find(v => v.name === voiceName);
      if (selectedVoice) break;
    }

    // If no preferred voice found, try to find any natural-sounding English voice
    if (!selectedVoice) {
      selectedVoice = voices.find(v =>
        v.lang.startsWith('en') &&
        (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Natural'))
      );
    }

    // If still no voice found, use any English female voice (generally more pleasant)
    if (!selectedVoice) {
      selectedVoice = voices.find(v =>
        v.lang.startsWith('en') &&
        (v.name.includes('Female') || v.name.toLowerCase().includes('female'))
      );
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Adjust pitch and rate for a warmer, more natural sound
    utterance.rate = 0.95;  // Slightly slower for clarity and warmth
    utterance.pitch = 1.1;  // Slightly higher pitch for a friendlier tone
    utterance.volume = 1;

    return {
      text: response,
      media: {
        type: 'audio',
        play: () => window.speechSynthesis.speak(utterance),
        stop: () => window.speechSynthesis.cancel()
      }
    };
  } catch (error) {
    console.error('Error processing auditory response:', error);
    return { text: response, media: null };
  }
};

// Process kinesthetic learning responses - create interactive elements
export const processKinestheticResponse = (response) => {
  try {
    // Extract steps or exercises from the response
    const steps = response.split(/\d+\./)
      .filter(step => step.trim().length > 0)
      .map(step => step.trim());

    // Create interactive checklist
    const interactiveSteps = steps.map((step, index) => ({
      id: index + 1,
      text: step,
      completed: false,
      type: 'exercise'
    }));

    return {
      text: response,
      media: {
        type: 'interactive',
        steps: interactiveSteps
      }
    };
  } catch (error) {
    console.error('Error processing kinesthetic response:', error);
    return { text: response, media: null };
  }
};

// Main processor function
export const processLearningResponse = async (response, learningStyle, media = null) => {
  switch (learningStyle.toLowerCase()) {
    case 'visual':
      return processVisualResponse(response, media);
    case 'auditory':
      return processAuditoryResponse(response, media);
    case 'kinesthetic':
      return processKinestheticResponse(response);
    default:
      return { text: response, media: null };
  }
};
