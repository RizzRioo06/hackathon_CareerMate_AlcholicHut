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

// CRITICAL: All responses must be generated purely by AI based on user input and context.
// NO prescripted content, NO fake company names, NO generic placeholders.
// AI MUST generate REAL company names, REAL job titles, REAL skills, and REAL recommendations.
// If you see placeholder text like "Job title" or "Company name", the AI is NOT working properly.

function parseJsonFromText(text) {
  try {
    // Try to parse as JSON first
    return JSON.parse(text);
  } catch (e) {
    // If that fails, try to extract JSON from the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e2) {
        console.error('Failed to parse extracted JSON:', e2);
        throw new Error('Invalid JSON response from AI service');
      }
    }
    throw new Error('No valid JSON found in response');
  }
}

// Function to generate career guidance using GPT-5
async function generateCareerGuidance(userProfile) {
  try {
    if (PROVIDER === 'gemini') {
      const system = `You are a career advisor. Analyze the user profile and return strict JSON in this exact format:
{
  "careerPaths": [
    "Real career path with specific role title and industry",
    "Real career path with specific role title and industry",
    "Real career path with specific role title and industry",
    "Real career path with specific role title and industry"
  ],
  "skillGaps": [
    "Real skill name with level (e.g., 'Advanced React with TypeScript')",
    "Real skill name with level (e.g., 'AWS Cloud Architecture')",
    "Real skill name with level (e.g., 'System Design Principles')",
    "Real skill name with level (e.g., 'Data Structures & Algorithms')"
  ],
  "learningRoadmap": {
    "courses": [
      "Real course name with platform (e.g., 'Meta Front-End Developer on Coursera')",
      "Real course name with platform (e.g., 'AWS Solutions Architect on Udemy')",
      "Real course name with platform (e.g., 'Grokking System Design on Educative')",
      "Real course name with platform (e.g., 'Data Structures in Python on edX')"
    ],
    "projects": [
      "Real project idea with scope and tech stack",
      "Real project idea with scope and tech stack",
      "Real project idea with scope and tech stack",
      "Real project idea with scope and tech stack"
    ]
  }
}`;
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

    // Enhanced prompt for GPT-5 to provide career guidance
    const enhancedPrompt = `You are an expert career advisor with deep knowledge of the tech industry and current market trends.

Based on the user's profile, provide comprehensive career guidance including:
1. Career paths that match their skills and interests
2. Identified skill gaps with improvement steps
3. Personalized recommendations for career advancement

User Profile: ${JSON.stringify(userProfile, null, 2)}

IMPORTANT: Provide highly specific, actionable advice that considers:
- Current market conditions and trends
- The user's specific skill level and experience
- Realistic career progression paths
- Concrete steps they can take immediately

Be specific about role titles, skill names, course platforms, and project details. Avoid generic advice.

Return the response in this exact JSON format:
{
  "careerPaths": [
    "Real career path with specific role title and industry",
    "Real career path with specific role title and industry",
    "Real career path with specific role title and industry",
    "Real career path with specific role title and industry"
  ],
  "skillGaps": [
    "Real skill name with level (e.g., 'Advanced React with TypeScript')",
    "Real skill name with level (e.g., 'AWS Cloud Architecture')",
    "Real skill name with level (e.g., 'System Design Principles')",
    "Real skill name with level (e.g., 'Data Structures & Algorithms')"
  ],
  "learningRoadmap": {
    "courses": [
      "Real course name with platform (e.g., 'Meta Front-End Developer on Coursera')",
      "Real course name with platform (e.g., 'AWS Solutions Architect on Udemy')",
      "Real course name with platform (e.g., 'Grokking System Design on Educative')",
      "Real course name with platform (e.g., 'Data Structures in Python on edX')"
    ],
    "projects": [
      "Real project idea with scope and tech stack",
      "Real project idea with scope and tech stack",
      "Real project idea with scope and tech stack",
      "Real project idea with scope and tech stack"
    ]
  }
}`;

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a career advisor. Analyze the user profile and return strict JSON in the exact format requested."
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
      const system = `You are an expert technical interviewer. Generate interview questions and return strict JSON in this exact format:
{
  "questions": [
    {
      "question": "Actual interview question text for this role",
      "tips": ["Specific tip 1 for answering this question", "Specific tip 2 for answering this question"],
      "category": "Exact category: Technical, Behavioral, System Design, Problem Solving, or Leadership"
    }
  ]
}`;
      const userJson = JSON.stringify({ role });
      const model = gemini.getGenerativeModel({ model: GEMINI_MODEL, systemInstruction: system });
      const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: userJson }] }], generationConfig: { responseMimeType: 'application/json' } });
      const text = result.response.text();
      return parseJsonFromText(text);
    }

    // Enhanced prompt for GPT-5 to generate interview questions
    const enhancedPrompt = `You are an expert technical interviewer with deep knowledge of the ${role} position.

Generate comprehensive interview questions that cover:
1. Technical skills and problem-solving
2. Real-world scenarios and challenges
3. System design and architecture
4. Team collaboration and communication
5. Industry best practices and current trends

Each question should include:
- The main question (be specific and relevant to the role)
- Helpful tips for candidates (provide 2-3 specific, actionable tips)
- The relevant category (be specific: Technical, Behavioral, System Design, Problem Solving, or Leadership)

Make questions challenging but fair, suitable for the ${role} level. Avoid generic questions - make them specific to the role and current industry practices.

Return the response in this exact JSON format:
{
  "questions": [
    {
      "question": "Actual interview question text for this role",
      "tips": ["Specific tip 1 for answering this question", "Specific tip 2 for answering this question"],
      "category": "Exact category: Technical, Behavioral, System Design, Problem Solving, or Leadership"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer. Generate interview questions and return strict JSON in the exact format requested."
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
      const system = `You are a career advisor providing job opportunities. Generate realistic job opportunities based on the user's profile. 

