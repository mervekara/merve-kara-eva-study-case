import { GetterTree } from 'vuex';
import { ChartState } from './types';
import { RootState } from '@/store/types';

export const getters: GetterTree<ChartState, RootState> = {
  getChartData: (state) => {
    return state.chartData;
  },
};
