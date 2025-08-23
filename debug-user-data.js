// Debug script to check what data exists in the database
const API_URL = 'https://careermate-backend-nzb0.onrender.com/api'

async function debugUserData() {
  console.log('🔍 Debugging User Data in Database...\n')
  
  // Step 1: Register a test user to get a token
  console.log('1️⃣ Creating test user...')
  const testUser = {
    email: `debug-test-${Date.now()}@example.com`,
    password: 'password123',
    firstName: 'Debug',
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
  
  try {
    const registerResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    })
    
    if (!registerResponse.ok) {
      console.error('❌ Registration failed:', registerResponse.status)
      return
    }
    
    const registerData = await registerResponse.json()
    const token = registerData.token
    const userId = registerData.user._id
    
    console.log('✅ Test user created')
    console.log('   User ID:', userId)
    console.log('   Token:', token.substring(0, 20) + '...')
    
    // Step 2: Create some test data
    console.log('\n2️⃣ Creating test data...')
    
    // Create career guidance
    console.log('   Creating career guidance...')
    const guidanceResponse = await fetch(`${API_URL}/career-guidance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        skills: ['JavaScript', 'React'],
        interests: ['Web Development'],
        goals: ['Learn Node.js'],
        experience: '2 years',
        education: 'Bachelor\'s'
      })
    })
    
    if (guidanceResponse.ok) {
      const guidanceData = await guidanceResponse.json()
      console.log('   ✅ Career guidance created:', guidanceData.message || 'Success')
    } else {
      console.log('   ❌ Career guidance failed:', guidanceResponse.status)
    }
    
    // Create mock interview
    console.log('   Creating mock interview...')
    const interviewResponse = await fetch(`${API_URL}/mock-interview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: 'Software Engineer'
      })
    })
    
    if (interviewResponse.ok) {
      const interviewData = await interviewResponse.json()
      console.log('   ✅ Mock interview created:', interviewData.message || 'Success')
    } else {
      console.log('   ❌ Mock interview failed:', interviewResponse.status)
    }
    
    // Create job suggestions
    console.log('   Creating job suggestions...')
    const jobResponse = await fetch(`${API_URL}/job-suggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        skills: ['JavaScript', 'React'],
        experience: '2 years',
        location: 'San Francisco',
        preferredRole: 'Frontend Developer',
        education: 'Bachelor\'s',
        interests: ['Web Development']
      })
    })
    
    if (jobResponse.ok) {
      const jobData = await jobResponse.json()
      console.log('   ✅ Job suggestions created:', jobData.message || 'Success')
    } else {
      console.log('   ❌ Job suggestions failed:', jobResponse.status)
    }
    
    // Step 3: Wait a moment for data to be saved
    console.log('\n3️⃣ Waiting for data to be saved...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Step 4: Try to fetch the data with authentication
    console.log('\n4️⃣ Fetching data with authentication...')
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
    
    const [guidanceData, interviewData, jobData] = await Promise.all([
      fetch(`${API_URL}/career-guidance`, { headers }).then(res => res.ok ? res.json() : []),
      fetch(`${API_URL}/mock-interviews`, { headers }).then(res => res.ok ? res.json() : []),
      fetch(`${API_URL}/job-suggestions`, { headers }).then(res => res.ok ? res.json() : [])
    ])
    
    console.log('📊 Data fetched:')
    console.log('   Career Guidance:', guidanceData.length, 'items')
    console.log('   Mock Interviews:', interviewData.length, 'items')
    console.log('   Job Suggestions:', jobData.length, 'items')
    
    // Step 5: Check if data has userId field
    if (guidanceData.length > 0) {
      console.log('\n🔍 Sample career guidance data:')
      console.log('   ID:', guidanceData[0]._id)
      console.log('   Has userId:', !!guidanceData[0].userId)
      console.log('   userId value:', guidanceData[0].userId)
    }
    
    if (interviewData.length > 0) {
      console.log('\n🔍 Sample mock interview data:')
      console.log('   ID:', interviewData[0]._id)
      console.log('   Has userId:', !!interviewData[0].userId)
      console.log('   userId value:', interviewData[0].userId)
    }
    
    if (jobData.length > 0) {
      console.log('\n🔍 Sample job suggestion data:')
      console.log('   ID:', jobData[0]._id)
      console.log('   Has userId:', !!jobData[0].userId)
      console.log('   userId value:', jobData[0].userId)
    }
    
  } catch (error) {
    console.error('❌ Error during debug:', error.message)
  }
  
  console.log('\n🏁 Debug completed!')
}

// Run the debug
debugUserData()
