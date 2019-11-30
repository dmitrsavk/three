import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import Cookie from 'js-cookie';
import { replace } from 'react-router-redux';
import psl, { ParsedDomain } from 'psl';

const config = require('../../../config/config');

import store from 'core/store';

export type Response<T> = {
  data: T;
  result: number;
  error_message?: string;
};

export class Fetcher {
  apiUrl: string;

  constructor(url: string) {
    this.apiUrl = url;
  }

  get<T>(params: AxiosRequestConfig) {
    return axios
      .get<Response<T>>(`${this.apiUrl}/${params.url}`, {
        ...params,
        headers: { ...params.headers, Authorization: `Bearer ${Cookie.get('jwToken')}` },
      })
      .then(this.checkResponse)
      .catch(this.handleError);
  }

  getBlob<T>(params: AxiosRequestConfig) {
    return axios
      .get<Response<T>>(`${this.apiUrl}/${params.url}`, {
        ...params,
        headers: { ...params.headers, Authorization: `Bearer ${Cookie.get('jwToken')}` },
      })
      .catch(this.handleError);
  }

  post<T>(params: AxiosRequestConfig) {
    return axios
      .post<Response<T>>(
        `${this.apiUrl}/${params.url}`,
        { ...params.data },
        { headers: { Authorization: `Bearer ${Cookie.get('jwToken')}` } }
      )
      .then(this.checkResponse)
      .catch(this.handleError);
  }

  delete<T>(params: AxiosRequestConfig) {
    return axios
      .delete<Response<T>>(`${this.apiUrl}/${params.url}`, {
        data: params.data,
        headers: { Authorization: `Bearer ${Cookie.get('jwToken')}` },
      })
      .then(this.checkResponse);
  }

  private checkResponse<T>(res: AxiosResponse<Response<T>>) {
    if (res.data.result !== 0) {
      throw new Error(res.data.error_message);
    } else {
      return res.data;
    }
  }

  private handleError(err: AxiosError) {
    if (err.response && err.response.status === 403) {
      if (Cookie.get('rfToken')) {
        axios
          .get(`${config.siteApi}/auth/refresh`, {
            headers: { Authorization: `Bearer ${Cookie.get('rfToken')}` },
          })
          .then((res) => {
            if (res.data.access_token || res.data.refresh_token) {
              const parsed = psl.parse(location.hostname) as ParsedDomain;
              const domain = parsed && parsed.domain ? parsed.domain : location.hostname;

              Cookie.set('jwToken', res.data.access_token, {
                expires: 1,
                domain: __DEV__ ? 'localhost' : `.${domain}`,
              });

              Cookie.set('rfToken', res.data.refresh_token, {
                expires: 1,
                domain: __DEV__ ? 'localhost' : `.${domain}`,
              });

              location.reload();
            } else {
              store.dispatch(replace('/auth'));
            }
          })
          .catch((err) => {
            store.dispatch(replace('/auth'));
          });
      } else {
        store.dispatch(replace('/auth'));
      }
    }

    throw new Error(err.message);
  }
}

export const siteApiFetcher = new Fetcher(config.siteApi);
