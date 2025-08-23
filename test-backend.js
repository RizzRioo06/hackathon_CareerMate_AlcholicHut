// Test script to check backend authentication endpoints
const API_URL = 'https://your-render-backend-url.onrender.com' // Replace with your actual Render backend URL

async function testBackend() {
  console.log('🧪 Testing CareerMate Backend...\n')
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...')
    const healthResponse = await fetch(`${API_URL}/health`)
    const healthData = await healthResponse.json()
    console.log('✅ Health:', healthData)
    
    // Test 2: Root endpoint
    console.log('\n2️⃣ Testing root endpoint...')
    const rootResponse = await fetch(`${API_URL}/`)
    const rootData = await rootResponse.json()
    console.log('✅ Root:', rootData)
    
    // Test 3: Auth health
    console.log('\n3️⃣ Testing auth health endpoint...')
    const authHealthResponse = await fetch(`${API_URL}/api/auth/health`)
    const authHealthData = await authHealthResponse.json()
    console.log('✅ Auth Health:', authHealthData)
    
    // Test 4: Auth test
    console.log('\n4️⃣ Testing auth test endpoint...')
    const authTestResponse = await fetch(`${API_URL}/api/auth/test`)
    const authTestData = await authTestResponse.json()
    console.log('✅ Auth Test:', authTestData)
    
    // Test 5: Routes list
    console.log('\n5️⃣ Testing routes endpoint...')
    const routesResponse = await fetch(`${API_URL}/routes`)
    const routesData = await routesResponse.json()
    console.log('✅ Routes:', routesData)
    
    console.log('\n🎉 All tests completed!')
    
  } catch (error) {
    console.error('❌ Error testing backend:', error.message)
  }
}

// Run the test
testBackend()
