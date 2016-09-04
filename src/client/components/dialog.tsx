import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Popover, Tooltip, OverlayTrigger  } from 'reactstrap';

interface DialogProperty {
    buttonLabel: string
}

interface DialogState {
    showModal: boolean
}

export class Dialog extends React.Component<DialogProperty, DialogState> {
    constructor(props) {
        super(props);
        this.state =  { showModal: false };

    }

    close = () => {
        let state = {} as DialogState;
        state.showModal = false;
        this.setState(state);
    }

    open = () => {
        this.setState({ showModal: true });
    }

    render() {
        const popover = (
            <Popover id="modal-popover" title="popover">
                very popover.such engagement
            </Popover>
        );
        const tooltip = (
            <Tooltip id="modal-tooltip">
                wow.
            </Tooltip>
        );

        return (
            <div>
                <p>Click to get the full Modal experience!</p>

                <Button
                    bsStyle="primary"
                    bsSize="large"
                    onClick={this.open}
                    >
                    Launch demo modal
                </Button>

                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Text in a modal</h4>
                        <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>

                        <h4>Popover in a modal</h4>
                        <p>there is a <OverlayTrigger overlay={popover}><a href="#">popover</a></OverlayTrigger> here</p>

                        <h4>Tooltips in a modal</h4>
                        <p>there is a <OverlayTrigger overlay={tooltip}><a href="#">tooltip</a></OverlayTrigger> here</p>

                        <hr />

                        <h4>Overflowing text to show scroll behavior</h4>
                        <p>Cras mattis consectetur purus sit amet fermentum.Cras justo odio, dapibus ac facilisis in, egestas eget quam.Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
                        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
                        <p>Aenean lacinia bibendum nulla sed consectetur.Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Donec sed odio dui.Donec ullamcorper nulla non metus auctor fringilla.</p>
                        <p>Cras mattis consectetur purus sit amet fermentum.Cras justo odio, dapibus ac facilisis in, egestas eget quam.Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
                        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
                        <p>Aenean lacinia bibendum nulla sed consectetur.Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Donec sed odio dui.Donec ullamcorper nulla non metus auctor fringilla.</p>
                        <p>Cras mattis consectetur purus sit amet fermentum.Cras justo odio, dapibus ac facilisis in, egestas eget quam.Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
                        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
                        <p>Aenean lacinia bibendum nulla sed consectetur.Praesent commodo cursus magna, vel scelerisque nisl consectetur et.Donec sed odio dui.Donec ullamcorper nulla non metus auctor fringilla.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
