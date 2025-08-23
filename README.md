# 🚀 CareerMate - AI-Powered Career Guidance Platform

> **Your AI-powered career companion for guidance, practice, and opportunities**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--5-412991?style=for-the-badge&logo=openai)](https://openai.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

## 🌟 **Live Demo**
**[Try CareerMate Now](https://hackathon-career-mate-alcholic-hut-eight.vercel.app/)** 🎯

## 📖 **About CareerMate**

CareerMate is an innovative AI-powered career development platform that revolutionizes how professionals navigate their career journey. Built with cutting-edge technology and powered by OpenAI's GPT-5, CareerMate provides personalized career guidance, realistic mock interviews, targeted job recommendations, and compelling career storytelling.

### 🎯 **Problem We Solve**
- **Career Navigation Complexity**: Many professionals struggle with identifying optimal career paths
- **Interview Preparation Gap**: Traditional interview prep lacks real-time feedback and role-specific questions
- **Skill Gap Identification**: Difficulty in understanding what skills are needed for career advancement
- **Personal Branding**: Challenge in creating compelling career narratives for different platforms

### 💡 **Our Solution**
CareerMate leverages advanced AI to provide:
- **Personalized Career Guidance** with GPT-5 analysis
- **Real-time Mock Interviews** with instant feedback
- **AI-powered Job Recommendations** from real companies
- **Career Storytelling** for LinkedIn, resumes, and networking
- **Skill Gap Analysis** with actionable improvement plans

## ✨ **Key Features**

### 🤖 **AI-Powered Career Guidance**
- **Personalized Analysis**: GPT-5 analyzes your profile and provides tailored career paths
- **Skill Gap Identification**: AI identifies specific skills needed for your target roles
- **Learning Roadmaps**: Customized learning paths with real course recommendations
- **Project Suggestions**: AI-generated project ideas to build your portfolio

### 💬 **Mock Interview Practice**
- **Role-Specific Questions**: AI generates questions tailored to your target position
- **Instant Feedback**: Real-time evaluation of your answers with improvement suggestions
- **Multiple Categories**: Technical, behavioral, system design, and problem-solving questions
- **Progress Tracking**: Monitor your interview performance over time

### 💼 **Job Recommendations**
- **Real Company Listings**: AI suggests opportunities from actual companies
- **Skill Matching**: Intelligent matching based on your profile and requirements
- **Market Insights**: Current salary ranges and market trends
- **Personalized Advice**: Actionable recommendations for career advancement

### 📚 **Career Storytelling**
- **LinkedIn Bios**: AI-generated professional bios that stand out
- **Resume Summaries**: Compelling resume narratives that highlight achievements
- **Elevator Pitches**: 30-second pitches for networking events
- **Interview Stories**: Personal narratives for "Tell me about yourself" questions

## 🛠️ **Technology Stack**

### **Frontend**
- **React 18** - Modern UI framework with hooks and functional components
- **Next.js 14** - Full-stack React framework with server-side rendering
- **TypeScript** - Type-safe JavaScript for better code quality
- **TailwindCSS** - Utility-first CSS framework for rapid development
- **Lucide React** - Beautiful, customizable icons

### **Backend**
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT** - Secure authentication and session management

### **AI & Machine Learning**
- **OpenAI GPT-5** - Advanced AI model for intelligent responses
- **Custom AI Prompts** - Specialized prompts for career development
- **Real-time Processing** - Instant AI-powered insights and feedback

### **Deployment & Infrastructure**
- **Vercel** - Frontend hosting with automatic deployments
- **MongoDB Atlas** - Cloud-hosted database
- **GitHub** - Version control and collaboration

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- MongoDB (local or Atlas)
- OpenAI API key (GPT-5 access)

### **Frontend Setup**
```bash
# Clone the repository
git clone https://github.com/RizzRioo06/hackathon_CareerMate_AlcholicHut
cd careermate

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your OpenAI API key and MongoDB URI

# Run development server
npm run dev
```

### **Backend Setup**
```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Configure your OpenAI API key and MongoDB URI

# Start the server
npm start
```

### **Environment Variables**
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000

# Backend (.env)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5o
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

## 📱 **Usage Guide**

### **1. Create Your Account**
- Sign up with your email and basic information
- Complete your profile with skills, experience, and goals

### **2. Get Career Guidance**
- Navigate to Career Guidance
- AI analyzes your profile and provides personalized recommendations
- Review suggested career paths and skill gaps

### **3. Practice Interviews**
- Choose your target role
- Answer AI-generated questions
- Receive instant feedback and improvement suggestions

### **4. Discover Opportunities**
- Browse AI-recommended job opportunities
- Filter by location, role, and company
- Get personalized career advice

### **5. Build Your Brand**
- Generate compelling career stories
- Create professional LinkedIn bios
- Craft elevator pitches for networking

## 🏗️ **Architecture**

### **Frontend Architecture**
- **Component-Based**: Modular React components with TypeScript
- **State Management**: React Context for authentication and user data
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Performance**: Optimized rendering and lazy loading

### **Backend Architecture**
- **RESTful API**: Clean, scalable API design
- **Middleware**: Authentication and validation layers
- **Database**: MongoDB with Mongoose schemas
- **AI Integration**: OpenAI API with custom prompt engineering

### **Security Features**
- **JWT Authentication**: Secure user sessions
- **Protected Routes**: API endpoint security
- **Input Validation**: Data sanitization and validation
- **CORS Protection**: Cross-origin request handling

## 🎯 **Hackathon Highlights**

### **Innovation**
- **First GPT-5 Integration**: Among the first to leverage OpenAI's latest model
- **Real-time AI Feedback**: Instant interview evaluation and career guidance
- **Personalized Learning**: AI-driven skill development roadmaps

### **Technical Excellence**
- **Full-Stack Development**: Complete web application with modern tech stack
- **AI Integration**: Sophisticated prompt engineering for career scenarios
- **Responsive Design**: Professional UI/UX that works on all devices

### **Business Value**
- **Market Need**: Addresses real career development challenges
- **Scalability**: Built for growth and enterprise adoption
- **Revenue Potential**: Multiple monetization strategies

## 🔮 **Future Roadmap**

### **Phase 1 (Current)**
- ✅ User authentication and profiles
- ✅ AI career guidance
- ✅ Mock interview practice
- ✅ Job recommendations
- ✅ Career storytelling

### **Phase 2 (Next)**
- 🔄 Advanced analytics dashboard
- 🔄 Skill assessment tests
- 🔄 Resume builder with AI
- 🔄 Networking event integration

### **Phase 3 (Future)**
- 📋 Corporate team accounts
- 📋 AI career coach chatbot
- 📋 Integration with job platforms
- 📋 Mobile applications

## 🤝 **Contributing**

We welcome contributions! Please read our contributing guidelines and submit pull requests.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **OpenAI** for providing access to GPT-5
- **Next.js Team** for the amazing framework
- **TailwindCSS** for the utility-first CSS approach
- **MongoDB** for the flexible database solution

## 📞 **Contact**

- **Project Link**: [https://github.com/yourusername/careermate](https://github.com/RizzRioo06/hackathon_CareerMate_AlcholicHut)
- **Live Demo**: [https://your-vercel-url.vercel.app](https://hackathon-career-mate-alcholic-hut-eight.vercel.app/)
- **Issues**: [GitHub Issues](https://github.com/RizzRioo06/hackathon_CareerMate_AlcholicHut/issues)

---

<div align="center">
  <p><strong>Built with ❤️ for the lablab.ai Hackathon</strong></p>
  <p>Empowering careers through AI innovation</p>
</div>
