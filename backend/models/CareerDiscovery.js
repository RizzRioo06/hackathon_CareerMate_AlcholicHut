const mongoose = require('mongoose');

const careerDiscoverySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userProfile: {
    name: String,
    currentRole: String,
    primaryInterest: String,
    secondaryInterest: String,
    experience: String,
    education: String
  },
  careerPaths: [{
    title: String,
    description: String,
    transferableSkills: [String],
    skillGaps: [String],
    marketDemand: String,
    salaryRange: String,
    companies: [String],
    nextSteps: [String]
  }],
  learningRoadmap: {
    immediate: [String],
    shortTerm: [String],
    longTerm: [String],
    resources: {
      courses: [String],
      projects: [String],
      certifications: [String],
      networking: [String]
    }
  },
  conversation: [{
    role: String,
    content: String,
    timestamp: Number,
    type: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CareerDiscovery', careerDiscoverySchema);