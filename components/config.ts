// Configuration for different environments
const config = {
  // Backend API URL - change this based on your environment
  apiUrl: process.env.NODE_ENV === 'production' 
    ? 'https://careermate-backend-nzb0.onrender.com/api'
    : 'http://localhost:5000/api',
  
  // Alternative: Use environment variable if set
  // apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
};

export default config;
