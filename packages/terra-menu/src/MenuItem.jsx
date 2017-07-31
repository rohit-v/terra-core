import React from 'react';
import PropTypes from 'prop-types';
import Arrange from 'terra-arrange';
import CheckIcon from 'terra-icon/lib/icon/IconCheckmark';
import ChevronIcon from 'terra-icon/lib/icon/IconChevronRight';
import classNames from 'classnames/bind';
import 'terra-base/lib/baseStyles';
import styles from './MenuItem.scss';

const cx = classNames.bind(styles);

const KEYCODES = {
  ENTER: 13,
  SPACE: 32,
};

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
   * Indicates if the item should be toggle-able
  */
  isToggleItem: PropTypes.bool,

  /**
   * List of Menu.Items to display in a submenu when this item is selected.
   */
  subMenuItems: PropTypes.arrayOf(PropTypes.element),

  onClick: PropTypes.func,

  onKeyDown: PropTypes.func,
};

const defaultProps = {
  text: '',
  isSelected: false,
  isToggleItem: false,
  subMenuItems: [],
};

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.wrapOnClick = this.wrapOnClick.bind(this);
    this.wrapOnKeyDown = this.wrapOnKeyDown.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.state = { isSelected: props.isSelected };
  }

  handleSelection() {
    event.preventDefault();
    this.setState(prevState => ({ isSelected: !prevState.isSelected }));
  }

  wrapOnClick(event) {
    this.handleSelection();

    if (this.props.onClick) {
      this.props.onClick(event);
    }
  }

  wrapOnKeyDown(event) {
    if (event.nativeEvent.keyCode === KEYCODES.ENTER || event.nativeEvent.keyCode === KEYCODES.SPACE) {
      this.handleSelection();
    }

    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
  }

  render() {
    const {
      text,
      isSelected,
      isToggleItem,
      subMenuItems,
      ...customProps
    } = this.props;

    const attributes = Object.assign({}, customProps);
    attributes.tabIndex = '0';

    if (isToggleItem) {
      attributes.onClick = this.wrapOnClick;
      attributes.onKeyDown = this.onKeyDown;
    }

    const itemClassNames = cx([
      'item',
      { selected: this.state.isSelected },
      attributes.className,
    ]);

    const hasChevron = subMenuItems.length > 0;
    const content = <div className={cx(['title'])}>{text}</div>;

    if (hasChevron || isToggleItem) {
      return (
        <li {...attributes} className={itemClassNames}>
          <Arrange
            fitStart={isToggleItem || isSelected ? <CheckIcon className={cx(['checkmark'])} /> : null}
            fill={content}
            fitEnd={hasChevron ? <ChevronIcon className={cx(['chevron'])} /> : null}
            align={'center'}
          />
        </li>
      );
    }

    return (
      <li {...attributes} className={itemClassNames}>
        {content}
      </li>
    );
  }
}

MenuItem.propTypes = propTypes;
MenuItem.defaultProps = defaultProps;

export default MenuItem;
