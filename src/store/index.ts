import { createStore } from 'vuex';
import { auth } from './auth';
import { chart } from './chart';

export const store = createStore({
  modules: {
    auth,
    chart,
  },
});
