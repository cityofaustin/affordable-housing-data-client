import axios from 'axios';

// base url of nodejs/express server

export default axios.create({
  //baseURL: `http://localhost:3001`
  baseURL: `process.env.REACT_APP_API_URL || http://localhost:3001`
});