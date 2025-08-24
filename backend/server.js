const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// FORCE RENDER REDEPLOYMENT - Enhanced validation logging is ready!
const connectDB = require('./config/database');

// Import authentication middleware early
const { authenticateToken, generateToken } = require('./middleware/auth');
const User = require('./models/User');

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'https://hackathon-career-mate-alcholic-hut-eight.vercel.app',
    'https://careermate-frontend.onrender.com',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// Handle CORS preflight requests
app.options('*', cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  trustProxy: true // Trust proxy headers from Render
});

// Enable trust proxy for deployed environments
app.set('trust proxy', 1);

// Apply rate limiting to all API routes except auth
app.use('/api/career-guidance', limiter);
app.use('/api/mock-interview', limiter);
app.use('/api/evaluate-answer', limiter);
app.use('/api/job-suggestions', limiter);
app.use('/api/career-storyteller', limiter);
app.use('/api/career-guidance/:id', limiter);
app.use('/api/mock-interviews/:id', limiter);
app.use('/api/job-suggestions/:id', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'CareerMate API is running' });
});

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({ status: 'OK', message: 'Test endpoint is working' });
});

// Route list endpoint for debugging
app.get('/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods);
      routes.push({
        path: middleware.route.path,
        methods: methods
      });
    }
  });
  res.json({ 
    status: 'OK', 
    message: 'Registered routes',
    routes: routes
  });
});

// Auth health check endpoint
app.get('/api/auth/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Authentication endpoints are working',
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/profile',
      'PUT /api/auth/profile'
    ]
  });
});

// Test auth endpoint
app.get('/api/auth/test', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Auth test endpoint is working',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint for testing
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CareerMate Backend API is running',
    endpoints: [
      '🔐 AUTH:',
      '  POST /api/auth/register',
      '  POST /api/auth/login',
      '  GET /api/auth/profile',
      '  PUT /api/auth/profile',
      '🎯 CAREER:',
      '  POST /api/career-guidance',
      '  POST /api/mock-interview', 
      '  POST /api/evaluate-answer',
      '  POST /api/job-suggestions',
      '  POST /api/career-storyteller'
    ]
  });
});

// AI service integration - all responses come from AI APIs

// Helper function to validate AI response structure
function validateAIResponse(response, expectedFields) {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid AI response: response must be an object');
  }
  
  for (const field of expectedFields) {
    if (!(field in response)) {
      console.warn(`Missing field in AI response: ${field}`);
    }
  }
  
  return response;
}

// Career Guidance API
app.post('/api/career-guidance', authenticateToken, async (req, res) => {
  try {
    const { skills, interests, goals, experience, education } = req.body;
    
    if (!skills || !interests || !goals) {
      return res.status(400).json({ 
        error: 'Missing required fields: skills, interests, and goals are required' 
      });
    }

    const openaiService = require('./services/openai');
    const aiResponse = await openaiService.generateCareerGuidance({
      skills, interests, goals, experience, education
    });

    // Validate AI response structure
    validateAIResponse(aiResponse, ['careerPaths', 'skillRecommendations', 'actionPlan']);

    // Log the AI response for debugging
    console.log('AI Response for Career Guidance:', JSON.stringify(aiResponse, null, 2));

    // Save to database with userId
    const CareerGuidance = require('./models/CareerGuidance');
    const careerGuidance = new CareerGuidance({
      userId: req.user._id, // Add this line!
      userProfile: { skills, interests, goals, experience, education },
      guidance: {
        careerPaths: aiResponse.careerPaths || [],
        skillRecommendations: aiResponse.skillRecommendations || [],
        actionPlan: aiResponse.actionPlan || {}
      }
    });

    await careerGuidance.save();

    res.json(aiResponse);
  } catch (error) {
    console.error('Career guidance error:', error);
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Data validation failed', 
        details: error.message 
      });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mock Interview API
app.post('/api/mock-interview', authenticateToken, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role) {
      return res.status(400).json({ error: 'Job role is required' });
    }

    const openaiService = require('./services/openai');
    const questions = await openaiService.generateMockInterview(role);
    
    // Initialize feedback array for each question
    const feedback = questions.questions.map(() => ({
      score: 0,
      feedback: '',
      improvements: []
    }));

    const response = {
      ...questions,
      feedback,
      overallScore: 0,
      summary: 'Complete the interview to get your overall score and summary.'
    };

    // Save to database with userId
    const MockInterview = require('./models/MockInterview');
    const mockInterview = new MockInterview({
      userId: req.user._id, // Add this line!
      role,
      questions: questions.questions,
      answers: [],
      overallScore: 0,
      summary: 'Complete the interview to get your overall score and summary.',
      completed: false
    });

    await mockInterview.save();

    res.json(response);
  } catch (error) {
    console.error('Mock interview error:', error);
    const message = typeof error?.message === 'string' ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
});