CRITICAL INSTRUCTIONS - READ CAREFULLY:
1. You MUST use ONLY REAL, EXISTING companies that are currently hiring in the tech industry
2. Use companies like: Google, Microsoft, Amazon, Meta, Apple, Netflix, Uber, Airbnb, Stripe, Shopify, Discord, Zoom, Slack, Notion, Figma, Canva, Atlassian, GitLab, GitHub, DigitalOcean, Heroku, Vercel, Netlify, etc.
3. Do NOT create fake company names or use generic placeholders
4. Generate REAL job titles that exist in the current market
5. Use ACTUAL salary ranges from current market data
6. Provide SPECIFIC skills that are actually required for these roles
7. Write AUTHENTIC job descriptions that sound like real job postings

For the recommendations section, provide 3-4 specific, actionable career advice based on:
1. The user's current skill gaps compared to the job opportunities
2. Their experience level and how to advance  
3. Specific actions they can take to improve their marketability
4. Realistic next steps for their career progression

Make recommendations highly personalized to their profile, not generic advice.

Return STRICT JSON only in this exact format:
{
  "opportunities": [
    {
      "title": "Real job title from current market",
      "company": "Real existing company name",
      "location": "Real city and state",
      "type": "Full-time/Part-time/Internship/Contract",
      "requiredSkills": ["Real skill names"],
      "description": "Authentic job description",
      "salary": "Real market salary range",
      "postedDate": "Recent date like '2 days ago' or 'This week'"
    }
  ],
  "skillMatch": {
    "Real skill name": 85,
    "Another real skill": 70
  },
  "recommendations": [
    "Real recommendation based on user's profile",
    "Another real recommendation",
    "Third real recommendation"
  ]
}`;
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
    
    // Enhanced prompt for GPT-5 to generate job opportunities
    const enhancedPrompt = `You are an expert career advisor with access to current job market data. 

Based on the user's profile, generate realistic job opportunities that match their skills and experience.

User Profile: ${JSON.stringify(userProfile, null, 2)}

CRITICAL INSTRUCTIONS - READ CAREFULLY:
1. You MUST use ONLY REAL, EXISTING companies that are currently hiring in the tech industry
2. Use companies like: Google, Microsoft, Amazon, Meta, Apple, Netflix, Uber, Airbnb, Stripe, Shopify, Discord, Zoom, Slack, Notion, Figma, Canva, Atlassian, GitLab, GitHub, DigitalOcean, Heroku, Vercel, Netlify, etc.
3. Do NOT create fake company names or use generic placeholders
4. Generate REAL job titles that exist in the current market
5. Use ACTUAL salary ranges from current market data
6. Provide SPECIFIC skills that are actually required for these roles
7. Write AUTHENTIC job descriptions that sound like real job postings

For the recommendations section, provide 3-4 specific, actionable career advice based on:
1. The user's current skill gaps compared to the job opportunities
2. Their experience level and how to advance
3. Specific actions they can take to improve their marketability
4. Realistic next steps for their career progression

Make recommendations highly personalized to their profile, not generic advice.

