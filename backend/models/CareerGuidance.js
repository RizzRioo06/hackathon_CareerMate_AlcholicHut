const mongoose = require('mongoose');

const careerGuidanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userProfile: {
    skills: [String],
    interests: [String],
    goals: [String],
    experience: String,
    education: String
  },
  guidance: {
    careerPaths: {
      type: [mongoose.Schema.Types.Mixed], // Allow both strings and objects
      default: []
    },
    skillRecommendations: [{
      skill: String,
      priority: String,
      learningPath: String,
      resources: [String]
    }],
    actionPlan: {
      immediate: [String],
      shortTerm: [String],
      longTerm: [String]
    }
  },
  createdAt: { type: Date, default: Date.now }
});

// Add a pre-save middleware to handle careerPaths field
careerGuidanceSchema.pre('save', function(next) {
  // Ensure guidance.careerPaths is always an array
  if (this.guidance && this.guidance.careerPaths) {
    if (!Array.isArray(this.guidance.careerPaths)) {
      this.guidance.careerPaths = [];
    }
    
    // Convert string career paths to objects if needed
    this.guidance.careerPaths = this.guidance.careerPaths.map(path => {
      if (typeof path === 'string') {
        return {
          title: path,
          description: `Career path: ${path}`,
          requirements: [],
          growthPotential: 'High',
          salaryRange: 'Competitive',
          companies: []
        };
      }
      return path;
    });
  }
  
  next();
});

module.exports = mongoose.model('CareerGuidance', careerGuidanceSchema);
