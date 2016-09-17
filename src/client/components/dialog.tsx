import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Popover, Tooltip, OverlayTrigger  } from 'reactstrap';

export interface DialogState {
    showModal: boolean,
    title: string,
}

export class Dialog extends React.Component<{}, DialogState> {
    constructor(props) {
        super(props);
        this.state = { showModal: false, title: "" };

    }

    close = () => {
        let state = {} as DialogState;
        state.showModal = false;
        this.setState(state);
    }

    open = () => {
        let state = this.state;
        state.showModal = true;
        this.setState(state);
    }

    render() {
        return (
            <div>
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className="form-horizontal">
                            <div className="form-group">
                                <label className="col-sm-2 control-label">名称</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control"/>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="primary">确定</Button>
                        <Button onClick={this.close}>取消</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
