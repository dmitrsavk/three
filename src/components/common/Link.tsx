import React from 'react';
import { Link } from 'react-router-dom';

type LinkProps = {
  children?: any;
  to: any;
  className?: string;
};

export default (props: LinkProps) => (
  <Link to={props.to} className={props.className}>
    {props.children}
  </Link>
);
