/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { Link } from 'react-router';

const ButtonGroupTests = () => (
  <div>
    <ul>
      <li><Link to="/tests/base-layout-tests/default">BaseLayout - Default</Link></li>
      <li><Link to="/tests/base-layout-tests/overflow-disabled">BaseLayout - Overflow Disabled</Link></li>
    </ul>
  </div>
);

export default ButtonGroupTests;
