import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import 'terra-base/lib/baseStyles';
import styles from './MenuSection.scss';

const cx = classNames.bind(styles);

const propTypes = {
  children: PropTypes.node,
};

const MenuSection = ({ children }) => (
  <div className={cx(['section'])} >
    <hr className={cx(['divider'])} />
    {children}
    <hr className={cx(['divider'])} />
  </div>
);

MenuSection.propTypes = propTypes;

export default MenuSection;
