/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropsTable from 'terra-props-table';
import Markdown from 'terra-markdown';
import ReadMe from 'terra-menu/docs/README.md';
import { version } from 'terra-menu/package.json';

// Component Source
/* eslint-disable import/no-webpack-loader-syntax, import/first, import/no-unresolved, import/extensions */
import MenuSrc from '!raw-loader!terra-menu/src/Menu';
import MenuItemSrc from '!raw-loader!terra-menu/src/MenuItem';
import MenuItemGroupSrc from '!raw-loader!terra-menu/src/MenuItemGroup';
/* eslint-enable import/no-webpack-loader-syntax, import/first, import/no-unresolved, import/extensions */

// Example Files
import BasicMenu from './BasicMenu';
import MenuBounded from './MenuBounded';
import ArrowMenu from './ArrowMenu';

const MenuExamples = () => (
  <div>
    <div id="version">Version: {version}</div>
    <Markdown id="readme" src={ReadMe} />
    <h2>Menu</h2>
    <PropsTable id="props" src={MenuSrc} />

    <h2>Menu</h2>
    <BasicMenu />
    <br />
    <br />
    <ArrowMenu />
    <h2 id="bounded-popup" style={{ paddingTop: '20px' }}>Menu Bounded</h2>
    <MenuBounded />
  </div>
);

export default MenuExamples;
