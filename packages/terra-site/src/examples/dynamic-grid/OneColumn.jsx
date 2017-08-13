import React from 'react';
import DynamicGrid from 'terra-dynamic-grid';

import Card from './Card';

const layouts = [{
  'grid-template-columns': '100px',
  'grid-template-rows': 'auto',
  regions: [
    {
      name: 'r1',
      'grid-column-start': 1,
      'grid-column-end': 1,
      'grid-row-start': 1,
      'grid-row-end': 1,
    },
  ],
}];

const OneColumn = () => (
  (<DynamicGrid layouts={layouts}>
    <DynamicGrid.Region name="r1">
      <Card>Region 1</Card>
    </DynamicGrid.Region>
  </DynamicGrid>)
);

export default OneColumn;
