/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropsTable from 'terra-props-table';
import Markdown from 'terra-markdown';
import ReadMe from 'terra-dynamic-grid/docs/README.md';
import { version } from 'terra-dynamic-grid/package.json';

import OneColumn from './OneColumn';
import TwoColumn from './TwoColumn';
import ULayout from './ULayout';
import Dashboard from './Dashboard';


// Component Source
// eslint-disable-next-line import/no-webpack-loader-syntax, import/first, import/no-unresolved, import/extensions
import DynamicGridSrc from '!raw-loader!terra-dynamic-grid/src/DynamicGrid';

// Example Files

const DynamicGridExamples = () => (
  <div>
    <div id="version">Version: {version}</div>
    <Markdown id="readme" src={ReadMe} />
    <PropsTable id="props" src={DynamicGridSrc} />
    <h2>One Column</h2>
    <OneColumn />
    <h2>Two Column</h2>
    <TwoColumn />
    <h2>U Layout</h2>
    <ULayout />
    <h2>Dashboard</h2>
    <Dashboard />
  </div>
);

export default DynamicGridExamples;
