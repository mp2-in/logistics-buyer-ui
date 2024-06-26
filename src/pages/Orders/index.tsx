import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import OrderList from "./OrderList";
import TopBar from "./TopBar";
import AddOrder from "./AddOrder";

import { useAppConfigStore } from "stores/appConfig";
import { useOrdersStore } from "stores/orders";
import AccountDetails from "./AccountDetails";


export default () => {
    const [showAddOrder, setAddOrderDisplay] = useState(false)
    const [showAccountDetails, setAccountDetailsDisplay] = useState(false)

    const { token, accountId, clearAuth } = useAppConfigStore(state => ({ token: state.token, accountId: state.accountId, clearAuth: state.clearAuth }))
    const { getOrders, orders, googlePlacesApi, getPickupList,activity,pickupStores } = useOrdersStore(state => ({ orders: state.orders, 
        getOrders: state.getOrders, googlePlacesApi: state.googlePlacesApi, activity: state.activity, 
        getPickupList: state.getPickupList , pickupStores: state.pickupStores}))

    const navigate = useNavigate()

    useEffect(() => {
        if (token) {
            getOrders(token)
        } else {
            navigate('/login')
        }
    }, [])

    return <div>
        <TopBar accountId={accountId || ''} showAccountDetails={() => setAccountDetailsDisplay(true)}/>
        <OrderList onAddOrder={() => setAddOrderDisplay(true)} onRefresh={() => token ? getOrders(token) : null} orders={orders} />
        <AddOrder open={showAddOrder} onClose={() => setAddOrderDisplay(false)} onPlacesSearch={(searchText, callback) => {
            googlePlacesApi(searchText, callback)
        }} getPickupList={() => token?getPickupList(token):null} activity={activity} pickupStores={pickupStores}/>
        <AccountDetails open={showAccountDetails} onClose={() => setAccountDetailsDisplay(false)} accountId={accountId || ''} onLogout={() => clearAuth()} />
    </div>
}       