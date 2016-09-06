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
        /**
         * Open and close the Modal with a slide and fade animation.
         */
        animation?: boolean,
        /**
         * Include a backdrop component. Specify 'static' for a backdrop that doesn't trigger an "onHide" when clicked.
         */
        backdrop?: 'static' | boolean,
        /**
         * Base CSS class and prefix for the component. Generally one should only change bsClass to provide new, non-Bootstrap, CSS styles for a component.
         */
        bsClass?: string,
        /**
         * Component size variations.
         */
        bsSize?: 'lg' | 'large' | 'sm' | 'small',
        /**
         * A css class to apply to the Modal dialog DOM node.
         */
        dialogClassName?: string,
        /**
         * A Component type that provides the modal content Markup. This is a useful prop when you want to use your own styles and markup to create a custom modal component.
         */
        dialogComponentClass?: any,
        /**
         * When true The modal will prevent focus from leaving the Modal while open. Consider leaving the default value here, as it is necessary to make the Modal work well with assistive technologies, such as screen readers.
         */
        enforceFocus?: boolean,
        /**
         * Close the modal when escape key is pressed
         */
        keyboard?: boolean,
        /**
         * Callback fired before the Modal transitions in
         */
        onEnter?: () => void,
        /**
         * Callback fired after the Modal finishes transitioning in
         */
        onEntered?: () => void,
        /**
         * Callback fired as the Modal begins to transition in
         */
        onEntering?: () => void,
        /**
         * Callback fired right before the Modal transitions out
         */
        onExit?: () => void,
        /**
         * Callback fired after the Modal finishes transitioning out
         */
        onExited?: () => void,
        /**
         * Callback fired as the Modal begins to transition out
         */
        onExiting?: () => void,
        /**
         * A callback fired when the header closeButton or non-static backdrop is clicked. Required if either are specified.
         */
        onHide?: () => any
        /**
         * When true The modal will show itself.
         */
        show?: boolean,
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