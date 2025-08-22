const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: { type: String, required: true },
  questions: [{
    question: String,
    category: String,
    difficulty: String
  }],
  answers: [{
    question: String,
    answer: String,
    feedback: {
      score: Number,
      feedback: String,
      improvements: [String]
    }
  }],
  overallScore: { type: Number, default: 0 },
  summary: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MockInterview', mockInterviewSchema);
