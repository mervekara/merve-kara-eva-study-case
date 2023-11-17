export const SET_CHART_DATA = 'SET_CHART_DATA';
export const SET_TABLE_DATA = 'SET_TABLE_DATA';

export interface ChartState {
  chartData: ChartData | null;
  tableData: any[];
}

// Interface representing the structure of the chart data
export interface ChartData {
  series: ChartSeries[];
  categories: string[];
}

// Interface representing a single series in the chart data
export interface ChartSeries {
  name: string;
  data: number[];
}

export interface FetchTableDataPayload {
  columns: any[];
  pageNumber: number | 1;
}
