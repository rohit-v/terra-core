import React from 'react';
import BaseLayout from '../../src/BaseLayout';

// Snapshot Tests
it('should support rendering a string without translation', () => {
  const baseLayout = shallow(<BaseLayout>String</BaseLayout>);

  expect(baseLayout).toMatchSnapshot();
});

it('should support rendering a string without translation', () => {
  const baseLayout = shallow(<BaseLayout disableOverflow>String</BaseLayout>);

  expect(baseLayout).toMatchSnapshot();
});
