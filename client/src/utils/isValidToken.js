import {jwtDecode} from 'jwt-decode';

// true -> not expired
// false -> expired

const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }

  try {
    const decoded = jwtDecode(token); // Decoding the token
    const currentTime = Date.now() / 1000;  // Get current time in seconds

    // Check if the token is expired
    if (decoded.exp < currentTime) {
        localStorage.removeItem('token'); // Remove from localStorage
        return false;  // Token expired
    }

    return true;  // Token is valid
  } catch (error) {
    console.error('Invalid token', error);
    return false;
  }
};

export default isTokenValid;
