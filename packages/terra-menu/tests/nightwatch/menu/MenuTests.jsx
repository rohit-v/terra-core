/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { Link } from 'react-router';

const MenuTests = () => (
  <div>
    <ul>
      <li><Link to="/tests/menu-tests/default">Menu - Default</Link></li>
      <li><Link to="/tests/menu-tests/bounded">Menu - Bounded</Link></li>
      <li><Link to="/tests/menu-tests/deminsions-100x">Menu - 100x Height</Link></li>
      <li><Link to="/tests/menu-tests/deminsions-75x">Menu - 75x Height</Link></li>
      <li><Link to="/tests/menu-tests/deminsions-50x">Menu - 50x Height</Link></li>
      <li><Link to="/tests/menu-tests/deminsions-25x">Menu - 25x Height</Link></li>
    </ul>
  </div>
);

export default MenuTests;
