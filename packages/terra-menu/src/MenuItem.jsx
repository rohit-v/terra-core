import React from 'react';
import PropTypes from 'prop-types';
import List from 'terra-list';
import classNames from 'classnames/bind';
import 'terra-base/lib/baseStyles';
import styles from './MenuItem.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * Sets the item's text
   */
  text: PropTypes.string,

  /**
   * Indicates if the item is selected.
   */
  isSelected: PropTypes.bool,

  /**
   * Indicates if the item should be selectable
  */
  isSelectable: PropTypes.bool,

  /**
   * List of Menu.Items to display in a submenu when this item is selected.
   */
  subMenuItems: PropTypes.arrayOf(PropTypes.element),
};

const defaultProps = {
  text: '',
  isSelected: false,
  isSelectable: undefined,
  subMenuItems: [],
};

const MenuItem = ({
  text,
  isSelected,
  isSelectable,
  subMenuItems,
  ...customProps
}) => {
  const attributes = Object.assign({}, customProps);

  const itemClassNames = cx([
    'item',
    attributes.className,
  ]);

  return (
    <List.Item
      {...attributes}
      className={itemClassNames}
      hasChevron={subMenuItems.length > 0}
      content={<div>{text}</div>}
      isSelectable={isSelectable}
      isSelected={isSelected}
    />
  );
};

MenuItem.propTypes = propTypes;
MenuItem.defaultProps = defaultProps;

export default MenuItem;
