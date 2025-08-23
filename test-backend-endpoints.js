// Test script to check backend authentication endpoints
// Run this after Render redeploys: node test-backend-endpoints.js

const API_URL = 'https://careermate-backend-nzb0.onrender.com'

async function testBackendEndpoints() {
  console.log('🧪 Testing CareerMate Backend Authentication Endpoints...\n')
  
  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...')
    const healthResponse = await fetch(`${API_URL}/health`)
    if (healthResponse.ok) {
      const healthData = await healthResponse.json()
      console.log('✅ Health:', healthData.message)
    } else {
      console.log('❌ Health failed:', healthResponse.status)
    }
    
    // Test 2: Root endpoint
    console.log('\n2️⃣ Testing root endpoint...')
    const rootResponse = await fetch(`${API_URL}/`)
    if (rootResponse.ok) {
      const rootData = await rootResponse.json()
      console.log('✅ Root:', rootData.message)
      console.log('   Auth endpoints listed:', rootData.endpoints.filter(e => e.includes('AUTH')).length)
    } else {
      console.log('❌ Root failed:', rootResponse.status)
    }
    
    // Test 3: Auth health
    console.log('\n3️⃣ Testing auth health endpoint...')
    const authHealthResponse = await fetch(`${API_URL}/api/auth/health`)
    if (authHealthResponse.ok) {
      const authHealthData = await authHealthResponse.json()
      console.log('✅ Auth Health:', authHealthData.message)
      console.log('   Available endpoints:', authHealthData.endpoints.length)
    } else {
      console.log('❌ Auth Health failed:', authHealthResponse.status, authHealthResponse.statusText)
    }
    
    // Test 4: Auth test
    console.log('\n4️⃣ Testing auth test endpoint...')
    const authTestResponse = await fetch(`${API_URL}/api/auth/test`)
    if (authTestResponse.ok) {
      const authTestData = await authTestResponse.json()
      console.log('✅ Auth Test:', authTestData.message)
    } else {
      console.log('❌ Auth Test failed:', authTestResponse.status, authTestResponse.statusText)
    }
    
    // Test 5: Routes list
    console.log('\n5️⃣ Testing routes endpoint...')
    const routesResponse = await fetch(`${API_URL}/routes`)
    if (routesResponse.ok) {
      const routesData = await routesResponse.json()
      console.log('✅ Routes:', routesData.message)
      console.log('   Total routes:', routesData.routes.length)
      const authRoutes = routesData.routes.filter(r => r.path.includes('/api/auth/'))
      console.log('   Auth routes:', authRoutes.length)
      authRoutes.forEach(route => {
        console.log(`     ${route.methods.join(',')} ${route.path}`)
      })
    } else {
      console.log('❌ Routes failed:', routesResponse.status, routesResponse.statusText)
    }
    
    console.log('\n🎉 Backend testing completed!')
    console.log('\n📝 Next steps:')
    console.log('   - If all tests pass ✅: Your auth should work!')
    console.log('   - If tests fail ❌: Wait for Render to finish redeploying')
    console.log('   - Check Render dashboard for deployment status')
    
  } catch (error) {
    console.error('❌ Error testing backend:', error.message)
    console.log('\n💡 This usually means:')
    console.log('   - Render is still redeploying')
    console.log('   - Wait 2-5 minutes and try again')
    console.log('   - Check your Render dashboard')
  }
}

// Run the test
testBackendEndpoints()
