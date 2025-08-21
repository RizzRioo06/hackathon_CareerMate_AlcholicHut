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
async function generateCareerDiscovery(userProfile) {
  try {
    if (PROVIDER === 'gemini') {
      const system = `You are an expert career discovery specialist. Analyze the user's unique combination of current role and interests to discover unexpected career possibilities. Return strict JSON in this exact format:
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
}`;
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
    const enhancedPrompt = `You are an expert career discovery specialist with deep knowledge of how different skills and interests can combine to create unique career opportunities.

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
}`;

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert career discovery specialist. Analyze the user profile and return strict JSON in the exact format requested."
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



module.exports = {
  generateCareerGuidance,
  generateMockInterview,
  generateJobSuggestions,
  evaluateInterviewAnswer,
  generateCareerDiscovery
};
