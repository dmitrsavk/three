import { routerReducer } from 'react-router-redux';
import { combineReducers, Reducer } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { AnyAction } from 'typescript-fsa';

const rootObjReducer = {};

type RootType = typeof rootObjReducer;
type UnboxReducer<T> = T extends Reducer<infer U> ? U : T;

export type RootState = { readonly [P in keyof RootType]?: UnboxReducer<RootType[P]> };

export const ROOT_INITIAL_STATE: RootState = {};

const appReducer = combineReducers<RootState>(rootObjReducer);

const rootReducer = (state: RootState, action: AnyAction) => {
  if (action.type === 'RESET_APP') {
    state = { ...ROOT_INITIAL_STATE };
  }

  return appReducer(state, action);
};

export default rootReducer;
