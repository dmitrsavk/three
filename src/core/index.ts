import { connect as connectRedux } from 'react-redux';
import { RootState, Dispatch } from './store';

export * from './store';

export const connect = <S, D, E>(
  mapState: (state: RootState, external?: E) => S = null,
  mapDispatch: (dispatch: Dispatch<any>) => D = null
) => connectRedux(mapState, mapDispatch);
