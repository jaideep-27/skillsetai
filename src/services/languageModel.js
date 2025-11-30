import { GoogleGenerativeAI } from '@google/generative-ai';

// Expect the key via CRA env (will be inlined at build time). Do NOT commit .env.
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const MODEL_NAME = 'gemini-2.0-flash-lite';

let genAI;
try {
  if (GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
} catch (e) {
  // Safe-guard in case of bad key during build/dev
  console.warn('Gemini init failed:', e?.message || e);
}

const getModel = () => {
  if (!genAI) throw new Error('Missing REACT_APP_GEMINI_API_KEY');
  return genAI.getGenerativeModel({ model: MODEL_NAME });
};

// Helper to build a tutor persona prompt
const tutorPersona = (tutorType) => {
  const personas = {
    visual:
      'You are a visual learning tutor who explains concepts using imagery, diagrams, and visual metaphors. Prefer concise, structured, visual-friendly explanations.',
    auditory:
      'You are an auditory learning tutor who explains concepts through verbal descriptions and analogies. Prefer clear, well-paced explanations with examples.',
    kinesthetic:
      'You are a kinesthetic learning tutor who explains concepts through practical, hands-on examples and tasks. Prefer step-by-step activities.'
  };
  return personas[(tutorType || '').toLowerCase()] || personas.visual;
};

export const getAITutorResponse = async (tutorType, question) => {
  const model = getModel();
  const prompt = `Role: ${tutorPersona(tutorType)}\n\nUser question: ${question}\n\nRespond directly to the user. Keep it helpful and focused.`;
  const result = await model.generateContent([{ text: prompt }]);
  const text = result.response?.text?.() || result.response?.candidates?.[0]?.content?.parts?.map(p => p.text).join('\n');
  if (!text) throw new Error('Empty response from Gemini');
  return text;
};

// Generate a structured learning plan based on answers
export const generateAssessmentPlan = async (tutorType, answersSummary) => {
  const model = getModel();
  const prompt = `You are an expert in learning styles and educational psychology.\nStyle: ${tutorType}.\nAnswers summary:\n${answersSummary}\n\nCreate a JSON object with keys: learningPathDescription (string), strengths (array of strings), recommendations (array of strings), adaptiveLearningPath (array of strings). Keep items concise.`;

  const result = await model.generateContent([{ text: prompt }]);
  const raw = result.response?.text?.() || '';

  // Try to parse JSON from response; fallback to heuristic split
  try {
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      const json = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
      return {
        learningPathDescription: json.learningPathDescription || '',
        strengths: Array.isArray(json.strengths) ? json.strengths : [],
        recommendations: Array.isArray(json.recommendations) ? json.recommendations : [],
        adaptiveLearningPath: Array.isArray(json.adaptiveLearningPath) ? json.adaptiveLearningPath : []
      };
    }
  } catch (_) {
    // ignore and fall through
  }

  // Heuristic fallback
  const sections = raw.split(/\n\n+/);
  return {
    learningPathDescription: sections[0] || '',
    strengths: (sections[1] || '').split('\n').filter(Boolean),
    recommendations: (sections[2] || '').split('\n').filter(Boolean),
    adaptiveLearningPath: (sections[3] || '').split('\n').filter(Boolean)
  };
};

// No-op client-side storage placeholder to keep current imports working
export const storeAssessmentData = async () => ({ success: true });

// Placeholder retained for API compatibility
export const trainModel = async () => ({ success: true });
