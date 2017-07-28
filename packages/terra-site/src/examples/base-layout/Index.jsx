/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropsTable from 'terra-props-table';
import Markdown from 'terra-markdown';
import ReadMe from 'terra-base-layout/docs/README.md';
// Component Source
// eslint-disable-next-line import/no-webpack-loader-syntax, import/first, import/no-unresolved, import/extensions
import BaseLayoutSrc from '!raw-loader!terra-base-layout/src/BaseLayout.jsx';

const BaseLayoutExamples = () => (
  <div>
    <Markdown id="readme" src={ReadMe} />
    <PropsTable id="props" src={BaseLayoutSrc} />
  </div>
);

export default BaseLayoutExamples;
