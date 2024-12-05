import walletIcon from "@assets/wallet.png"
import overviewIcon from "@assets/overview.png"
import headsetIcon from "@assets/headset.png"
import homeIcon from "@assets/home.png"
import Button from "./Button"

export default ({ onClick, disabled, loading }: { onClick: () => void, disabled: boolean, loading: boolean }) => {
    return <div className="absolute -bottom-1 w-full">
        <div className="px-6">
            <div className="text-gray-600">
                <p>Delivery Now</p>
                <p>Starting at Rs 40 for first 2 kms</p>
            </div>
            <div className="flex w-full items-center justify-center my-4">
                <Button title="Find Delivery Partner" onClick={onClick} variant="primary"
                    disabled={disabled} loading={loading}/>
            </div>
        </div>
        <div className="flex justify-between w-full border-t border-gray-400 h-[60px] items-center px-2">
            <img src={homeIcon} className="w-10" />
            <img src={overviewIcon} className="w-10" />
            <img src={walletIcon} className="w-10" />
            <img src={headsetIcon} className="w-10" />
        </div>
    </div>
}