import api from './src/services/api.js';

// Your code here

(async () => {
  try {
    console.log('Testing API Configuration...');
    
    // Test the `/shops` endpoint
    const shopsResponse = await api.get('/shops');
    console.log('Shops Data:', shopsResponse.data);

    // Test the `/products` endpoint
    const productsResponse = await api.get('/products');
    console.log('Products Data:', productsResponse.data);

    console.log('API Configuration is working correctly.');
  } catch (error) {
    console.error('Error testing API configuration:', error.message);
  }
})();
