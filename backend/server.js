const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
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

// Feature flag to enable mock AI responses (useful for demos when API quota is exhausted)
const useMockAi = process.env.USE_MOCK_AI === 'true';

// Career Guidance API
app.post('/api/career-guidance', async (req, res) => {
  try {
    const { skills, interests, goals, experience, education } = req.body;
    
    if (!skills || !interests || !goals) {
      return res.status(400).json({ 
        error: 'Missing required fields: skills, interests, and goals are required' 
      });
    }

    if (useMockAi) {
      return res.json({
        careerPaths: [
          'Full-Stack Developer',
          'Data Analyst',
          'Machine Learning Engineer',
          'DevOps Engineer',
          'Product Manager'
        ],
        skillGaps: [
          'Advanced JavaScript (React/Next.js)',
          'Cloud fundamentals (AWS/GCP/Azure)',
          'SQL and database optimization',
          'System design basics',
          'CI/CD tooling'
        ],
        learningRoadmap: {
          courses: [
            'Meta Front-End Developer (Coursera)',
            'Google Data Analytics (Coursera)',
            'AWS Cloud Practitioner Essentials',
            'Grokking System Design',
            'Docker & Kubernetes Fundamentals'
          ],
          projects: [
            'Build a full-stack task manager with auth',
            'Create a data dashboard from a public dataset',
            'Deploy a containerized API and frontend',
            'Implement a small-scale recommendation system',
            'Automate CI with GitHub Actions'
          ],
          timeline: '3-6 months'
        }
      });
    }

    const openaiService = require('./services/openai');
    const response = await openaiService.generateCareerGuidance({
      skills, interests, goals, experience, education
    });

    res.json(response);
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

    if (useMockAi) {
      const questions = {
        questions: [
          { question: `Explain key responsibilities of a ${role}.`, tips: ['Structure your answer', 'Give examples'], category: 'Behavioral' },
          { question: 'Describe a challenging project and your contribution.', tips: ['Focus on impact', 'Quantify results'], category: 'Behavioral' },
          { question: 'How would you design a scalable API for search?', tips: ['Discuss endpoints', 'Consider caching and pagination'], category: 'System Design' },
          { question: 'Debugging scenario: intermittent 500 errors in production. Steps?', tips: ['Logs/metrics', 'Rollback and canary'], category: 'Problem Solving' },
          { question: 'What recent trend in the industry excites you and why?', tips: ['Relate to the role', 'Show curiosity'], category: 'Industry Knowledge' }
        ]
      };
      const feedback = questions.questions.map(() => ({ score: 0, feedback: '', improvements: [] }));
      return res.json({ ...questions, feedback, overallScore: 0, summary: 'Complete the interview to get your score.' });
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

    res.json(response);
  } catch (error) {
    console.error('Mock interview error:', error);
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

    if (useMockAi) {
      return res.json({
        opportunities: [
          {
            title: `${preferredRole} Intern`,
            company: 'Acme Corp',
            location: location || 'Remote',
            type: 'Internship',
            requiredSkills: (skills || '').split(',').slice(0, 3).map(s => s.trim()).filter(Boolean),
            description: 'Work with mentors on real features. Learn modern workflows.',
            salary: 'Stipend',
            applicationLink: 'https://example.com/apply',
            postedDate: 'Recently'
          },
          {
            title: `${preferredRole}`,
            company: 'Globex',
            location: location || 'Hybrid',
            type: 'Full-time',
            requiredSkills: ['JavaScript', 'React', 'API'],
            description: 'Build user-facing features and collaborate across teams.',
            salary: '$60k-$90k',
            applicationLink: 'https://example.com/apply2',
            postedDate: 'This week'
          }
        ],
        skillMatch: { 'JavaScript': 85, 'React': 75, 'Communication': 70 },
        recommendations: [
          'Polish your portfolio with 2-3 targeted projects',
          'Tailor your resume to highlight role-specific achievements',
          'Network with peers and attend virtual meetups'
        ]
      });
    }

    const openaiService = require('./services/openai');
    const response = await openaiService.generateJobSuggestions({
      skills, experience, location, preferredRole, education, interests
    });

    res.json(response);
  } catch (error) {
    console.error('Job suggestions error:', error);
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
  console.log(`   POST /api/job-suggestions`);
  console.log(`🔑 Remember to set OPENAI_API_KEY in your .env file`);
});
