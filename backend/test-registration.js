// Test script to simulate frontend registration request
// This will help us see exactly what data is being sent

const API_URL = 'https://careermate-backend-nzb0.onrender.com'

async function testRegistration() {
  console.log('🧪 Testing Registration with Sample Data...\n')
  
  // Sample data that should match what frontend sends
  const testData = {
    email: 'test@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    profile: {
      currentRole: 'Software Engineer',
      experience: '3 years',
      education: 'Bachelor\'s in Computer Science',
      skills: ['JavaScript', 'React', 'Node.js'],
      interests: ['Web Development', 'AI'],
      goals: 'Become a Senior Developer',
      location: 'San Francisco, CA'
    }
  }
  
  console.log('📤 Sending registration data:', JSON.stringify(testData, null, 2))
  
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    })
    
    console.log(`\n📥 Response Status: ${response.status}`)
    console.log(`📥 Response Headers:`, Object.fromEntries(response.headers.entries()))
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Registration successful:', data)
    } else {
      const errorData = await response.json()
      console.log('❌ Registration failed:', errorData)
      
      if (errorData.fieldErrors) {
        console.log('\n🔍 Field Errors:')
        errorData.fieldErrors.forEach(error => {
          console.log(`   ${error.field}: ${error.message}`)
        })
      }
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message)
  }
}

// Run the test
testRegistration()
