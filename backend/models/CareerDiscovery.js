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
  careerPaths: {
    type: [mongoose.Schema.Types.Mixed], // Allow both objects and other formats
    default: []
  },
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
  conversation: {
    type: [{
      role: String,
      content: String,
      timestamp: Number,
      type: String
    }],
    default: []
  },
  createdAt: { type: Date, default: Date.now }
});

// Add a simple pre-save middleware to ensure data consistency
careerDiscoverySchema.pre('save', function(next) {
  // Ensure conversation is always an array
  if (!Array.isArray(this.conversation)) {
    this.conversation = [];
  }
  
  // Ensure careerPaths is an array
  if (!Array.isArray(this.careerPaths)) {
    this.careerPaths = [];
  }
  
  // Ensure learningRoadmap exists
  if (!this.learningRoadmap) {
    this.learningRoadmap = {
      immediate: [],
      shortTerm: [],
      longTerm: [],
      resources: {
        courses: [],
        projects: [],
        certifications: [],
        networking: []
      }
    };
  }
  
  next();
});

module.exports = mongoose.model('CareerDiscovery', careerDiscoverySchema);