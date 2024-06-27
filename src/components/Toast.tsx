import { useEffect } from "react";
import { CSSTransition } from "react-transition-group"
import cn from "classnames";
import closeIcon from '@assets/close_white.png'

import styles from "./Toast.module.scss"
import { useAppConfigStore } from "stores/appConfig";

export default () => {
    const [message, type,toastVisibility, hideToast] = useAppConfigStore(state => [state.toastMessage, state.toastType, state.toastVisibility, state.hideToast])

    useEffect(() => {
        if(message && type) {
            let timer = setTimeout(
                () => {
                    hideToast()
                },
                3000
            );
    
            return () => {
                clearTimeout(timer);
            };
        }
    }, [type, message,toastVisibility]);

    return (<CSSTransition
        in={toastVisibility} timeout={1000}
        classNames={{
            enter: styles['alert-enter'],
            enterActive: styles['alert-enter-active'],
            exit: styles['alert-exit'],
            exitActive: styles['alert-exit-active']
        }}
        unmountOnExit
        onExited={() => {
            hideToast();
        }}>
        <div
            className={styles["container"]}
            onClick={() => hideToast()}
        >
            <div className={cn({
                [styles['inner-container']]: true,
                [styles['error']]: type === "error",
                [styles['warning']]: type === "warning"
            })}>
                <img src={closeIcon} className={styles['close-logo']} />
                <span className={styles["message"]}>{message}</span>
            </div>
        </div>
    </CSSTransition>
    );
};

