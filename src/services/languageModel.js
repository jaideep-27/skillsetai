import Groq from 'groq-sdk';

// Expect the key via CRA env (will be inlined at build time). Do NOT commit .env.
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const MODEL_NAME = 'llama-3.3-70b-versatile';

let groq;
try {
  if (GROQ_API_KEY) {
    groq = new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true });
  }
} catch (e) {
  // Safe-guard in case of bad key during build/dev
  console.warn('Groq init failed:', e?.message || e);
}

const getClient = () => {
  if (!groq) throw new Error('Missing REACT_APP_GROQ_API_KEY');
  return groq;
};

// Helper to build a tutor persona prompt with modality-specific instructions
const tutorPersona = (tutorType) => {
  const personas = {
    visual: `You are a visual learning tutor who explains concepts using imagery, diagrams, and visual metaphors.

CRITICAL: For visual explanations, ALWAYS include Mermaid diagrams:
- Use \`\`\`mermaid blocks for flowcharts, mind maps, and sequence diagrams
- For concepts: use "flowchart TD" (top-down flowcharts)
- For processes: use "sequenceDiagram"
- For relationships: use "graph TD"

Format code examples with clear visual structure and comments.
Use emojis and visual markers to enhance clarity.
Break down complex ideas into visual steps.`,

    auditory: `You are an auditory learning tutor who explains concepts through clear verbal descriptions and analogies.

CRITICAL: Optimize for spoken delivery:
- Use conversational, natural language
- Include verbal transitions ("first", "next", "finally")
- Avoid complex formatting or code-heavy responses
- Use analogies and stories for explanation
- Structure explanations for listening comprehension
- Keep sentences clear and not too long`,

    kinesthetic: `You are a kinesthetic learning tutor who explains through hands-on practice and interactive coding.

CRITICAL: Provide interactive experiences:
- Always include code examples users can run and modify
- Suggest specific modifications for them to try
- Provide hands-on exercises with clear goals
- Encourage experimentation: "Try changing X to see Y"
- Give step-by-step coding challenges`
  };
  return personas[(tutorType || '').toLowerCase()] || personas.visual;
};

export const getAITutorResponse = async (tutorType, question) => {
  const client = getClient();
  const systemPrompt = `Role: ${tutorPersona(tutorType)}`;
  const userPrompt = `User question: ${question}\n\nRespond directly to the user. Keep it helpful and focused.`;

  const completion = await client.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    model: MODEL_NAME,
  });

  const text = completion.choices[0]?.message?.content;
  if (!text) throw new Error('Empty response from Groq');
  return text;
};

// Generate a structured learning plan based on answers
export const generateAssessmentPlan = async (tutorType, answersSummary) => {
  const client = getClient();
  const prompt = `You are an expert in learning styles and educational psychology.\nStyle: ${tutorType}.\nAnswers summary:\n${answersSummary}\n\nCreate a JSON object with keys: learningPathDescription (string), strengths (array of strings), recommendations (array of strings), adaptiveLearningPath (array of strings). Keep items concise.`;

  const completion = await client.chat.completions.create({
    messages: [
      { role: 'user', content: prompt }
    ],
    model: MODEL_NAME,
  });

  const raw = completion.choices[0]?.message?.content || '';

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
