import { ApiResponse } from '../types';

const API_URL = 'https://hot-api.vhan.eu.org/v2?type=all';

export const fetchAllHotData = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Failed to fetch hot data:", error);
    throw error;
  }
};