import { ReactElement, JSXElementConstructor } from 'react'

import styles from "./Modal.module.scss";

interface Props {
  open: boolean,
  onClose: () => void,
  overflow?: boolean,
  large?: boolean,
  extra_large?: boolean,
  title?: string,
  children: ReactElement<any, string | JSXElementConstructor<any>>
}

const Modal = (props: Props) => {
  const { open, onClose } = props;
  return open ? (
    <div className={styles.modalContainer} onClick={() => onClose()}>
        {props.children}
    </div>
  ) : null;
};

export default Modal;
