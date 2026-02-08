// Local storage utilities for offline user management
export interface UserData {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'artisan';
  createdAt: string;
}

const USER_STORAGE_KEY = 'zaymazone_users';
const CURRENT_USER_KEY = 'zaymazone_current_user';

// Get all users from localStorage
export const getStoredUsers = (): Record<string, UserData> => {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('Error reading from localStorage:', error);
    return {};
  }
};

// Store user data in localStorage
export const storeUser = (userId: string, userData: Partial<UserData>): void => {
  try {
    const users = getStoredUsers();
    users[userId] = { ...users[userId], ...userData } as UserData;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.warn('Error storing user data:', error);
  }
};

// Get specific user data
export const getStoredUser = (userId: string): UserData | null => {
  try {
    const users = getStoredUsers();
    return users[userId] || null;
  } catch (error) {
    console.warn('Error getting user data:', error);
    return null;
  }
};

// Store current user session
export const setCurrentUser = (userData: UserData | null): void => {
  try {
    if (userData) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (error) {
    console.warn('Error setting current user:', error);
  }
};

// Get current user session
export const getCurrentUser = (): UserData | null => {
  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Error getting current user:', error);
    return null;
  }
};

// Check if user exists with email
export const findUserByEmail = (email: string): UserData | null => {
  try {
    const users = getStoredUsers();
    return Object.values(users).find(user => user.email === email) || null;
  } catch (error) {
    console.warn('Error finding user by email:', error);
    return null;
  }
};

// Clear all stored data
export const clearStoredData = (): void => {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.warn('Error clearing stored data:', error);
  }
};