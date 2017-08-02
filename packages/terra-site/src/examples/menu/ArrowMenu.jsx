import React from 'react';
import Button from 'terra-button';
import Menu from 'terra-menu';

class ArrowMenu extends React.Component {
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
        <Menu
          isOpen={this.state.open}
          targetRef={this.getButtonNode}
          onRequestClose={this.handleRequestClose}
          contentWidth="240"
          isArrowDisplayed
        >
          <Menu.Item text="Toggle Item 1" key="Toggle1" isSelected isSelectable />
          <Menu.Item text="Toggle Item 2" key="Toggle2" isSelectable />
          <Menu.Divider key="Divider1" />
          <Menu.Item
            text="Nested Menu 1"
            key="Nested1"
            subMenuItems={[
              <Menu.Item text="Action 1.1" key="1.1" onClick={() => alert('Action 1.1')} />,
              <Menu.Item text="Action 1.2" key="1.2" onClick={() => alert('Action 1.2')} />,
              <Menu.Item text="Action 1.3" key="1.3" onClick={() => alert('Action 1.3')} />,
              <Menu.Divider key="Divider1.1" />,
              <Menu.Item
                text="Nested 1.1"
                key="1.4"
                subMenuItems={[
                  <Menu.Item text="Toggle 1.1.1" key="1.1.1" isSelectable />,
                  <Menu.Item text="Toggle 1.1.2" key="1.1.2" isSelectable />,
                  <Menu.Item text="Toggle 1.1.3" key="1.1.3" isSelectable />,
                ]}
              />,
              <Menu.Item
                text="Nested 1.2"
                key="1.5"
                subMenuItems={[
                  <Menu.Item text="Toggle 1.2.1" key="1.2.1" isSelectable />,
                  <Menu.Item text="Toggle 1.2.2" key="1.2.2" isSelectable />,
                  <Menu.Item text="Toggle 1.2.3" key="1.2.3" isSelectable />,
                ]}
              />,
              <Menu.Item
                text="Nested 1.3"
                key="1.6"
                subMenuItems={[
                  <Menu.Item text="Toggle 1.3.1" key="1.3.1" isSelectable />,
                  <Menu.Item text="Toggle 1.3.2" key="1.3.2" isSelectable />,
                  <Menu.Item text="Toggle 1.3.3" key="1.3.3" isSelectable />,
                ]}
              />,
            ]}
          />
          <Menu.Item
            text="Nested Menu 2"
            key="Nested2"
            subMenuItems={[
              <Menu.Item text="Default 2.1" key="2.1" />,
              <Menu.Item text="Default 2.2" key="2.2" />,
              <Menu.Item text="Default 2.3" key="2.3" />,
              <Menu.Divider key="Divider2.1" />,
              <Menu.Item text="Default 2.1" key="2.4" />,
              <Menu.Item text="Default 2.2" key="2.5" />,
              <Menu.Item text="Default 2.3" key="2.6" />,
            ]}
          />
          <Menu.Divider key="Divider2" />
          <Menu.Item text="Action Item 1" key="Action1" onClick={() => alert('Action 1')} />
          <Menu.Item text="Action Item 2" key="Action2" onClick={() => alert('Action 2')} />
          <Menu.Divider key="Divider3" />
          <Menu.ItemGroup key="Group">
            <Menu.Item text="Group Item 1" key="GroupItem1" />
            <Menu.Item text="Group Item 2" key="GroupItem2" />
          </Menu.ItemGroup>
        </Menu>
        <Button onClick={this.handleButtonClick} text="Menu With Arrow" />
      </div>
    );
  }
}

export default ArrowMenu;
