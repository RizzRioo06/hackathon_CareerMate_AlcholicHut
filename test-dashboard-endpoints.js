// Test script to verify dashboard endpoints
const API_URL = 'https://careermate-backend-nzb0.onrender.com/api'

async function testDashboardEndpoints() {
  console.log('🔍 Testing Dashboard Endpoints...\n')
  
  // First, let's test the endpoints without authentication (should return 401)
  console.log('1️⃣ Testing endpoints without authentication (should return 401)...')
  
  const endpoints = ['career-guidance', 'mock-interviews', 'job-suggestions']
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`)
      console.log(`   ${endpoint}: ${response.status} ${response.statusText}`)
      
      if (response.status === 401) {
        console.log(`   ✅ ${endpoint} correctly requires authentication`)
      } else {
        console.log(`   ❌ ${endpoint} should return 401 but got ${response.status}`)
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint} network error: ${error.message}`)
    }
  }
  
  // Test with a fake token (should return 401)
  console.log('\n2️⃣ Testing with fake token (should return 401)...')
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        headers: {
          'Authorization': 'Bearer fake-token',
          'Content-Type': 'application/json'
        }
      })
      console.log(`   ${endpoint}: ${response.status} ${response.statusText}`)
      
      if (response.status === 401) {
        console.log(`   ✅ ${endpoint} correctly rejects fake token`)
      } else {
        console.log(`   ❌ ${endpoint} should return 401 but got ${response.status}`)
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint} network error: ${error.message}`)
    }
  }
  
  // Test the health endpoint (should work without auth)
  console.log('\n3️⃣ Testing health endpoint (should work without auth)...')
  try {
    const healthResponse = await fetch('https://careermate-backend-nzb0.onrender.com/health')
    console.log(`   Health: ${healthResponse.status} ${healthResponse.statusText}`)
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json()
      console.log(`   ✅ Health endpoint working: ${healthData.message}`)
    } else {
      console.log(`   ❌ Health endpoint failed: ${healthResponse.status}`)
    }
  } catch (error) {
    console.log(`   ❌ Health endpoint network error: ${error.message}`)
  }
  
  console.log('\n🏁 Dashboard endpoint test completed!')
}

// Run the test
testDashboardEndpoints()