Return the response in this exact JSON format:
{
  "opportunities": [
    {
      "title": "Real job title from current market",
      "company": "Real existing company name",
      "location": "Real city and state",
      "type": "Full-time/Part-time/Internship/Contract",
      "requiredSkills": ["Real skill names"],
      "description": "Authentic job description",
      "salary": "Real market salary range",
      "postedDate": "Recent date like '2 days ago' or 'This week'"
    }
  ],
  "skillMatch": {
    "Real skill name": 85,
    "Another real skill": 70
  },
  "recommendations": [
    "Real recommendation based on user's profile",
    "Another real recommendation",
    "Third real recommendation"
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a career advisor providing job opportunities. Generate realistic job opportunities based on the user's profile. Return STRICT JSON only in the exact format requested."
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
      const system = `You are an expert interviewer. Evaluate answers and return strict JSON in this exact format:
{
  "score": 8,
  "feedback": "Actual feedback text based on the answer",
  "improvements": [
    "Specific improvement suggestion 1",
    "Specific improvement suggestion 2"
  ]
}`;
      const prompt = `Question: ${question}\nCandidate's Answer: ${userAnswer}\nRole: ${role}`;
      const model = gemini.getGenerativeModel({ model: GEMINI_MODEL, systemInstruction: system });
      const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json' } });
      const text = result.response.text();
      return parseJsonFromText(text);
    }
    
    const prompt = `You are an expert technical interviewer evaluating a candidate's answer for a ${role} position.

Question: ${question}
Candidate's Answer: ${userAnswer}

Please evaluate this answer and provide:
1. A numerical score
2. Constructive feedback
3. Areas for improvement

Provide your response in this exact JSON format:
{
  "score": 8,
  "feedback": "Actual feedback text based on the answer",
  "improvements": [
    "Specific improvement suggestion 1",
    "Specific improvement suggestion 2"
  ]
}

Be fair but thorough in your evaluation. Consider technical accuracy, clarity, and completeness.`;

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer. Evaluate answers and return strict JSON in the exact format requested."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content;
    return parseJsonFromText(response);
  } catch (error) {
    const msg = extractOpenAIError(error);
    console.error('OpenAI API error (evaluate-answer):', msg);
    throw new Error('Failed to evaluate answer: ' + msg);
  }
}

