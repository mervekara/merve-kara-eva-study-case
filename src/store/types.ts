import { AuthState } from './auth/types';
import { ChartState } from './chart/types';

export interface RootState {
  version: string;
  auth: AuthState;
  chart: ChartState;
}
