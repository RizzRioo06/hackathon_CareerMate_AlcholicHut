// Test script to verify authentication flow
const API_URL = 'https://careermate-backend-nzb0.onrender.com/api'

async function testAuthFlow() {
  console.log('🔐 Testing Authentication Flow...\n')
  
  const timestamp = Date.now()
  const testUser = {
    email: `auth-test-${timestamp}@example.com`,
    password: 'password123',
    firstName: 'Auth',
    lastName: 'Test',
    profile: {
      currentRole: 'Developer',
      experience: '2 years',
      education: 'Bachelor\'s',
      skills: ['JavaScript'],
      interests: ['Web Dev'],
      goals: 'Learn React',
      location: 'Test City'
    }
  }
  
  // Step 1: Register user
  console.log('1️⃣ Registering test user...')
  const registerResponse = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(testUser)
  })
  
  if (!registerResponse.ok) {
    console.error('❌ Registration failed:', registerResponse.status, registerResponse.statusText)
    const error = await registerResponse.json().catch(() => 'Unknown error')
    console.error('Error details:', error)
    return
  }
  
  const registerData = await registerResponse.json()
  console.log('✅ Registration successful')
  console.log('   Token:', registerData.token.substring(0, 20) + '...')
  console.log('   User ID:', registerData.user._id)
  
  const token = registerData.token
  
  // Step 2: Test profile endpoint
  console.log('\n2️⃣ Testing profile endpoint...')
  const profileResponse = await fetch(`${API_URL}/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  
  if (profileResponse.ok) {
    const profileData = await profileResponse.json()
    console.log('✅ Profile fetch successful')
    console.log('   User:', profileData.user.email)
  } else {
    console.error('❌ Profile fetch failed:', profileResponse.status, profileResponse.statusText)
  }
  
  // Step 3: Test protected endpoints
  console.log('\n3️⃣ Testing protected endpoints...')
  
  const endpoints = ['career-guidance', 'mock-interviews', 'job-suggestions']
  
  for (const endpoint of endpoints) {
    console.log(`   Testing /${endpoint}...`)
    const response = await fetch(`${API_URL}/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log(`   ✅ /${endpoint} successful - ${data.length} items`)
    } else {
      console.log(`   ❌ /${endpoint} failed - ${response.status} ${response.statusText}`)
    }
  }
  
  // Step 4: Test without token
  console.log('\n4️⃣ Testing without token...')
  const noTokenResponse = await fetch(`${API_URL}/career-guidance`)
  console.log(`   No token response: ${noTokenResponse.status} ${noTokenResponse.statusText}`)
  
  console.log('\n🏁 Auth flow test completed!')
}

// Run the test
testAuthFlow()
