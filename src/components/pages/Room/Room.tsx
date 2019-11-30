import React, { Component } from 'react';
import styled from 'styled-components';

import { connect } from 'core';
import { AuthPageProps, StoreDispatchProps, StoreProps, AuthPageState } from './types';

const Page = styled.div`
  width: 100%;
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  background-color: rgb(251, 251, 249);
  max-width: 1440px;
  overflow: initial;
  margin: 0px auto;
  padding: 40px 40px 50px;
`;

class Room extends Component<AuthPageProps, AuthPageState> {
  render() {
    return <Page> Room page</Page>;
  }
}

export default connect<StoreProps, StoreDispatchProps, any>(
  (state) => {
    return {};
  },
  (dispatch) => {
    return {};
  }
)(Room);
