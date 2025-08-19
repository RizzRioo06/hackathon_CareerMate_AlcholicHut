const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Lightweight HTTP client for OpenAI-compatible providers (e.g., AIMLAPI)
// Used when OPENAI_BASE_URL is set or USE_OPENAI_HTTP=true
function createOpenAIHttpCompatClient() {
  const baseUrl = (process.env.OPENAI_BASE_URL || 'https://api.aimlapi.com/v1').replace(/\/$/, '');
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required when using OPENAI_BASE_URL/http client');
  }

  async function postJson(path, body) {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    try {
      return JSON.parse(text);
    } catch (_) {
      throw new Error('Failed to parse JSON response from provider');
    }
  }

  return {
    chat: {
      completions: {
        create: async ({ model, messages, temperature, max_tokens, response_format }) => {
          const body = { model, messages };
          if (typeof temperature !== 'undefined') body.temperature = temperature;
          if (typeof max_tokens !== 'undefined') body.max_tokens = max_tokens;
          if (typeof response_format !== 'undefined') body.response_format = response_format;
          return postJson('/chat/completions', body);
        }
      }
    }
  };
}

// Initialize OpenAI client (supports Azure OpenAI if envs are present)
function createOpenAIClient() {
  const isAzure = !!process.env.AZURE_OPENAI_ENDPOINT;
  const shouldUseHttpClient = !!process.env.OPENAI_BASE_URL || process.env.USE_OPENAI_HTTP === 'true';
  if (isAzure) {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT?.replace(/\/$/, '');
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-06-01';
    if (!endpoint || !deployment || !apiKey) {
      throw new Error('Azure OpenAI configuration missing. Set AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT, AZURE_OPENAI_API_KEY');
    }
    return new OpenAI({
      apiKey,
      baseURL: `${endpoint}/openai/deployments/${deployment}`,
      defaultQuery: { 'api-version': apiVersion },
      defaultHeaders: { 'api-key': apiKey },
    });
  }
  if (shouldUseHttpClient) {
    return createOpenAIHttpCompatClient();
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: process.env.OPENAI_BASE_URL || undefined });
}

let openai = null;
if ((process.env.PROVIDER || (process.env.AZURE_OPENAI_ENDPOINT ? 'azure' : 'openai')) !== 'gemini') {
  openai = createOpenAIClient();
}

function createGeminiClient() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
}

const gemini = createGeminiClient();
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const PROVIDER = process.env.PROVIDER || (process.env.AZURE_OPENAI_ENDPOINT ? 'azure' : 'openai');

const DEFAULT_MODEL = process.env.AZURE_OPENAI_DEPLOYMENT || process.env.OPENAI_MODEL || 'gpt-4o-mini';

function extractOpenAIError(error) {
  try {
    if (error?.response?.data?.error?.message) return error.response.data.error.message;
    if (error?.error?.message) return error.error.message;
    if (error?.message) return error.message;
  } catch (_) {}
  return 'Unknown error';
}

// Removed pre-scripted content templates. Functions below instruct only the JSON schema
// and use the provided input as context, minimizing opinionated prompt content.

