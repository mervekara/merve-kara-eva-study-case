import { Module } from 'vuex';
import { ChartState } from './types';
import { RootState } from '../types';
import { actions } from './actions';
import { mutations } from './mutations';
import { getters } from './getters';

const state: ChartState = {
  chartData: null,
  tableData: [],
};

export const chart: Module<ChartState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
