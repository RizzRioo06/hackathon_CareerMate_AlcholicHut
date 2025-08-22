const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');

// Connect to database
connectDB();

// ... rest of your existing code

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: true, // Allow all origins in production
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({               
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'CareerMate API is running' });
});

// Root endpoint for testing
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CareerMate Backend API is running',
    endpoints: [
      'POST /api/career-guidance',
      'POST /api/mock-interview', 
      'POST /api/evaluate-answer',
      'POST /api/job-suggestions'
    ]
  });
});

// AI service integration - all responses come from AI APIs

// Career Guidance API
app.post('/api/career-guidance', async (req, res) => {
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

    // Save to database
    const CareerGuidance = require('./models/CareerGuidance');
    const careerGuidance = new CareerGuidance({
      userProfile: { skills, interests, goals, experience, education },
      guidance: aiResponse
    });

    await careerGuidance.save();

    res.json(aiResponse);
  } catch (error) {
    console.error('Career guidance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mock Interview API
app.post('/api/mock-interview', async (req, res) => {
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

    // Save to database
    const MockInterview = require('./models/MockInterview');
    const mockInterview = new MockInterview({
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
app.post('/api/job-suggestions', async (req, res) => {
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

    // Save to database
    const JobSuggestion = require('./models/JobSuggestion');
    const jobSuggestion = new JobSuggestion({
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

// Career Discovery API
app.post('/api/career-discovery', async (req, res) => {
  try {
    const { name, currentRole, primaryInterest, secondaryInterest, experience, education } = req.body;
    
    if (!name || !currentRole || !primaryInterest) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, currentRole, and primaryInterest are required' 
      });
    }

    const openaiService = require('./services/openai');
    const aiResponse = await openaiService.generateCareerDiscovery({
      name, currentRole, primaryInterest, secondaryInterest, experience, education
    });

    // Save to database
    const CareerDiscovery = require('./models/CareerDiscovery');
    const careerDiscovery = new CareerDiscovery({
      userProfile: { name, currentRole, primaryInterest, secondaryInterest, experience, education },
      careerPaths: aiResponse.careerPaths,
      learningRoadmap: aiResponse.learningRoadmap,
      conversation: aiResponse.conversation
    });

    await careerDiscovery.save();

    res.json(aiResponse);
  } catch (error) {
    console.error('Career discovery error:', error);
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

// Get saved career discoveries
app.get('/api/career-discoveries', async (req, res) => {
  try {
    const CareerDiscovery = require('./models/CareerDiscovery');
    const discoveries = await CareerDiscovery.find().sort({ createdAt: -1 }).limit(10);
    res.json(discoveries);
  } catch (error) {
    console.error('Error fetching discoveries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific career discovery by ID
app.get('/api/career-discoveries/:id', async (req, res) => {
  try {
    const CareerDiscovery = require('./models/CareerDiscovery');
    const discovery = await CareerDiscovery.findById(req.params.id);
    if (!discovery) {
      return res.status(404).json({ error: 'Discovery not found' });
    }
    res.json(discovery);
  } catch (error) {
    console.error('Error fetching discovery:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete career discovery
app.delete('/api/career-discoveries/:id', async (req, res) => {
  try {
    const CareerDiscovery = require('./models/CareerDiscovery');
    const discovery = await CareerDiscovery.findByIdAndDelete(req.params.id);
    if (!discovery) {
      return res.status(404).json({ error: 'Discovery not found' });
    }
    res.json({ message: 'Discovery deleted successfully' });
  } catch (error) {
    console.error('Error deleting discovery:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all saved career guidance sessions
app.get('/api/career-guidance', async (req, res) => {
  try {
    const CareerGuidance = require('./models/CareerGuidance');
    const sessions = await CareerGuidance.find().sort({ createdAt: -1 }).limit(10);
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching career guidance sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all saved mock interviews
app.get('/api/mock-interviews', async (req, res) => {
  try {
    const MockInterview = require('./models/MockInterview');
    const interviews = await MockInterview.find().sort({ createdAt: -1 }).limit(10);
    res.json(interviews);
  } catch (error) {
    console.error('Error fetching mock interviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all saved job suggestions
app.get('/api/job-suggestions', async (req, res) => {
  try {
    const JobSuggestion = require('./models/JobSuggestion');
    const suggestions = await JobSuggestion.find().sort({ createdAt: -1 }).limit(10);
    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching job suggestions:', error);
    res.status(500).json({ error: 'Internal server error' });
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
  console.log(`   POST /api/career-guidance`);
  console.log(`   POST /api/mock-interview`);
  console.log(`   POST /api/evaluate-answer`);
  console.log(`   POST /api/job-suggestions`);
  console.log(`   POST /api/career-discovery`);
  console.log(`   POST /api/career-storyteller`);
  console.log(`   GET /api/career-discoveries`);
  console.log(`   GET /api/career-discoveries/:id`);
  console.log(`   DELETE /api/career-discoveries/:id`);
  console.log(`   GET /api/career-guidance`);
  console.log(`   GET /api/mock-interviews`);
  console.log(`   GET /api/job-suggestions`);

  console.log(`🔑 Remember to set your AI API credentials in your .env file`);
});
