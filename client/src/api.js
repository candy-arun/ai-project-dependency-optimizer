import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // You can create another for ML service if needed
});

export default api;
