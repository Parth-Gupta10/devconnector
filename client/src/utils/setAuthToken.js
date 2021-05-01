import axios from 'axios';

//a function to check if token present, and if it is there then add it to 'x-auth-token' header and if not there then delete that header
const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;