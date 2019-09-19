import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gitapi-opme.herokuapp.com',
});

export default api;
