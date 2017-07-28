import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import 'terra-base/lib/baseStyles';
import styles from './BaseLayout.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The component(s) that will be wrapped by `<BaseLayout />`.
   */
  children: PropTypes.node.isRequired,
  /**
   * If this is set to true, the base layout will not provide overflow auto.
   * The use case for this is if your child component will be provide the overflow auto sytling itself.
   */
  disableOverflow: PropTypes.bool,
};

const defaultProps = {
  disableOverflow: false,
};

class BaseLayout extends React.Component {

  render() {
    const {
      children,
      disableOverflow,
      ...customProps
    } = this.props;

    const layoutClassNames = cx([
      'inner',
      { 'disable-overflow': disableOverflow },
      customProps.className,
    ]);

    return (
      <div {...customProps} className={layoutClassNames}>
        {children}
      </div>
    );
  }
}

BaseLayout.propTypes = propTypes;
BaseLayout.defaultProps = defaultProps;

export default BaseLayout;
