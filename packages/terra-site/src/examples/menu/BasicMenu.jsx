import React from 'react';
import Button from 'terra-button';
import Menu from 'terra-menu';

class BasicMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.setButtonNode = this.setButtonNode.bind(this);
    this.getButtonNode = this.getButtonNode.bind(this);
    this.state = { open: false };
  }

  setButtonNode(node) {
    this.buttonNode = node;
  }

  getButtonNode() {
    return this.buttonNode;
  }

  handleButtonClick() {
    this.setState({ open: true });
  }

  handleRequestClose() {
    this.setState({ open: false });
  }

  render() {
    return (
      <div style={{ display: 'inline-block' }} ref={this.setButtonNode}>
        <Menu targetRef={this.getButtonNode} onRequestClose={this.handleRequestClose} isOpen={this.state.open}>
          <Menu.Item text="Default 1" key="1" />
          <Menu.Item
            text="Default 2"
            key="2"
            subMenuItems={[
              <Menu.Item text="Default 2.1" key="2.1" />,
              <Menu.Item text="Default 2.2" key="2.2" />,
              <Menu.Item text="Default 2.3" key="2.3" />,
            ]}
          />
          <Menu.Item text="Default 3" key="3" onClick={() => alert('Default 3')} />
          <Menu.Item text="Default 4" key="4" />
          <Menu.Item text="Default 5" key="5" />
          <Menu.ItemGroup isSelectable key="6">
            <Menu.Item text="Default 61" key="61" />
            <Menu.Item text="Default 62" key="62" />
            <Menu.Item text="Default 63" key="63" />
          </Menu.ItemGroup>
        </Menu>
        <Button onClick={this.handleButtonClick} text="Example Button Text" />
      </div>
    );
  }
}

export default BasicMenu;
