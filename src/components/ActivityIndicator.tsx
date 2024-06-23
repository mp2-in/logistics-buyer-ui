import cn from "classnames";

import styles from "./ActivityIndicator.module.scss";

const ActivityIndicator = (props: { message?: string, fullScreen?: boolean }) => {
  const {message, fullScreen} = props;

  return (
    <div
      className={cn({
        [styles["loader-outer-container"]]: true,
        [styles["full-screen"]]: fullScreen,
      })}
    >
      <div className={styles["sk-fading-circle"]}>
        <div className={cn(styles["sk-circle1"], styles["sk-circle"])}/>
        <div className={cn(styles["sk-circle2"], styles["sk-circle"])}/>
        <div className={cn(styles["sk-circle3"], styles["sk-circle"])}/>
        <div className={cn(styles["sk-circle4"], styles["sk-circle"])}/>
        <div className={cn(styles["sk-circle5"], styles["sk-circle"])}/>
        <div className={cn(styles["sk-circle6"], styles["sk-circle"])}/>
        <div className={cn(styles["sk-circle7"], styles["sk-circle"])}/>
        <div className={cn(styles["sk-circle8"], styles["sk-circle"])}/>
        <div className={cn(styles["sk-circle9"], styles["sk-circle"])}/>
        <div className={cn(styles["sk-circle10"], styles["sk-circle"])}/>
        <div className={cn(styles["sk-circle11"], styles["sk-circle"])}/>
        <div className={cn(styles["sk-circle12"], styles["sk-circle"])}/>
      </div>
      {message ? <p>{message}</p> : null}
    </div>
  );
};

export default ActivityIndicator;
