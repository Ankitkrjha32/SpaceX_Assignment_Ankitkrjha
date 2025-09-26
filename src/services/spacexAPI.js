import axios from 'axios';

const BASE_URL = 'https://api.spacexdata.com/v4';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const spacexAPI = {
  // Get all launches with populated rocket data
  async getLaunches() {
    try {
      console.log('SpaceX API: Fetching launches...');
      // Try simple GET first to test connectivity
      const response = await api.get('/launches');
      console.log('SpaceX API: Received response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching launches:', error);
      throw new Error(`Failed to fetch launches: ${error.message}`);
    }
  },

  // Get single launch by ID with all details
  async getLaunchById(launchId) {
    try {
      const response = await api.get(`/launches/${launchId}`, {
        params: {
          populate: 'rocket'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching launch details:', error);
      throw new Error(`Failed to fetch launch details: ${error.message}`);
    }
  },

  // Get rockets data (for additional rocket information)
  async getRockets() {
    try {
      const response = await api.get('/rockets');
      return response.data;
    } catch (error) {
      console.error('Error fetching rockets:', error);
      throw new Error(`Failed to fetch rockets: ${error.message}`);
    }
  }
};