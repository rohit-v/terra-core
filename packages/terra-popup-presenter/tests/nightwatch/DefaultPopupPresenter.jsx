import React from 'react';
import PopupPresenter from '../../lib/PopupPresenter';

const popup = () => (
  <PopupPresenter
    attachment="top left"
    content={<p>im a popup content</p>}
    enabled
    target={<p>popup button launcher</p>}
    targetAttachment="bottom left"
  />
);

export default popup;
