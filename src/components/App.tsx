import React from 'react';
import { Route, Switch } from 'react-router-dom';

import {Room } from 'components/pages';

export class App extends React.Component<any, any> {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Room} />
      </Switch>
    );
  }
}
