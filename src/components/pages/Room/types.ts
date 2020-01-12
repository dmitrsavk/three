import { RootState } from 'core/store';

export type StoreDispatchProps = {};

export type StoreProps = {};

export type OwnProps = {};

export type PageProps = StoreDispatchProps & StoreProps & OwnProps;

export type PageState = {
  loading: boolean;
  onboarding: boolean;
  init: boolean;
};
