import React from 'react';
import PropTypes from 'prop-types';
import SlideGroup from 'terra-slide-group';
import MenuContent from './_MenuContent';

const propTypes = {
  /**
   * The function that should be triggered when a close is indicated.
   */
  onRequestClose: PropTypes.func.isRequired,

  isFullScreen: PropTypes.bool,
  isOpen: PropTypes.bool,

  /**
   * List off initial menu items.
   */
  items: PropTypes.array,
};

class MenuNavStack extends React.Component {
  constructor(props) {
    super(props);
    this.resetState = this.resetState.bind(this);
    this.getInitialState = this.getInitialState.bind(this);
    this.push = this.push.bind(this);
    this.pop = this.pop.bind(this);
    this.state = this.getInitialState();
  }

  getInitialState() {
    const initialMenu = (
      <MenuContent
        key="MenuPage-0"
        onNext={this.push}
        onBack={this.pop}
        onClose={this.props.onRequestClose}
        isFullScreen={this.props.isFullScreen}
        index={0}
      >
        {this.props.items}
      </MenuContent>
    );

    return {
      stack: [initialMenu],
    };
  }

  resetState() {
    this.setState(prevState => ({
      stack: [prevState.stack[0]],
    }));
  }

  pop() {
    this.setState((prevState) => {
      prevState.stack.pop();
      return { stack: prevState.stack };
    });
  }

  push(content) {
    this.setState((prevState) => {
      prevState.stack.push(content);
      return { stack: prevState.stack };
    });
  }

  render() {
    if (!this.props.isOpen && this.state.stack.length > 1) {
      this.resetState();
    }

    return (
      <SlideGroup items={this.state.stack} isAnimated />
    );
  }

}

MenuNavStack.propTypes = propTypes;

export default MenuNavStack;
