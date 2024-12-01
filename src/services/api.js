import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Ensure this matches your JSON Server
});

console.log('API instance created:', api); // Debugging log

export default api;
