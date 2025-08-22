const mongoose = require('mongoose');
require('dotenv').config();

const testDB = async () => {
  try {
    console.log('Testing database connection...');
    console.log('MongoDB URI:', process.env.MONGODB_URI || 'Not set');
    
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  MONGODB_URI not set in .env file');
      console.log('📝 Please create a .env file with:');
      console.log('   MONGODB_URI=mongodb://localhost:27017/careermate');
      console.log('   or');
      console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/careermate');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Connected:', conn.connection.host);
    console.log('✅ Database:', conn.connection.name);
    
    // Test creating a simple document
    const TestModel = mongoose.model('Test', new mongoose.Schema({ name: String, timestamp: Date }));
    const testDoc = new TestModel({ name: 'Test Document', timestamp: new Date() });
    await testDoc.save();
    console.log('✅ Test document created successfully');
    
    // Clean up
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Test document cleaned up');
    
    await mongoose.disconnect();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 MongoDB is not running. Please:');
      console.log('   1. Install MongoDB locally, or');
      console.log('   2. Use MongoDB Atlas (cloud)');
      console.log('   3. Update your .env file with the correct MONGODB_URI');
    }
  }
};

testDB();
