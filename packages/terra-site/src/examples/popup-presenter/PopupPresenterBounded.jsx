import React from 'react';
import PopupPresenter from 'terra-popup-presenter';
import ExamplePopupContent from './ExamplePopupContent';

class PopupPresenterBounded extends React.Component {
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.setButtonNode = this.setButtonNode.bind(this);
    this.getButtonNode = this.getButtonNode.bind(this);
    this.setParentNode = this.setParentNode.bind(this);
    this.getParentNode = this.getParentNode.bind(this);
    this.state = { open: false };
  }

  setButtonNode(node) {
    this.buttonNode = node;
  }

  getButtonNode() {
    return this.buttonNode;
  }

  setParentNode(node) {
    this.parentNode = node;
  }

  getParentNode() {
    return this.parentNode;
  }

  handleButtonClick() {
    this.setState({ open: true });
  }

  handleRequestClose() {
    this.setState({ open: false });
  }

  handleOnChange() {
    this.setState({ open: false });
  }
  
  render() {
    return (
      <div style={{ height: '200px', width: '200px', background: 'aliceblue' }} ref={this.setParentNode}>
        <PopupPresenter
          boundingRef={this.getParentNode}
          isOpen={this.state.open}
          onRequestClose={this.handleRequestClose}
          targetRef={this.getButtonNode}
        >
          <ExamplePopupContent onChange={this.handleOnChange} />
        </PopupPresenter>
        <button id="bounded-button" onClick={this.handleButtonClick} ref={this.setButtonNode}>
          Bounded Popup
        </button>
      </div>
    );
  }
}

export default PopupPresenterBounded;
