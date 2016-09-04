declare module 'reactstrap' {
    export class Button extends React.Component<{
        active?: boolean,
        block?: boolean,
        bsClass?: string,
        bsSize?: 'large' | 'small' | 'xsmall',
        bsStyle?: "primary" | "default" | "success" | 'info' | 'warning' | 'danger' | 'link',
        href?: string,
        disabled?: boolean,
        onClick?: any,
        type?: 'button' | 'reset' | 'submit'
    }, {}> {
        onHide
    }

    export class Popover extends React.Component<{
        id?: string,
        title?: string,
    }, {}> {

    }

    export class Tooltip extends React.Component<{
        id?: string,
    }, {}>{

    }

    export class Modal extends React.Component<{
        show: boolean,
        onHide: () => any
    }, {}>{

        static Header: ModalHeader;
        static Title: ModalTitle;
        static Body: ModalBody;
        static Footer: ModalFooter;
    }

    export class ModalHeader extends React.Component<{
        closeButton?: boolean
    }, {}>{
    }

    export class ModalTitle extends React.Component<{
        closeButton?: boolean
    }, {}>{
    }

    export class ModalBody extends React.Component<{}, {}>{
    }

    export class ModalFooter extends React.Component<{}, {}>{
    }

    export class OverlayTrigger extends React.Component<{
        overlay: JSX.Element 
    }, {}>{
    }
}