const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing admin login API...\n');
    
    const apiUrl = 'http://localhost:3001/api/auth/login';
    const credentials = {
      email: 'admin@example.com',
      password: 'admin123'
    };
    
    console.log(`POST ${apiUrl}`);
    console.log('Request body:', JSON.stringify(credentials, null, 2));
    console.log('\nSending request...\n');
    
    const response = await axios.post(apiUrl, credentials);
    
    console.log('✅ Login successful!');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.data && response.data.data.token) {
      console.log('\n✅ Token received:', response.data.data.token.substring(0, 50) + '...');
    }
    
  } catch (error) {
    console.error('❌ Login failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

testLogin();
