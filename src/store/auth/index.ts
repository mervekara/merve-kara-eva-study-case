export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN';
export const SET_USER_INFORMATION = 'SET_USER_INFORMATION';

import { Module } from 'vuex';
import { AuthState } from './types';
import { RootState } from '@/store/types';
import { actions } from './actions';
import { mutations } from './mutations';
import { getters } from './getters';

const state: AuthState = {
  accessToken: null,
  userInformation: [
    {
      marketplace: '',
      sellerId: '',
      requestStatus: '',
      day: '',
      excludeYoYData: false,
    },
  ],
};

export const auth: Module<AuthState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
