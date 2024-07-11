import { ReactElement, JSXElementConstructor } from 'react'

import styles from "./Modal.module.scss";
import ActivityIndicator from './ActivityIndicator';

interface Props {
  open: boolean,
  onClose: () => void,
  overflow?: boolean,
  large?: boolean,
  extra_large?: boolean,
  title?: string,
  children: ReactElement<any, string | JSXElementConstructor<any>>
  loading?: boolean
}

const Modal = (props: Props) => {
  const { open, onClose } = props;
  return open ? (
    <div className={styles.modalContainer} onMouseDown={() => onClose()}>
        {props.children}
        {props.loading?<ActivityIndicator />:null}
    </div>
  ) : null;
};

export default Modal;
