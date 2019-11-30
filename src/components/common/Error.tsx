import React, { Component } from 'react';

export default class Error extends Component {
  state = {
    error: false,
  };

  static getDerivedStateFromError() {
    return { error: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error('failed to load chunk ', error, info);
  }

  render() {
    if (this.state.error) {
      return <h1>Что-то пошло не так</h1>;
    }

    return this.props.children;
  }
}
