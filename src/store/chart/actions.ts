import { ActionTree, ActionContext } from 'vuex';
import { RootState } from '@/store/types';
import {
  ChartState,
  SET_CHART_DATA,
  SET_TABLE_DATA,
  FetchTableDataPayload,
} from './types';
import { UserInformation } from '../auth/types';
import { fetchData } from '@/services/api';

const fetchSkuRefundRate = async (
  userInfo: UserInformation,
  rootState: any,
  skuList: any[],
) => {
  const skuRefundRateRequest = {
    marketplace: userInfo.marketplace,
    sellerId: userInfo.sellerId,
    skuList,
    requestedDay: 0,
  };

  try {
    const params = {
      data: skuRefundRateRequest,
      accessToken: rootState.auth.accessToken,
    };

    const response = await fetchData('/data/get-sku-refund-rate', params);

    return response.Data;
  } catch (error) {
    console.error('Error fetching SKU refund rate for user:', userInfo, error);
    throw error;
  }
};

export const actions: ActionTree<ChartState, RootState> = {
  async fetchChartInformation({ commit, rootState }, payload) {
    try {
      const chartData = [];
      const userInformation = rootState.auth.userInformation;

      for (const userInfo of userInformation) {
        const chartRequestData = {
          marketplace: userInfo.marketplace,
          sellerId: userInfo.sellerId,
          requestStatus: userInfo.requestStatus,
          day: payload ? payload.days : userInfo.day,
          excludeYoYData: userInfo.excludeYoYData,
        };

        const params = {
          data: chartRequestData,
          accessToken: rootState.auth.accessToken,
        };

        const response = await fetchData('/data/daily-sales-overview', params);

        if (response.Data.item.length > 0) {
          chartData.push(response.Data.item);
        }
      }

      commit(SET_CHART_DATA, chartData.flat());
    } catch (error) {
      // Handle error fetching chart information
      console.error('Error fetching chart information:', error);
    }
  },

  async fetchTableData(
    { commit, rootState }: ActionContext<ChartState, RootState>,
    payload: FetchTableDataPayload,
  ) {
    try {
      const userInformation = rootState.auth.userInformation;
      const { columns, pageNumber } = payload;
      const tableData = [];
      for (const userInfo of userInformation) {
        const chartRequestData = {
          isDaysCompare: columns.length === 2 ? 1 : 0,
          marketplace: userInfo.marketplace,
          sellerId: userInfo.sellerId,
          salesDate: columns[0].date,
          salesDate2: columns.length === 2 ? columns[1].date : columns[0].date,
          pageSize: 5,
          pageNumber: pageNumber,
        };

        const params = {
          data: chartRequestData,
          accessToken: rootState.auth.accessToken,
        };

        const response = await fetchData('/data/daily-sales-sku-list/', params);

        const skuRefundRate = await fetchSkuRefundRate(
          userInfo,
          rootState,
          response.Data.item.skuList,
        );
        tableData.push(skuRefundRate);
      }

      commit(SET_TABLE_DATA, tableData.flat());

      return tableData.flat();
    } catch (error) {
      console.error('Error fetching table data:', error);
      throw error;
    }
  },
};
