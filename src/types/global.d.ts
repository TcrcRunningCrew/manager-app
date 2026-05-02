declare module "*.css" {}

declare module "react-modal" {
  import React from "react";

  interface ModalProps {
    isOpen: boolean;
    onRequestClose?: () => void;
    className?: string;
    overlayClassName?: string;
    contentLabel?: string;
    children?: React.ReactNode;
  }

  const Modal: React.FC<ModalProps>;
  export default Modal;
}