// Interview Answer Evaluation API
app.post('/api/evaluate-answer', async (req, res) => {
  try {
    const { question, answer, role } = req.body;
    
    if (!question || !answer || !role) {
      return res.status(400).json({ error: 'Question, answer, and role are required' });
    }

    const openaiService = require('./services/openai');
    const feedback = await openaiService.evaluateInterviewAnswer(question, answer, role);
    
    res.json(feedback);
  } catch (error) {
    console.error('Answer evaluation error:', error);
    const message = typeof error?.message === 'string' ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
});

// Job Suggestions API
app.post('/api/job-suggestions', authenticateToken, async (req, res) => {
  try {
    const { skills, experience, location, preferredRole, education, interests } = req.body;
    
    if (!skills || !experience || !location || !preferredRole) {
      return res.status(400).json({ 
        error: 'Missing required fields: skills, experience, location, and preferredRole are required' 
      });
    }

    const openaiService = require('./services/openai');
    const aiResponse = await openaiService.generateJobSuggestions({
      skills, experience, location, preferredRole, education, interests
    });

    // Save to database with userId
    const JobSuggestion = require('./models/JobSuggestion');
    const jobSuggestion = new JobSuggestion({
      userId: req.user._id, // Add this line!
      userProfile: { skills, experience, location, preferredRole, education, interests },
      suggestions: aiResponse.suggestions
    });

    await jobSuggestion.save();

    res.json(aiResponse);
  } catch (error) {
    console.error('Job suggestions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Career Storyteller API
app.post('/api/career-storyteller', async (req, res) => {
  try {
    const { storyType, ...userProfile } = req.body;
    
    if (!storyType || !userProfile.name || !userProfile.currentRole) {
      return res.status(400).json({ 
        error: 'Missing required fields: storyType, name, and currentRole are required' 
      });
    }

    const openaiService = require('./services/openai');
    const response = await openaiService.generateCareerStory(userProfile, storyType);

    res.json(response);
  } catch (error) {
    console.error('Career storyteller error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Personality Analysis endpoint
app.post('/api/analyze-personality', async (req, res) => {
  try {
    const { answers } = req.body

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Invalid answers format' })
    }

    // Use existing OpenAI service functions
    const openaiService = require('./services/openai')
    
    // Create a mock user profile based on personality answers
    const mockProfile = {
      skills: answers.join(', '),
      interests: 'Personality-based career guidance',
      goals: 'Career development based on work preferences',
      experience: 'Entry level',
      education: 'Self-assessment',
      location: 'Remote',
      preferredRole: 'Career guidance'
    }

    // Use the existing generateCareerGuidance function
    const careerData = await openaiService.generateCareerGuidance(mockProfile)
    
    // Transform the response to match personality format
    const personalityResponse = {
      insight: `Based on your work preferences (${answers.join(', ')}), you have a unique approach to projects and collaboration.`,
      careers: careerData.careerPaths.slice(0, 3), // Take first 3 career paths
      workStyle: `Your preferences suggest a ${answers.includes('A') ? 'structured' : answers.includes('B') ? 'dynamic' : 'collaborative'} work approach.`,
      learningStyle: `You learn best through ${answers.includes('A') ? 'systematic study' : answers.includes('B') ? 'hands-on experience' : 'discussion and collaboration'}.`
    }

    res.json(personalityResponse)

  } catch (error) {
    console.error('Personality analysis error:', error)
    
    // Fallback response if OpenAI fails
    const fallbackResponse = {
      insight: "Based on your preferences, you have a unique work style that can be leveraged for career success.",
      careers: ["Career Development", "Professional Growth", "Skill Building"],
      workStyle: "Your work preferences suggest a balanced approach to projects and collaboration.",
      learningStyle: "You adapt well to different learning environments and methods."
    }
    res.json(fallbackResponse)
  }
})

// Delete career guidance session
app.delete('/api/career-guidance/:id', authenticateToken, async (req, res) => {
  try {
    const CareerGuidance = require('./models/CareerGuidance');
    const guidance = await CareerGuidance.findByIdAndDelete(req.params.id);
    if (!guidance) {
      return res.status(404).json({ error: 'Career guidance session not found' });
    }
    res.json({ message: 'Career guidance session deleted successfully' });
  } catch (error) {
    console.error('Error deleting career guidance session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete mock interview
app.delete('/api/mock-interviews/:id', authenticateToken, async (req, res) => {
  try {
    const MockInterview = require('./models/MockInterview');
    const interview = await MockInterview.findByIdAndDelete(req.params.id);
    if (!interview) {
      return res.status(404).json({ error: 'Mock interview not found' });
    }
    res.json({ message: 'Mock interview deleted successfully' });
  } catch (error) {
    console.error('Error deleting mock interview:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete job suggestion
app.delete('/api/job-suggestions/:id', authenticateToken, async (req, res) => {
  try {
    const JobSuggestion = require('./models/JobSuggestion');
    const suggestion = await JobSuggestion.findByIdAndDelete(req.params.id);
    if (!suggestion) {
      return res.status(404).json({ error: 'Job suggestion not found' });
    }
    res.json({ message: 'Job suggestion deleted successfully' });
  } catch (error) {
    console.error('Error deleting job suggestion:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's saved career guidance sessions
app.get('/api/career-guidance', authenticateToken, async (req, res) => {
  try {
    const CareerGuidance = require('./models/CareerGuidance');
    const sessions = await CareerGuidance.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(10);
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching career guidance sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's saved mock interviews
app.get('/api/mock-interviews', authenticateToken, async (req, res) => {
  try {
    const MockInterview = require('./models/MockInterview');
    const interviews = await MockInterview.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(10);
    res.json(interviews);
  } catch (error) {
    console.error('Error fetching mock interviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's saved job suggestions
app.get('/api/job-suggestions', authenticateToken, async (req, res) => {
  try {
    const JobSuggestion = require('./models/JobSuggestion');
    const suggestions = await JobSuggestion.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(10);
    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching job suggestions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Authentication routes
console.log('🔐 Loading authentication routes...');
console.log('✅ Authentication middleware loaded');

// User registration
console.log('🔐 Registering /api/auth/register route');
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, profile } = req.body;
    
    // Log the received data for debugging
    console.log('🔐 Registration attempt with data:', {
      email: email ? 'provided' : 'missing',
      password: password ? 'provided' : 'missing',
      firstName: firstName ? 'provided' : 'missing',
      lastName: lastName ? 'provided' : 'missing',
      profile: profile ? 'provided' : 'missing'
    });
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      profile: profile || {}
    });
    
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      console.error('Validation details:', error.message);
      console.error('Validation errors:', error.errors);
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.message,
        fieldErrors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User login
console.log('🔐 Registering /api/auth/login route');
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    res.json({
      message: 'Login successful',
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, profile } = req.body;
    
    const user = await User.findById(req.user._id);
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (profile) user.profile = { ...user.profile, ...profile };
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 CareerMate Backend running on port ${PORT}`);
  console.log(`📚 API endpoints:`);
  console.log(`   🔐 AUTH:`);
  console.log(`      POST /api/auth/register`);
  console.log(`      POST /api/auth/login`);
  console.log(`      GET /api/auth/profile`);
  console.log(`      PUT /api/auth/profile`);
  console.log(`   🎯 CAREER:`);
  console.log(`      POST /api/career-guidance`);
  console.log(`      POST /api/mock-interview`);
  console.log(`      POST /api/evaluate-answer`);
  console.log(`      POST /api/job-suggestions`);
  console.log(`      POST /api/career-storyteller`);
  console.log(`      GET /api/career-guidance`);
  console.log(`      DELETE /api/career-guidance/:id`);
  console.log(`      GET /api/mock-interviews`);
  console.log(`      DELETE /api/mock-interviews/:id`);
  console.log(`      GET /api/job-suggestions`);
  console.log(`      DELETE /api/job-suggestions/:id`);

  console.log(`🔑 Remember to set your AI API credentials in your .env file`);
});
