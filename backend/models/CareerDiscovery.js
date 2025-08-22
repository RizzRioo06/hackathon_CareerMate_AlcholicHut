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

// Add a pre-save middleware to handle data validation
careerDiscoverySchema.pre('save', function(next) {
  // Handle conversation field - convert string to array if needed
  if (this.conversation) {
    if (typeof this.conversation === 'string') {
      try {
        // Try to parse if it's a JSON string
        const parsed = JSON.parse(this.conversation);
        if (Array.isArray(parsed)) {
          this.conversation = parsed;
        } else {
          // If parsed but not array, wrap in array
          this.conversation = [parsed];
        }
      } catch (e) {
        // If parsing fails, create a default conversation entry
        this.conversation = [{
          role: 'ai',
          content: this.conversation,
          timestamp: Date.now(),
          type: 'insight'
        }];
      }
    } else if (!Array.isArray(this.conversation)) {
      // If it's not a string and not an array, make it an array
      this.conversation = [this.conversation];
    }
  } else {
    // If conversation is undefined/null, set default
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