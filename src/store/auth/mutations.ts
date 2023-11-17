import { MutationTree } from 'vuex';
import { AuthState, SET_ACCESS_TOKEN, SET_USER_INFORMATION } from './types';

export const mutations: MutationTree<AuthState> = {
  [SET_ACCESS_TOKEN](state, accessToken: string) {
    state.accessToken = accessToken;
  },
  [SET_USER_INFORMATION](state, userInformation) {
    state.userInformation = userInformation;
  },
};
