import axios from 'axios';
import { API_BASE_URL } from '../constants/ChartConstants';

const fetchTokenData = async (endpoint: string, params: object) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, params);

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const fetchData = async (endpoint: string, params: any) => {
  try {
    const { data, accessToken } = params;
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export { fetchTokenData, fetchData };
