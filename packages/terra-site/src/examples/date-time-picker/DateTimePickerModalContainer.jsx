import React from 'react';
import DateTimePicker from 'terra-date-time-picker';
import Button from 'terra-button';
import AppDelegate from 'terra-app-delegate';

class ModalContainer extends React.Component {
  constructor(props) {
    super(props);

    this.disclose = this.disclose.bind(this);
    this.closeDisclosure = this.closeDisclosure.bind(this);
  }

  disclose(size) {
    return () => {
      const identifier = Date.now();

      this.props.app.disclose({
        preferredType: 'modal',
        size,
        content: {
          key: `DateTimePickerInModalExample-${identifier}`,
          name: 'DateTimePickerInModalExample',
          props: {
            identifier: `DateTimePickerInModalExample-${identifier}`,
          },
        },
      });
    };
  }

  closeDisclosure() {
    this.props.app.closeDisclosure();
  }

  modalContent(props) {
    return (
      <div className="content-container" style={{ height: '100%', padding: '10px' }}>
        {props.app && props.app.releaseFocus ? <h4>Modal focus is released!</h4> : null }
        {props.app && props.app.requestFocus ? <h4>Modal focus is trapped!</h4> : null }
        <DateTimePicker name="date-time-picker-in-modal" releaseFocus={props.app.releaseFocus} requestFocus={props.app.requestFocus} />
        <br />
        <br />
        <Button className="close-disclosure" text="Close Disclosure" onClick={this.closeDisclosure} />
      </div>
    );
  }

  render() {
    const { app } = this.props;
    const content = this.modalContent(this.props);
    const triggerButton = <Button className="disclose" text="Disclose Modal" onClick={this.disclose()} />;

    return (
      app && app.closeDisclosure ? content : triggerButton
    );
  }
}

ModalContainer.propTypes = {
  app: AppDelegate.propType,
};

AppDelegate.registerComponentForDisclosure('DateTimePickerInModalExample', ModalContainer);

export default ModalContainer;
