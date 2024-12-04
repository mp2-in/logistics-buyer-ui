interface Props {
  title: string,
  onClick?: () => void,
  disabled?: boolean,
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light',
  loading?: boolean
  icon?: React.ReactNode
}


export default (props: Props) => {
  const { title, onClick, disabled, loading, icon, variant } = props;

  const bgColors = {
      primary: 'bg-process-cyan',
      secondary: 'bg-gray-500',
      success: 'bg-green-700',
      warning: 'bg-yellow-500',
      danger: 'bg-red-600',
      info: 'bg-sky-400',
      light: 'bg-white',
  }

  return (
      <div className={`inline-flex items-center py-2 px-7 rounded-md justify-center text-center relative min-w-60
       ${bgColors[variant]} ${loading || disabled ? 'opacity-45' : 'cursor-pointer active:opacity-65'} ${variant === 'light'?'border border-slate-400':''}`}
          onClick={() => {
              return !(disabled || loading) && onClick ? onClick() : null;
          }}
      >
          <div className={`flex justify-between items-center`}>
              {icon ? <div className="w-6 mr-2 hidden md:block">{icon}</div> : null}
              <span className={`select-none ${variant === 'light'?'text-slate-600':'text-white'} font-bold text-xl`}>{title}</span>
          </div>
          {loading ? (
              <div className={`w-full h-full absolute left-0 flex items-center justify-center`}>
                  <div
                      className={`border-[3px] rounded-full border-t-[3px] ${variant === 'light'?'border-t-slate-600':'border-t-white'} border-transparent w-[28px] h-[28px] animate-spin absolute`}
                  />
              </div>
          ) : null}
      </div>
  );
};
