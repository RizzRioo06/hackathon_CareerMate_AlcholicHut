# CareerMate - AI Career & Interview Mentor 🚀

A comprehensive web application that provides AI-powered career guidance, mock interview practice, and personalized job recommendations using Next.js, TailwindCSS, and OpenAI GPT-5 integration.

## ✨ Features

### 🎯 Career Guidance Mode
- **Personalized Career Paths**: AI analyzes your skills, interests, and goals to recommend suitable career paths
- **Skill Gap Analysis**: Identifies specific skills you need to develop for your target roles
- **Learning Roadmap**: Provides curated course recommendations and project ideas with realistic timelines

### 💬 Mock Interview Mode
- **Role-Specific Questions**: 5 tailored interview questions based on your target job role
- **Pro Tips**: Helpful guidance for each question to improve your answers
- **Real-time Feedback**: AI evaluates your responses and provides scoring and improvement suggestions
- **Progress Tracking**: Visual progress bar and question navigation

### 💼 Job Opportunity Mode
- **Personalized Matches**: AI suggests 5 relevant job/internship opportunities based on your profile
- **Skill Match Analysis**: Visual representation of how well your skills align with job requirements
- **Career Recommendations**: Actionable advice to improve your job search success

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **OpenAI API** - GPT-5 integration for AI responses
- **Rate Limiting** - API protection
- **CORS & Helmet** - Security middleware

### Optional (Future)
- **Firebase/Supabase** - User authentication and data storage
- **Vercel** - Frontend deployment
- **Railway/Render** - Backend deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd careermate
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
```

### 4. Environment Setup
Create a `.env` file in the backend directory:
```bash
cd backend
cp env.example .env
```

Edit `.env` and add your OpenAI or OpenAI-compatible provider settings:
```env
# Standard OpenAI
OPENAI_API_KEY=your_actual_openai_or_provider_api_key_here
OPENAI_MODEL=gpt-4o-mini

# Optional: OpenAI-compatible provider (e.g., AIMLAPI)
# Set base URL to route requests through that provider
# Example: https://api.aimlapi.com/v1
OPENAI_BASE_URL=
# Set to true to force HTTP client instead of the OpenAI SDK
# USE_OPENAI_HTTP=false

# Azure OpenAI (alternative)
# AZURE_OPENAI_ENDPOINT=https://<your-resource>.openai.azure.com
# AZURE_OPENAI_API_KEY=your_azure_key
# AZURE_OPENAI_DEPLOYMENT=your_deployment_name
# AZURE_OPENAI_API_VERSION=2024-06-01
PORT=5000
NODE_ENV=development
```

### 5. Start the Backend
```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

### 6. Start the Frontend
In a new terminal:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
careermate/
├── app/                          # Next.js app directory
│   ├── globals.css              # Global styles with TailwindCSS
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Main page with navigation
├── components/                   # React components
│   ├── CareerGuidance.tsx       # Career guidance form and results
│   ├── MockInterview.tsx        # Mock interview interface
│   └── JobSuggestions.tsx       # Job opportunities form and results
├── backend/                      # Node.js backend
│   ├── server.js                # Express server with API endpoints
│   ├── services/                 # Business logic
│   │   └── openai.js            # OpenAI API integration
│   ├── package.json             # Backend dependencies
│   └── env.example              # Environment variables template
├── package.json                  # Frontend dependencies
├── tailwind.config.js           # TailwindCSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## 🔌 API Endpoints

### Career Guidance
- **POST** `/api/career-guidance`
- **Body**: `{ skills, interests, goals, experience, education }`
- **Response**: Career paths, skill gaps, and learning roadmap

### Mock Interview
- **POST** `/api/mock-interview`
- **Body**: `{ role }`
- **Response**: Interview questions, tips, and categories

### Job Suggestions
- **POST** `/api/job-suggestions`
- **Body**: `{ skills, experience, location, preferredRole, education, interests }`
- **Response**: Job opportunities, skill matches, and recommendations

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for custom colors and animations
- Update `app/globals.css` for component-specific styles
- Use the predefined CSS classes: `.btn-primary`, `.card`, `.input-field`

### AI Prompts
- Edit `backend/services/openai.js` to customize AI behavior
- Modify prompt templates for different response formats
- Adjust temperature and token limits for response quality

### Components
- Each component is self-contained and can be easily modified
- Add new features by creating additional components
- Extend the navigation in `app/page.tsx`

## 🚀 Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set build command: `npm run build`
4. Deploy automatically on push

### Backend (Railway/Render)
1. Push your code to GitHub
2. Connect your repository to Railway or Render
3. Set environment variables (especially `OPENAI_API_KEY`)
4. Deploy and get your backend URL
5. Update frontend API calls to use the deployed backend URL

### Environment Variables for Production
```env
OPENAI_API_KEY=your_production_openai_key
PORT=5000
NODE_ENV=production
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable cross-origin requests
- **Helmet**: Security headers and protection
- **Input Validation**: Server-side validation for all API endpoints
- **Error Handling**: Comprehensive error handling without exposing internals

## 🧪 Testing

### Frontend Testing
```bash
npm run lint          # ESLint checking
npm run build         # Build verification
```

### Backend Testing
```bash
cd backend
npm run dev           # Development mode with auto-restart
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT API
- **Next.js** team for the amazing framework
- **TailwindCSS** for the utility-first CSS approach
- **Lucide** for the beautiful icon set

## 📞 Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include your environment details and error messages

## 🔮 Future Enhancements

- [ ] User authentication and profiles
- [ ] Progress tracking and analytics
- [ ] Interview history and performance metrics
- [ ] Integration with job boards (LinkedIn, Indeed)
- [ ] Mobile app using React Native
- [ ] Multi-language support
- [ ] Advanced AI models and fine-tuning
- [ ] Real-time collaboration features

---

**Built with ❤️ for the hackathon community**

*CareerMate - Your AI-powered career companion*
#   h a c k a t h o n _ C a r e e r M a t e _ A l c h o l i c H u t  
 #   h a c k a t h o n _ C a r e e r M a t e _ A l c h o l i c H u t  
 