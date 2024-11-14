import closeIcon from "@assets/cancel.png"
import retryIcon from "@assets/retry.png"

export default ({ onClose, onRefresh }: {
    onClose?: () => void,
    onRefresh?: () => void
}) => {

    return <div className="grid grid-cols-2 gap-5 pb-2 md:pb-8">
        <div className="flex items-center flex-col" >
            <div className={`w-10 h-10 rounded-full border-2 border-red-500 flex items-center justify-center ${onClose ? 'cursor-pointer' : 'opacity-30'}`} onClick={() => {
                if (onClose) {
                    onClose()
                }
            }}>
                <img src={closeIcon} className="w-6" />
            </div>
            <p className={`text-sm mt-1 hidden md:block text-red-500 font-semibold ${onClose ? '' : 'opacity-30'}`}>Close Issue</p>
        </div>
        <div className="flex items-center flex-col" onClick={() => {
            if (onRefresh) {
                onRefresh()
            }
        }}>
            <div className={`w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center ${onRefresh ? 'cursor-pointer' : 'opacity-30'} active:opacity-40`}>
                <img src={retryIcon} className="w-6" />
            </div>
            <p className={`text-sm mt-1 hidden md:block text-blue-500 font-semibold ${onRefresh ? '' : 'opacity-30'}`}>Refresh Issue</p>
        </div>
    </div>
}