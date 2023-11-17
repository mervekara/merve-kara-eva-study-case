// Mutation types
export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN';
export const SET_USER_INFORMATION = 'SET_USER_INFORMATION';

// State type
export interface AuthState {
  accessToken: string | null;
  userInformation: UserInformation[];
}

export interface UserInformation {
  marketplace: string;
  sellerId: string;
  requestStatus: string;
  day: string;
  excludeYoYData: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Getter types
export interface AuthGetters {
  isAuthenticated: boolean;
}