// Function to generate career discovery insights using AI
async function generateCareerDiscovery(userProfile, language = 'en') {
  try {
    if (PROVIDER === 'gemini') {
      const languageInstructions = {
        'en': 'Generate the response in English.',
        'es': 'Generate the response in Spanish (Español).',
        'fr': 'Generate the response in French (Français).',
        'de': 'Generate the response in German (Deutsch).',
        'it': 'Generate the response in Italian (Italiano).',
        'pt': 'Generate the response in Portuguese (Português).',
        'ru': 'Generate the response in Russian (Русский).',
        'ja': 'Generate the response in Japanese (日本語).',
        'ko': 'Generate the response in Korean (한국어).',
        'zh': 'Generate the response in Chinese (中文).',
        'my': 'Generate the response in Burmese (မြန်မာဘာသာ).',
        'ar': 'Generate the response in Arabic (العربية).',
        'hi': 'Generate the response in Hindi (हिन्दी).',
        'tr': 'Generate the response in Turkish (Türkçe).',
        'pl': 'Generate the response in Polish (Polski).',
        'nl': 'Generate the response in Dutch (Nederlands).',
        'sv': 'Generate the response in Swedish (Svenska).',
        'da': 'Generate the response in Danish (Dansk).',
        'no': 'Generate the response in Norwegian (Norsk).',
        'fi': 'Generate the response in Finnish (Suomi).',
        'cs': 'Generate the response in Czech (Čeština).',
        'hu': 'Generate the response in Hungarian (Magyar).',
        'ro': 'Generate the response in Romanian (Română).',
        'bg': 'Generate the response in Bulgarian (Български).',
        'hr': 'Generate the response in Croatian (Hrvatski).',
        'sk': 'Generate the response in Slovak (Slovenčina).',
        'sl': 'Generate the response in Slovenian (Slovenščina).',
        'et': 'Generate the response in Estonian (Eesti).',
        'lv': 'Generate the response in Latvian (Latviešu).',
        'lt': 'Generate the response in Lithuanian (Lietuvių).',
        'mt': 'Generate the response in Maltese (Malti).',
        'el': 'Generate the response in Greek (Ελληνικά).',
        'he': 'Generate the response in Hebrew (עברית).',
        'th': 'Generate the response in Thai (ไทย).',
        'vi': 'Generate the response in Vietnamese (Tiếng Việt).',
        'id': 'Generate the response in Indonesian (Bahasa Indonesia).',
        'ms': 'Generate the response in Malay (Bahasa Melayu).',
        'tl': 'Generate the response in Filipino (Tagalog).',
        'bn': 'Generate the response in Bengali (বাংলা).',
        'ta': 'Generate the response in Tamil (தமிழ்).',
        'te': 'Generate the response in Telugu (తెలుగు).',
        'ml': 'Generate the response in Malayalam (മലയാളം).',
        'kn': 'Generate the response in Kannada (ಕನ್ನಡ).',
        'gu': 'Generate the response in Gujarati (ગુજરાતી).',
        'pa': 'Generate the response in Punjabi (ਪੰਜਾਬੀ).',
        'or': 'Generate the response in Odia (ଓଡ଼ିଆ).',
        'as': 'Generate the response in Assamese (অসমীয়া).',
        'ne': 'Generate the response in Nepali (नेपाली).',
        'si': 'Generate the response in Sinhala (සිංහල).',
        'km': 'Generate the response in Khmer (ខ្មែរ).',
        'lo': 'Generate the response in Lao (ລາວ).',
        'mn': 'Generate the response in Mongolian (Монгол).',
        'ka': 'Generate the response in Georgian (ქართული).',
        'hy': 'Generate the response in Armenian (Հայերեն).',
        'az': 'Generate the response in Azerbaijani (Azərbaycan).',
        'kk': 'Generate the response in Kazakh (Қазақ).',
        'ky': 'Generate the response in Kyrgyz (Кыргызча).',
        'uz': 'Generate the response in Uzbek (O\'zbek).',
        'tg': 'Generate the response in Tajik (Тоҷикӣ).',
        'fa': 'Generate the response in Persian (فارسی).',
        'ps': 'Generate the response in Pashto (پښتو).',
        'sd': 'Generate the response in Sindhi (سنڌي).',
        'am': 'Generate the response in Amharic (አማርኛ).',
        'sw': 'Generate the response in Swahili (Kiswahili).',
        'yo': 'Generate the response in Yoruba (Yorùbá).',
        'ig': 'Generate the response in Igbo (Igbo).',
        'ha': 'Generate the response in Hausa (Hausa).',
        'zu': 'Generate the response in Zulu (isiZulu).',
        'xh': 'Generate the response in Xhosa (isiXhosa).',
        'af': 'Generate the response in Afrikaans (Afrikaans).',
        'is': 'Generate the response in Icelandic (Íslenska).',
        'fo': 'Generate the response in Faroese (Føroyskt).',
        'ga': 'Generate the response in Irish (Gaeilge).',
        'cy': 'Generate the response in Welsh (Cymraeg).',
        'eu': 'Generate the response in Basque (Euskara).',
        'ca': 'Generate the response in Catalan (Català).',
        'gl': 'Generate the response in Galician (Galego).',
        'sq': 'Generate the response in Albanian (Shqip).',
        'mk': 'Generate the response in Macedonian (Македонски).',
        'sr': 'Generate the response in Serbian (Српски).',
        'bs': 'Generate the response in Bosnian (Bosanski).',
        'me': 'Generate the response in Montenegrin (Crnogorski).',
        'uk': 'Generate the response in Ukrainian (Українська).',
        'be': 'Generate the response in Belarusian (Беларуская).',
        'zh-tw': 'Generate the response in Traditional Chinese (繁體中文).',
        'zh-hk': 'Generate the response in Hong Kong Chinese (香港繁體中文).',
        'zh-sg': 'Generate the response in Singapore Chinese (新加坡中文).',
        'zh-cn': 'Generate the response in Simplified Chinese (简体中文).'
      };

      const system = `You are an expert career discovery specialist. 

IMPORTANT: You MUST generate the response in ${languageInstructions[language] || languageInstructions['en']}
CRITICAL: The entire response must be written in the specified language. Do NOT use English.

${languageInstructions[language] || languageInstructions['en']}

Analyze the user's unique combination of current role and interests to discover unexpected career possibilities. Return strict JSON in this exact format:
{
  "careerPaths": [
    {
      "title": "Real career path title that combines their current role and interests",
      "description": "Detailed description of how this career path connects their current skills and interests",
      "transferableSkills": ["Skill 1 from current role", "Skill 2 from current role", "Skill 3 from current role"],
      "skillGaps": ["Specific skill to develop 1", "Specific skill to develop 2", "Specific skill to develop 3"],
      "marketDemand": "High/Medium/Low based on current market trends",
      "salaryRange": "Realistic salary range for this role",
      "companies": ["Real company 1", "Real company 2", "Real company 3"],
      "nextSteps": ["Specific actionable step 1", "Specific actionable step 2", "Specific actionable step 3"]
    }
  ],
  "learningRoadmap": {
    "immediate": ["Action to take this week 1", "Action to take this week 2"],
    "shortTerm": ["Action to take in 1-3 months 1", "Action to take in 1-3 months 2"],
    "longTerm": ["Action to take in 6-12 months 1", "Action to take in 6-12 months 2"],
    "resources": {
      "courses": ["Real course name with platform 1", "Real course name with platform 2"],
      "projects": ["Real project idea 1", "Real project idea 2"],
      "certifications": ["Real certification name 1", "Real certification name 2"],
      "networking": ["Specific networking strategy 1", "Specific networking strategy 2"]
    }
  },
  "conversation": [
    {
      "role": "ai",
      "content": "AI-generated insight about their unique combination",
      "timestamp": 1234567890,
      "type": "insight"
    }
  ]
}

FINAL WARNING: Generate the response in ${languageInstructions[language] || languageInstructions['en']}
The entire response must be written in the target language, not in English. This is a strict requirement.`;
      const userJson = JSON.stringify({
        name: userProfile.name,
        currentRole: userProfile.currentRole,
        primaryInterest: userProfile.primaryInterest,
        secondaryInterest: userProfile.secondaryInterest,
        experience: userProfile.experience,
        education: userProfile.education
      });
      const model = gemini.getGenerativeModel({ model: GEMINI_MODEL, systemInstruction: system });
      const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: userJson }] }], generationConfig: { responseMimeType: 'application/json' } });
      const text = result.response.text();
      return parseJsonFromText(text);
    }

    // Enhanced prompt for GPT to generate career discovery insights
    const languageInstructions = {
      'en': 'Generate the response in English.',
      'es': 'Generate the response in Spanish (Español).',
      'fr': 'Generate the response in French (Français).',
      'de': 'Generate the response in German (Deutsch).',
      'it': 'Generate the response in Italian (Italiano).',
      'pt': 'Generate the response in Portuguese (Português).',
      'ru': 'Generate the response in Russian (Русский).',
      'ja': 'Generate the response in Japanese (日本語).',
      'ko': 'Generate the response in Korean (한국어).',
      'zh': 'Generate the response in Chinese (中文).',
      'my': 'Generate the response in Burmese (မြန်မာဘာသာ).',
      'ar': 'Generate the response in Arabic (العربية).',
      'hi': 'Generate the response in Hindi (हिन्दी).',
      'tr': 'Generate the response in Turkish (Türkçe).',
      'pl': 'Generate the response in Polish (Polski).',
      'nl': 'Generate the response in Dutch (Nederlands).',
      'sv': 'Generate the response in Swedish (Svenska).',
      'da': 'Generate the response in Danish (Dansk).',
      'no': 'Generate the response in Norwegian (Norsk).',
      'fi': 'Generate the response in Finnish (Suomi).',
      'cs': 'Generate the response in Czech (Čeština).',
      'hu': 'Generate the response in Hungarian (Magyar).',
      'ro': 'Generate the response in Romanian (Română).',
      'bg': 'Generate the response in Bulgarian (Български).',
      'hr': 'Generate the response in Croatian (Hrvatski).',
      'sk': 'Generate the response in Slovak (Slovenčina).',
      'sl': 'Generate the response in Slovenian (Slovenščina).',
      'et': 'Generate the response in Estonian (Eesti).',
      'lv': 'Generate the response in Latvian (Latviešu).',
      'lt': 'Generate the response in Lithuanian (Lietuvių).',
      'mt': 'Generate the response in Maltese (Malti).',
      'el': 'Generate the response in Greek (Ελληνικά).',
      'he': 'Generate the response in Hebrew (עברית).',
      'th': 'Generate the response in Thai (ไทย).',
      'vi': 'Generate the response in Vietnamese (Tiếng Việt).',
      'id': 'Generate the response in Indonesian (Bahasa Indonesia).',
      'ms': 'Generate the response in Malay (Bahasa Melayu).',
      'tl': 'Generate the response in Filipino (Tagalog).',
      'bn': 'Generate the response in Bengali (বাংলা).',
      'ta': 'Generate the response in Tamil (தமிழ்).',
      'te': 'Generate the response in Telugu (తెలుగు).',
      'ml': 'Generate the response in Malayalam (മലയാളം).',
      'kn': 'Generate the response in Kannada (ಕನ್ನಡ).',
      'gu': 'Generate the response in Gujarati (ગુજરાતી).',
      'pa': 'Generate the response in Punjabi (ਪੰਜਾਬੀ).',
      'or': 'Generate the response in Odia (ଓଡ଼ିଆ).',
      'as': 'Generate the response in Assamese (অসমীয়া).',
      'ne': 'Generate the response in Nepali (नेपाली).',
      'si': 'Generate the response in Sinhala (සිංහල).',
      'km': 'Generate the response in Khmer (ខ្មែរ).',
      'lo': 'Generate the response in Lao (ລາວ).',
      'mn': 'Generate the response in Mongolian (Монгол).',
      'ka': 'Generate the response in Georgian (ქართული).',
      'hy': 'Generate the response in Armenian (Հայերեն).',
      'az': 'Generate the response in Azerbaijani (Azərbaycan).',
      'kk': 'Generate the response in Kazakh (Қазақ).',
      'ky': 'Generate the response in Kyrgyz (Кыргызча).',
      'uz': 'Generate the response in Uzbek (O\'zbek).',
      'tg': 'Generate the response in Tajik (Тоҷикӣ).',
      'fa': 'Generate the response in Persian (فارسی).',
      'ps': 'Generate the response in Pashto (پښتو).',
      'sd': 'Generate the response in Sindhi (سنڌي).',
      'am': 'Generate the response in Amharic (አማርኛ).',
      'sw': 'Generate the response in Swahili (Kiswahili).',
      'yo': 'Generate the response in Yoruba (Yorùbá).',
      'ig': 'Generate the response in Igbo (Igbo).',
      'ha': 'Generate the response in Hausa (Hausa).',
      'zu': 'Generate the response in Zulu (isiZulu).',
      'xh': 'Generate the response in Xhosa (isiXhosa).',
      'af': 'Generate the response in Afrikaans (Afrikaans).',
      'is': 'Generate the response in Icelandic (Íslenska).',
      'fo': 'Generate the response in Faroese (Føroyskt).',
      'ga': 'Generate the response in Irish (Gaeilge).',
      'cy': 'Generate the response in Welsh (Cymraeg).',
      'eu': 'Generate the response in Basque (Euskara).',
      'ca': 'Generate the response in Catalan (Català).',
      'gl': 'Generate the response in Galician (Galego).',
      'sq': 'Generate the response in Albanian (Shqip).',
      'mk': 'Generate the response in Macedonian (Македонски).',
      'sr': 'Generate the response in Serbian (Српски).',
      'bs': 'Generate the response in Bosnian (Bosanski).',
      'me': 'Generate the response in Montenegrin (Crnogorski).',
      'uk': 'Generate the response in Ukrainian (Українська).',
      'be': 'Generate the response in Belarusian (Беларуская).',
      'zh-tw': 'Generate the response in Traditional Chinese (繁體中文).',
      'zh-hk': 'Generate the response in Hong Kong Chinese (香港繁體中文).',
      'zh-sg': 'Generate the response in Singapore Chinese (新加坡中文).',
      'zh-cn': 'Generate the response in Simplified Chinese (简体中文).'
    };

    const enhancedPrompt = `You are an expert career discovery specialist with deep knowledge of how different skills and interests can combine to create unique career opportunities.

CRITICAL LANGUAGE REQUIREMENT: You MUST generate the response in ${languageInstructions[language] || languageInstructions['en']}
ABSOLUTELY NO ENGLISH: The entire response must be written in the specified language. Do NOT use English under any circumstances.

${languageInstructions[language] || languageInstructions['en']}

Based on the user's profile, discover unexpected career possibilities that combine their current role with their interests. Think creatively about how their existing skills can transfer to new fields.

User Profile: ${JSON.stringify(userProfile, null, 2)}

CRITICAL INSTRUCTIONS:
1. Analyze how their current role skills can transfer to new career paths
2. Discover unexpected combinations that leverage their interests
3. Provide realistic career paths that actually exist in the market
4. Show specific transferable skills from their current role
5. Identify realistic skill gaps they need to develop
6. Give actionable next steps
7. Use real company names and realistic salary ranges
8. Make recommendations highly personalized to their unique combination

Return the response in this exact JSON format:
{
  "careerPaths": [
    {
      "title": "Real career path title that combines their current role and interests",
      "description": "Detailed description of how this career path connects their current skills and interests",
      "transferableSkills": ["Skill 1 from current role", "Skill 2 from current role", "Skill 3 from current role"],
      "skillGaps": ["Specific skill to develop 1", "Specific skill to develop 2", "Specific skill to develop 3"],
      "marketDemand": "High/Medium/Low based on current market trends",
      "salaryRange": "Realistic salary range for this role",
      "companies": ["Real company 1", "Real company 2", "Real company 3"],
      "nextSteps": ["Specific actionable step 1", "Specific actionable step 2", "Specific actionable step 3"]
    }
  ],
  "learningRoadmap": {
    "immediate": ["Action to take this week 1", "Action to take this week 2"],
    "shortTerm": ["Action to take in 1-3 months 1", "Action to take in 1-3 months 2"],
    "longTerm": ["Action to take in 6-12 months 1", "Action to take in 6-12 months 2"],
    "resources": {
      "courses": ["Real course name with platform 1", "Real course name with platform 2"],
      "projects": ["Real project idea 1", "Real project idea 2"],
      "certifications": ["Real certification name 1", "Real certification name 2"],
      "networking": ["Specific networking strategy 1", "Specific networking strategy 2"]
    }
  },
  "conversation": [
    {
      "role": "ai",
      "content": "AI-generated insight about their unique combination",
      "timestamp": 1234567890,
      "type": "insight"
    }
  ]
}

FINAL WARNING: Generate the response in ${languageInstructions[language] || languageInstructions['en']}
The entire response must be written in the target language, not in English. This is a strict requirement.`;

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: `You are an expert career discovery specialist. You MUST generate content in the language specified by the user. NEVER use English unless specifically requested. Analyze the user profile and return strict JSON in the exact format requested.`
        },
        {
          role: "user",
          content: enhancedPrompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7, // Higher creativity for discovering unexpected combinations
      max_tokens: 3000, // Increased for comprehensive career discovery
      top_p: 0.9,
    });

    const response = completion.choices[0].message.content;
    return parseJsonFromText(response);
  } catch (error) {
    const msg = extractOpenAIError(error);
    console.error('OpenAI API error (career-discovery):', msg);
    throw new Error('Failed to generate career discovery: ' + msg);
  }
}

