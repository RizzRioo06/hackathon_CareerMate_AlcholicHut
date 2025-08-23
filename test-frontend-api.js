// Test script to verify frontend API configuration
const API_URL = 'https://careermate-backend-nzb0.onrender.com/api'

async function testFrontendAPI() {
  console.log('🔍 Testing Frontend API Configuration...\n')
  
  const timestamp = Date.now()
  const testData = {
    email: `frontend-test-${timestamp}@example.com`,
    password: 'password123',
    firstName: 'Frontend',
    lastName: 'Test',
    profile: {
      currentRole: 'Developer',
      experience: '2 years',
      education: 'Bachelor\'s Degree',
      skills: ['JavaScript', 'React'],
      interests: ['Web Development'],
      goals: 'Learn new technologies',
      location: 'Test City, TC'
    }
  }
  
  console.log('📤 Testing with data:', JSON.stringify(testData, null, 2))
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    })
    
    console.log('📊 Response Status:', response.status)
    console.log('📊 Response OK:', response.ok)
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()))
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ SUCCESS:', result.message)
    } else {
      const error = await response.json()
      console.log('❌ FAILED:', error.error)
      if (error.fieldErrors) {
        console.log('   Field errors:', error.fieldErrors)
      }
      if (error.details) {
        console.log('   Details:', error.details)
      }
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message)
  }
}

// Run the test
testFrontendAPI()
