import menuIcon from "@assets/menu.png"
import accountIcon from "@assets/account.png"

export default ({ accountId, showAccountDetails, showWalletDashboard }: { accountId: string, showAccountDetails: () => void, showWalletDashboard: () => void }) => {
    return <div className={'flex justify-between items-center border-b border-gray-300 md:py-3 md:px-5 py-1 px-1'}>
        <div className={'flex items-center'}>
            <img src={menuIcon} className="w-9 mx-2 cursor-pointer" onClick={showWalletDashboard}/>
            <p className="font-semibold text-2xl hidden md:block">Orders</p>
        </div>
        <div className={'flex items-center cursor-pointer'} onClick={() => showAccountDetails()}>
            <img src={accountIcon} className="w-10 mr-1"/>
            <p className="font-semibold text-lg hidden md:block">{accountId}</p>
        </div>
    </div>
}