async function generateCareerStory(userProfile, storyType, language = 'en') {
  const languageInstructions = {
    'en': 'Generate the story in English.',
    'es': 'Generate the story in Spanish (Español).',
    'fr': 'Generate the story in French (Français).',
    'de': 'Generate the story in German (Deutsch).',
    'it': 'Generate the story in Italian (Italiano).',
    'pt': 'Generate the story in Portuguese (Português).',
    'ru': 'Generate the story in Russian (Русский).',
    'ja': 'Generate the story in Japanese (日本語).',
    'ko': 'Generate the story in Korean (한국어).',
    'zh': 'Generate the story in Chinese (中文).',
    'my': 'Generate the story in Burmese (မြန်မာဘာသာ).',
    'ar': 'Generate the story in Arabic (العربية).',
    'hi': 'Generate the story in Hindi (हिन्दी).',
    'tr': 'Generate the story in Turkish (Türkçe).',
    'pl': 'Generate the story in Polish (Polski).',
    'nl': 'Generate the story in Dutch (Nederlands).',
    'sv': 'Generate the story in Swedish (Svenska).',
    'da': 'Generate the story in Danish (Dansk).',
    'no': 'Generate the story in Norwegian (Norsk).',
    'fi': 'Generate the story in Finnish (Suomi).',
    'cs': 'Generate the story in Czech (Čeština).',
    'hu': 'Generate the story in Hungarian (Magyar).',
    'ro': 'Generate the story in Romanian (Română).',
    'bg': 'Generate the story in Bulgarian (Български).',
    'hr': 'Generate the story in Croatian (Hrvatski).',
    'sk': 'Generate the story in Slovak (Slovenčina).',
    'sl': 'Generate the story in Slovenian (Slovenščina).',
    'et': 'Generate the story in Estonian (Eesti).',
    'lv': 'Generate the story in Latvian (Latviešu).',
    'lt': 'Generate the story in Lithuanian (Lietuvių).',
    'mt': 'Generate the story in Maltese (Malti).',
    'el': 'Generate the story in Greek (Ελληνικά).',
    'he': 'Generate the story in Hebrew (עברית).',
    'th': 'Generate the story in Thai (ไทย).',
    'vi': 'Generate the story in Vietnamese (Tiếng Việt).',
    'id': 'Generate the story in Indonesian (Bahasa Indonesia).',
    'ms': 'Generate the story in Malay (Bahasa Melayu).',
    'tl': 'Generate the story in Filipino (Tagalog).',
    'bn': 'Generate the story in Bengali (বাংলা).',
    'ta': 'Generate the story in Tamil (தமிழ்).',
    'te': 'Generate the story in Telugu (తెలుగు).',
    'ml': 'Generate the story in Malayalam (മലയാളം).',
    'kn': 'Generate the story in Kannada (ಕನ್ನಡ).',
    'gu': 'Generate the story in Gujarati (ગુજરાતી).',
    'pa': 'Generate the story in Punjabi (ਪੰਜਾਬੀ).',
    'or': 'Generate the story in Odia (ଓଡ଼ିଆ).',
    'as': 'Generate the story in Assamese (অসমীয়া).',
    'ne': 'Generate the story in Nepali (नेपाली).',
    'si': 'Generate the story in Sinhala (සිංහල).',
    'my': 'Generate the story in Burmese (မြန်မာဘာသာ).',
    'km': 'Generate the story in Khmer (ខ្មែរ).',
    'lo': 'Generate the story in Lao (ລາວ).',
    'mn': 'Generate the story in Mongolian (Монгол).',
    'ka': 'Generate the story in Georgian (ქართული).',
    'hy': 'Generate the story in Armenian (Հայերեն).',
    'az': 'Generate the story in Azerbaijani (Azərbaycan).',
    'kk': 'Generate the story in Kazakh (Қазақ).',
    'ky': 'Generate the story in Kyrgyz (Кыргызча).',
    'uz': 'Generate the story in Uzbek (O\'zbek).',
    'tg': 'Generate the story in Tajik (Тоҷикӣ).',
    'fa': 'Generate the story in Persian (فارسی).',
    'ps': 'Generate the story in Pashto (پښتو).',
    'sd': 'Generate the story in Sindhi (سنڌي).',
    'am': 'Generate the story in Amharic (አማርኛ).',
    'sw': 'Generate the story in Swahili (Kiswahili).',
    'yo': 'Generate the story in Yoruba (Yorùbá).',
    'ig': 'Generate the story in Igbo (Igbo).',
    'ha': 'Generate the story in Hausa (Hausa).',
    'zu': 'Generate the story in Zulu (isiZulu).',
    'xh': 'Generate the story in Xhosa (isiXhosa).',
    'af': 'Generate the story in Afrikaans (Afrikaans).',
    'is': 'Generate the story in Icelandic (Íslenska).',
    'fo': 'Generate the story in Faroese (Føroyskt).',
    'ga': 'Generate the story in Irish (Gaeilge).',
    'cy': 'Generate the story in Welsh (Cymraeg).',
    'eu': 'Generate the story in Basque (Euskara).',
    'ca': 'Generate the story in Catalan (Català).',
    'gl': 'Generate the story in Galician (Galego).',
    'sq': 'Generate the story in Albanian (Shqip).',
    'mk': 'Generate the story in Macedonian (Македонски).',
    'sr': 'Generate the story in Serbian (Српски).',
    'bs': 'Generate the story in Bosnian (Bosanski).',
    'me': 'Generate the story in Montenegrin (Crnogorski).',
    'uk': 'Generate the story in Ukrainian (Українська).',
    'be': 'Generate the story in Belarusian (Беларуская).',
    'zh-tw': 'Generate the story in Traditional Chinese (繁體中文).',
    'zh-hk': 'Generate the story in Hong Kong Chinese (香港繁體中文).',
    'zh-sg': 'Generate the story in Singapore Chinese (新加坡中文).',
    'zh-cn': 'Generate the story in Simplified Chinese (简体中文).'
  };

  const prompt = `You are an expert career storyteller and personal branding specialist. 

CRITICAL LANGUAGE REQUIREMENT: You MUST generate the story in ${languageInstructions[language] || languageInstructions['en']}
ABSOLUTELY NO ENGLISH: The entire story must be written in the specified language. Do NOT use English under any circumstances.

${languageInstructions[language] || languageInstructions['en']}

Create a compelling ${storyType} story for this person:

Name: ${userProfile.name}
Current Role: ${userProfile.currentRole}
Experience: ${userProfile.experience}
Education: ${userProfile.education}
Key Skills: ${userProfile.keySkills.join(', ')}
Achievements: ${userProfile.achievements.join(', ')}
Career Goals: ${userProfile.careerGoals}
Personal Interests: ${userProfile.personalInterests.join(', ')}

Generate a ${storyType} story that is:

${storyType === 'interview' ? 
  '1. A compelling 2-3 minute story for "Tell me about yourself" or "Walk me through your background"\n' +
  '2. Shows progression and growth\n' +
  '3. Highlights key achievements and skills\n' +
  '4. Connects personal interests to professional goals\n' +
  '5. Ends with current role and future aspirations' :
  storyType === 'linkedin' ? 
  '1. A professional LinkedIn bio (150-200 words)\n' +
  '2. Shows personality and expertise\n' +
  '3. Includes relevant keywords for recruiters\n' +
  '4. Has a clear call-to-action\n' +
  '5. Professional yet approachable tone' :
  storyType === 'networking' ? 
  '1. A 30-second elevator pitch for networking events\n' +
  '2. Clear value proposition\n' +
  '3. Memorable and engaging\n' +
  '4. Easy to remember and repeat\n' +
  '5. Opens conversation naturally' :
  '1. A compelling resume summary (3-4 sentences)\n' +
  '2. Highlights key achievements and skills\n' +
  '3. Shows career progression\n' +
  '4. Tailored for their target role\n' +
  '5. Professional and impactful'
}

6. Use their actual name, role, and achievements
7. Make it personal and authentic
8. Show passion and enthusiasm
9. Keep it concise but impactful
10. Use active voice and strong verbs

FINAL WARNING: Generate the story in ${languageInstructions[language] || languageInstructions['en']}
The story must be written in the target language, not in English. This is a strict requirement.

Return ONLY the story content, no additional formatting or explanations.`

  try {
    if (PROVIDER === 'azure' || PROVIDER === 'openai') {
      const response = await openai.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a career storyteller. You MUST generate content in the language specified by the user. NEVER use English unless specifically requested.`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 500,
        response_format: { type: 'text' }
      })
      return { story: response.choices[0].message.content.trim() }
    } else if (PROVIDER === 'gemini') {
      const model = gemini.getGenerativeModel({ 
        model: GEMINI_MODEL,
        systemInstruction: `You are a career storyteller. You MUST generate content in the language specified by the user. NEVER use English unless specifically requested.`
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return { story: response.text().trim() }
    }
  } catch (error) {
    console.error('Error generating career story:', error)
    throw new Error('Failed to generate career story')
  }
}

module.exports = {
  generateCareerGuidance,
  generateMockInterview,
  generateJobSuggestions,
  evaluateInterviewAnswer,
  generateCareerDiscovery,
  generateCareerStory
};
