import { GetterTree } from 'vuex';
import { RootState } from '@/store/types';
import { AuthState } from './types';

export const getters: GetterTree<AuthState, RootState> = {
  isAuthenticated: (state) => !!state.accessToken,
};
