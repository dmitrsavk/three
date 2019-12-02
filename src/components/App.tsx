import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Room, Sun } from 'components/pages';

export class App extends React.Component<any, any> {
  render() {
    return (
      <Switch>
        <Route exact path="/room" component={Room} />
        <Route exact path="/sun" component={Sun} />
      </Switch>
    );
  }
}
