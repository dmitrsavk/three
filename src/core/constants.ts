export enum Status {
  INITIAL = 'INITIAL',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  INVALID = 'INVALID',
  FETCHING = 'FETCHING',
}

export type ApiStatus = Status.INITIAL | Status.ERROR | Status.INVALID | Status.SUCCESS | Status.FETCHING;