function parseJsonFromText(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    // Try to extract a fenced JSON block ```json ... ``` or ``` ... ```
    const fenced = text.match(/```json[\s\S]*?```|```[\s\S]*?```/);
    if (fenced && fenced[0]) {
      const cleaned = fenced[0]
        .replace(/^```json\n?/, '')
        .replace(/^```\n?/, '')
        .replace(/```$/, '');
      try {
        return JSON.parse(cleaned);
      } catch (_) {}
    }

    // Fallback: attempt to find first { ... } JSON object greedily
    const braceIndex = text.indexOf('{');
    const lastBraceIndex = text.lastIndexOf('}');
    if (braceIndex !== -1 && lastBraceIndex !== -1 && lastBraceIndex > braceIndex) {
      const maybe = text.slice(braceIndex, lastBraceIndex + 1);
      try {
        return JSON.parse(maybe);
      } catch (_) {}
    }

    throw new Error('Failed to parse JSON from model response');
  }
}

// Function to generate career guidance using GPT-5
async function generateCareerGuidance(userProfile) {
  try {
    if (PROVIDER === 'gemini') {
      const system = 'You are a career advisor. Analyze the user profile and return strict JSON with career paths, skill gaps, and recommendations.';
      const userJson = JSON.stringify({
        skills: userProfile.skills,
        experience: userProfile.experience,
        location: userProfile.location,
        preferredRole: userProfile.preferredRole,
        education: userProfile.education,
        interests: userProfile.interests,
      });
      const model = gemini.getGenerativeModel({ model: GEMINI_MODEL, systemInstruction: system });
      const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: userJson }] }], generationConfig: { responseMimeType: 'application/json' } });
      const text = result.response.text();
      return parseJsonFromText(text);
    }

    // Enhanced prompt for GPT-5 to provide better career guidance
    const enhancedPrompt = `You are an expert career advisor with deep knowledge of the tech industry and current market trends.

Based on the user's profile, provide comprehensive career guidance including:
1. Specific career paths that match their skills and interests
2. Identified skill gaps with actionable improvement steps
3. Personalized recommendations for career advancement

User Profile: ${JSON.stringify(userProfile, null, 2)}

Provide detailed, actionable advice that considers current market conditions and realistic career progression.`;

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a career advisor. Analyze the user profile and return strict JSON with career paths, skill gaps, and recommendations."
        },
        {
          role: "user",
          content: enhancedPrompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4, // Balanced creativity and consistency
      max_tokens: 2500, // Increased for GPT-5's capabilities
      top_p: 0.9, // Better control over output quality
    });

    const response = completion.choices[0].message.content;
    return parseJsonFromText(response);
  } catch (error) {
    const msg = extractOpenAIError(error);
    console.error('OpenAI API error (career-guidance):', msg);
    throw new Error('Failed to generate career guidance: ' + msg);
  }
}

// Function to generate mock interview questions using GPT-5
async function generateMockInterview(role) {
  try {
    if (PROVIDER === 'gemini') {
      const system = 'You are an expert technical interviewer. Generate interview questions and return strict JSON.';
      const userJson = JSON.stringify({ role });
      const model = gemini.getGenerativeModel({ model: GEMINI_MODEL, systemInstruction: system });
      const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: userJson }] }], generationConfig: { responseMimeType: 'application/json' } });
      const text = result.response.text();
      return parseJsonFromText(text);
    }

    // Enhanced prompt for GPT-5 to generate better interview questions
    const enhancedPrompt = `You are an expert technical interviewer with deep knowledge of the ${role} position.

Generate 5-7 comprehensive interview questions that cover:
1. Technical skills and problem-solving
2. Real-world scenarios and challenges
3. System design and architecture
4. Team collaboration and communication
5. Industry best practices and current trends

Each question should include:
- The main question
- 2-3 helpful tips for candidates
- The relevant category (Technical, Behavioral, System Design, etc.)

Make questions challenging but fair, suitable for the ${role} level.`;

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer. Generate interview questions and return strict JSON."
        },
        {
          role: "user",
          content: enhancedPrompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5, // Balanced creativity and consistency
      max_tokens: 2000, // Increased for GPT-5's capabilities
      top_p: 0.9, // Better control over output quality
    });

    const response = completion.choices[0].message.content;
    return parseJsonFromText(response);
  } catch (error) {
    const msg = extractOpenAIError(error);
    console.error('OpenAI API error (mock-interview):', msg);
    throw new Error('Failed to generate mock interview: ' + msg);
  }
}

// Function to generate job suggestions using GPT-5
async function generateJobSuggestions(userProfile) {
  try {
    if (PROVIDER === 'gemini') {
      const system = 'You are a career advisor providing job opportunities. Generate ONLY realistic job opportunities with REAL, existing companies (like Google, Microsoft, Amazon, Meta, Apple, Netflix, etc.). Do NOT create fictional companies or URLs. Use actual company names and realistic job descriptions. Return STRICT JSON only: { "opportunities": [{ title, company, location, type, requiredSkills: string[], description, salary, applicationLink: string (use realistic URLs like "https://careers.company.com" or "Apply on company website"), postedDate: string (use realistic dates like "2 days ago", "This week", "Recently") }], "skillMatch": { [skill: string]: number }, "recommendations": string[] }. No extra text.';
      const userJson = JSON.stringify({
        skills: userProfile.skills,
        experience: userProfile.experience,
        location: userProfile.location,
        preferredRole: userProfile.preferredRole,
        education: userProfile.education,
        interests: userProfile.interests,
      });
      const model = gemini.getGenerativeModel({ model: GEMINI_MODEL, systemInstruction: system });
      const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: userJson }] }], generationConfig: { responseMimeType: 'application/json' } });
      const text = result.response.text();
      return parseJsonFromText(text);
    }
    
    // Enhanced prompt for GPT-5 to generate more realistic job opportunities
    const enhancedPrompt = `You are an expert career advisor with access to current job market data. 

Based on the user's profile, generate realistic job opportunities that actually exist in the market.

IMPORTANT RULES:
1. Use ONLY real, existing companies (Google, Microsoft, Amazon, Meta, Apple, Netflix, Uber, Airbnb, Stripe, etc.)
2. Do NOT create fictional company names
3. Use realistic job titles that actually exist
4. Provide accurate salary ranges based on current market data
5. Use realistic URLs like "https://careers.company.com" or "Apply on company website"
6. Use recent posting dates like "2 days ago", "This week", "Recently"
7. Ensure required skills match the job title and company

User Profile: ${JSON.stringify(userProfile, null, 2)}

Generate 3-5 realistic job opportunities with the above requirements.`;

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a career advisor providing job opportunities. Generate ONLY realistic job opportunities with REAL, existing companies (like Google, Microsoft, Amazon, Meta, Apple, Netflix, etc.). Do NOT create fictional companies or URLs. Use actual company names and realistic job descriptions. Return STRICT JSON only: { \"opportunities\": [{ title, company, location, type, requiredSkills: string[], description, salary, applicationLink: string (use realistic URLs like 'https://careers.company.com' or 'Apply on company website'), postedDate: string (use realistic dates like '2 days ago', 'This week', 'Recently') }], \"skillMatch\": { [skill: string]: number }, \"recommendations\": string[] }. No extra text."
        },
        {
          role: "user",
          content: enhancedPrompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3, // Lower temperature for more consistent, realistic output
      max_tokens: 3000, // Increased for GPT-5's capabilities
      top_p: 0.9, // Better control over output quality
    });

    const response = completion.choices[0].message.content;
    return parseJsonFromText(response);
  } catch (error) {
    const msg = extractOpenAIError(error);
    console.error('OpenAI API error (job-suggestions):', msg);
    throw new Error('Failed to generate job suggestions: ' + msg);
  }
}

// Function to evaluate interview answers and provide feedback
async function evaluateInterviewAnswer(question, userAnswer, role) {
  try {
    if (PROVIDER === 'gemini') {
      const system = 'You are an expert interviewer. Evaluate answers and return strict JSON.'
      const prompt = `Question: ${question}\nCandidate's Answer: ${userAnswer}\nRole: ${role}`;
      const model = gemini.getGenerativeModel({ model: GEMINI_MODEL, systemInstruction: system });
      const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json' } });
      const text = result.response.text();
      return parseJsonFromText(text);
    }
    const prompt = `
You are an expert technical interviewer evaluating a candidate's answer for a {role} position.

Question: {question}
Candidate's Answer: {userAnswer}

Please evaluate this answer on a scale of 1-10 and provide:
1. A numerical score (1-10)
2. Constructive feedback
3. 2-3 specific areas for improvement

Provide your response in this exact JSON format:
{
  "score": 8,
  "feedback": "Your answer shows good understanding of the concept...",
  "improvements": [
    "Be more specific about implementation details",
    "Include examples from your experience"
  ]
}

Be fair but thorough in your evaluation. Consider technical accuracy, clarity, and completeness.
`;

    const formattedPrompt = prompt
      .replace('{role}', role)
      .replace('{question}', question)
      .replace('{userAnswer}', userAnswer);

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer. Evaluate the answer fairly and provide feedback in the exact JSON format requested."
        },
        {
          role: "user",
          content: formattedPrompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content;
    return parseJsonFromText(response);
  } catch (error) {
    const msg = extractOpenAIError(error);
    console.error('OpenAI API error (evaluate-answer):', msg);
    throw new Error('Failed to evaluate interview answer: ' + msg);
  }
}

module.exports = {
  generateCareerGuidance,
  generateMockInterview,
  generateJobSuggestions,
  evaluateInterviewAnswer
};
