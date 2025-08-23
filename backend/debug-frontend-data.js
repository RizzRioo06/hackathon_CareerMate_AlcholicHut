// Debug script to help identify frontend validation issues
// This will test different data scenarios to find the problem

const API_URL = 'https://careermate-backend-nzb0.onrender.com'

async function testDifferentScenarios() {
  console.log('🔍 Testing Different Registration Data Scenarios...\n')
  
  // Scenario 1: Complete data (should work)
  console.log('1️⃣ Testing with complete data...')
  await testRegistration({
    email: 'test1@example.com',
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
  })
  
  // Scenario 2: Missing profile fields (might fail)
  console.log('\n2️⃣ Testing with missing profile fields...')
  await testRegistration({
    email: 'test2@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
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
  
  // Scenario 3: Empty strings (might fail)
  console.log('\n3️⃣ Testing with empty strings...')
  await testRegistration({
    email: 'test3@example.com',
    password: 'password123',
    firstName: 'Bob',
    lastName: 'Johnson',
    profile: {
      currentRole: '   ', // Just spaces
      experience: '   ',
      education: '   ',
      skills: ['   '],
      interests: ['   '],
      goals: '   ',
      location: '   '
    }
  })
  
  // Scenario 4: Missing profile entirely
  console.log('\n4️⃣ Testing without profile...')
  await testRegistration({
    email: 'test4@example.com',
    password: 'password123',
    firstName: 'Alice',
    lastName: 'Brown'
    // No profile field
  })
}

async function testRegistration(data) {
  try {
    console.log(`📤 Sending: ${JSON.stringify(data, null, 2)}`)
    
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
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

// Run all tests
testDifferentScenarios()
