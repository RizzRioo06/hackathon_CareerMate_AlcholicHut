// Quick test script for registration validation
const API_URL = 'https://careermate-backend-nzb0.onrender.com/api'

async function quickTest() {
  console.log('🚀 Quick Registration Validation Test\n')
  
  const timestamp = Date.now()
  
  // Test 1: Valid registration
  console.log('1️⃣ Testing valid registration...')
  await testRegistration({
    email: `valid-${timestamp}@test.com`,
    password: 'password123',
    firstName: 'Valid',
    lastName: 'User',
    profile: {
      currentRole: 'Developer',
      experience: '2 years',
      education: 'Bachelor\'s',
      skills: ['JavaScript'],
      interests: ['Web Dev'],
      goals: 'Learn React',
      location: 'Test City'
    }
  })
  
  // Test 2: Missing profile fields (should still work based on our backend)
  console.log('\n2️⃣ Testing with minimal profile...')
  await testRegistration({
    email: `minimal-${timestamp}@test.com`,
    password: 'password123',
    firstName: 'Minimal',
    lastName: 'User'
    // No profile field
  })
  
  // Test 3: Empty profile fields
  console.log('\n3️⃣ Testing with empty profile fields...')
  await testRegistration({
    email: `empty-${timestamp}@test.com`,
    password: 'password123',
    firstName: 'Empty',
    lastName: 'Profile',
    profile: {
      currentRole: '',
      experience: '',
      education: '',
      skills: [''],
      interests: [''],
      goals: '',
      location: ''
    }
  })
}

async function testRegistration(data) {
  try {
    console.log(`📤 Sending: ${JSON.stringify(data, null, 2)}`)
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`)
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ SUCCESS:', result.message)
    } else {
      const error = await response.json()
      console.log('❌ FAILED:', error.error)
      if (error.fieldErrors) {
        console.log('   Field errors:', error.fieldErrors)
      }
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message)
  }
}

// Run the test
quickTest()
