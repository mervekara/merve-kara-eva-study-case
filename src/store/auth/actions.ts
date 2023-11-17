import { ActionTree } from 'vuex';
import { RootState } from '@/store/types';
import {
  AuthState,
  SET_ACCESS_TOKEN,
  SET_USER_INFORMATION,
  UserInformation,
} from './types';

import { fetchTokenData, fetchData } from '@/services/api';

export const actions: ActionTree<AuthState, RootState> = {
  async login({ commit }, { email, password }) {
    try {
      const response = await fetchTokenData('/oauth/token', {
        Email: email,
        Password: password,
        GrantType: 'password',
        Scope: 'amazon_data',
        ClientId: 'C0001',
        ClientSecret: 'SECRET0001',
        RedirectUri: 'https://api.eva.guru',
      });

      const accessToken = response.Data.AccessToken;

      commit(SET_ACCESS_TOKEN, accessToken);
    } catch (error) {
      console.error('Login failed:', error);
    }
  },

  async fetchUserInformation({ commit, state }, email: string) {
    try {
      const params = {
        data: { email },
        accessToken: state.accessToken,
      };

      const response = await fetchData('/user/user-information', params);

      const storesInformation = response.Data.user.store.map(
        (store: { marketplaceName: any; storeId: any }) => ({
          marketplace: store.marketplaceName,
          sellerId: store.storeId,
          requestStatus: 0,
          day: 7,
          excludeYoYData: true,
        }),
      );

      commit(SET_USER_INFORMATION, storesInformation);
    } catch (error) {
      // Handle error fetching user information
      console.error('Error fetching user information:', error);
    }
  },
};
