/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { Route } from 'react-router';
import MenuTests from './MenuTests';

// Test Cases
import DefaultMenu from './DefaultMenu';
import BoundedMenu from './BoundedMenu';
import Deminsions100xMenu from './Deminsions100xMenu';
import Deminsions75xMenu from './Deminsions75xMenu';
import Deminsions50xMenu from './Deminsions50xMenu';
import Deminsions25xMenu from './Deminsions25xMenu';

const routes = (
  <div>
    <Route path="/tests/menu-tests" component={MenuTests} />
    <Route path="/tests/menu-tests/default" component={DefaultMenu} />
    <Route path="/tests/menu-tests/bounded" component={BoundedMenu} />
    <Route path="/tests/menu-tests/deminsions-100x" component={Deminsions100xMenu} />
    <Route path="/tests/menu-tests/deminsions-75x" component={Deminsions75xMenu} />
    <Route path="/tests/menu-tests/deminsions-50x" component={Deminsions50xMenu} />
    <Route path="/tests/menu-tests/deminsions-25x" component={Deminsions25xMenu} />
  </div>
);

export default routes;
