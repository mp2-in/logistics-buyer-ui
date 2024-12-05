import manageIcon from "@assets/manage_account.png"
import overviewIcon from "@assets/overview.png"
import headsetIcon from "@assets/headset.png"
import homeIcon from "./home.png"
import Button from "./Button"
import { useNavigate } from "react-router-dom"

const MainMenuItem = ({ icon, onClick, selected, disabled }: { icon: React.ReactNode, onClick?: () => void, selected?: boolean, disabled?: boolean }) => {
    return <div className={`flex justify-center items-center w-[50px] h-[50px] rounded-full ${selected ? 'bg-slate-200' : ''} ${disabled? 'opacity-40':''}`}
        onClick={() => onClick && onClick()}>
        {icon}
    </div>
}

export default ({ onClick, disabled, loading, page }: { onClick?: () => void, disabled?: boolean, loading?: boolean, page: string }) => {
    const navigate = useNavigate()

    return <div className="absolute -bottom-1 w-full">
        {onClick ? <div className="px-6">
            <div className="text-gray-600">
                <p>Delivery Now</p>
                <p>Starting at Rs 40 for first 2 kms</p>
            </div>
            <div className="flex w-full items-center justify-center my-4">
                <Button title="Find Delivery Partner" onClick={() => onClick && onClick()} variant="primary"
                    disabled={disabled} loading={loading} />
            </div>
        </div> : null}
        <div className="flex justify-between w-full border-t border-gray-400 h-[60px] items-center px-2">
            <MainMenuItem icon={<img src={homeIcon} className={`w-8`}/>} selected={page === 'neworder'} onClick={() => navigate('/paytm/neworder')}/>
            <MainMenuItem icon={<img src={overviewIcon} className={`w-8`} />} selected={page === 'orders'} onClick={() => navigate('/paytm/orders')}/>
            <MainMenuItem icon={<img src={manageIcon} className={`w-8`} />} selected={page === 'settings'} onClick={() => navigate('/paytm/settings')}/>
            <MainMenuItem icon={<img src={headsetIcon} className={`w-8`} />} disabled/>
        </div>
    </div>
}