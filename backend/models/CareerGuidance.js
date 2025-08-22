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
    careerPaths: [{
      title: String,
      description: String,
      requirements: [String],
      growthPotential: String,
      salaryRange: String,
      companies: [String]
    }],
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

module.exports = mongoose.model('CareerGuidance', careerGuidanceSchema);
