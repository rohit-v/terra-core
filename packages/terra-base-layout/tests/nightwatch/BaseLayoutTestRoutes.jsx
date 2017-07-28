/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { Route } from 'react-router';
import BaseLayoutTests from './BaseLayoutTests';
import DefaultBaseLayout from './DefaultBaseLayout';
import DisabledBaseLayout from './DisabledBaseLayout';

const routes = (
  <div>
    <Route path="/tests/base-layout-tests" component={BaseLayoutTests} />
    <Route path="/tests/base-layout-tests/default" component={DefaultBaseLayout} />
    <Route path="/tests/base-layout-tests/overflow-disabled" component={DisabledBaseLayout} />
  </div>
);

export default routes;
