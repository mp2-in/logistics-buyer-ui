import cn from "classnames";
import styles from "./Button.module.scss";

interface Props {
  title: string,
  onClick?: () => void,
  disabled?: boolean,
  variant?: 'primary' | 'default',
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  size?: 'small' | 'medium' | 'large'
}

const Button = (props: Props) => {
  const { title, onClick, disabled, variant, loading, icon, iconPosition } = props;
  return (
    <div
      className={cn({
        [styles.buttonContainer]: true,
        [styles.primary]: variant === "primary",
        [styles.disabled]: disabled || loading,
        [styles.default]: !variant || variant !== 'primary'
      })}
      style={{
        height: props.size === 'small' ? '20px' : props.size === 'medium' ? '30px' : '40px',
        padding: props.size === 'small' ? '0 10px' : props.size === 'medium' ? '0 20px' : '0 30px'
      }}
      onClick={() => {
        return !(disabled || loading) && onClick ? onClick() : null;
      }}
    >
      <div className={styles.title}>
        {icon && iconPosition === 'left' ? icon : null}
        <span style={{
          fontSize: props.size === 'small' ? '12px' : props.size === 'medium' ? '14px' : '16px'
        }}>{title}</span>
        {icon && iconPosition === 'right' ? icon : null}
      </div>
      {loading ? (
        <div className={styles.loaderContainer}>
          <div
            className={cn({
              [styles.loader]: true,
              [styles.default]: !variant || variant !== 'primary'
            })}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Button;
