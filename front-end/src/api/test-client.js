const axios = require('axios');

// Test the API endpoints directly
async function testAPI() {
    const baseURL = 'http://localhost:3000';
    
    console.log('🧪 Testing Auth API...\n');
    
    try {
        // Test registration
        console.log('1. Testing user registration...');
        const registerResponse = await axios.post(`${baseURL}/register`, {
            first_name: 'Test',
            last_name: 'User',
            email: 'testuser@example.com',
            password: 'password123'
        });
        console.log('✅ Registration successful:', registerResponse.data);
        
        // Test login
        console.log('\n2. Testing user login...');
        const loginResponse = await axios.post(`${baseURL}/login`, {
            email: 'testuser@example.com',
            password: 'password123'
        });
        console.log('✅ Login successful, token received');
        
        const token = loginResponse.data.token;
        
        // Test protected route (should fail for regular user)
        console.log('\n3. Testing protected route with regular user...');
        try {
            const adminResponse = await axios.get(`${baseURL}/admin`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('❌ Unexpected success:', adminResponse.data);
        } catch (error) {
            if (error.response && error.response.status === 403) {
                console.log('✅ Correctly denied access (user is not admin)');
            } else {
                console.log('❌ Unexpected error:', error.message);
            }
        }
        
        // Test with invalid token
        console.log('\n4. Testing protected route with invalid token...');
        try {
            await axios.get(`${baseURL}/admin`, {
                headers: {
                    'Authorization': 'Bearer invalid_token'
                }
            });
            console.log('❌ Unexpected success with invalid token');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log('✅ Correctly rejected invalid token');
            } else {
                console.log('❌ Unexpected error:', error.message);
            }
        }
        
        console.log('\n🎉 All tests completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

// Run the test
testAPI(); 