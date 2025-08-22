const mongoose = require('mongoose');

const jobSuggestionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userProfile: {
    skills: [String],
    experience: String,
    location: String,
    preferredRole: String,
    education: String,
    interests: [String]
  },
  suggestions: [{
    title: String,
    company: String,
    location: String,
    description: String,
    requirements: [String],
    salary: String,
    matchScore: Number,
    applicationLink: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JobSuggestion', jobSuggestionSchema);
