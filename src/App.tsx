import {
  Routes,
  Route,
  Navigate,
  Outlet
} from "react-router-dom";

import './index.css'

import Login from "@pages/Login";
import Orders from "@pages/Orders";
import { useAppConfigStore } from "stores/appConfig";
import { useEffect, useState } from "react";
import ActivityIndicator from "@components/ActivityIndicator";
import Toast from "@components/Toast";
import Wallet from "@pages/Wallet";
import Reports from "@pages/Reports";
import Issues from "@pages/Issues";
import RedirectOldLink from "@components/RedirectOldLink";
import OrderInfoPage from "@pages/Orders/OrderInfoPage";
import Manage from "@pages/Manage";
import IssueInfoPage from "@pages/Issues/IssueInfoPage";


const RequireAuth = ({ children, loggedIn }: { children: React.ReactNode, loggedIn: boolean }) => {
  return loggedIn ? children : <Navigate to={'/login'} />;
}

export default function App() {
  let { loggedIn, checkLoginStatus } = useAppConfigStore(state => ({ loggedIn: state.loggedIn, checkLoginStatus: state.checkLoginStatus }));
  const [checkStatus, setStatus] = useState(false)

  useEffect(() => {
    if (loggedIn) {
      setStatus(true)
    } else {
      checkLoginStatus(() => {
        setStatus(true)
      })
    }
  }, [loggedIn])

  return <>
    {checkStatus ? <Routes>
      <Route path="" element={<Navigate to={'/login'} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RequireAuth loggedIn={loggedIn}><><Outlet /></></RequireAuth>}>
        <Route path="order/:orderId" element={<OrderInfoPage />} />
        <Route path="orders/:orderId" element={<OrderInfoPage />} />
        <Route path="issue/:issueId" element={<IssueInfoPage />} />
        <Route path="issues/:issueId" element={<IssueInfoPage />} />
        <Route path="order" element={<OrderInfoPage />} />
        <Route path="orders" element={<Orders />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="reports" element={<Reports />} />
        <Route path="issues" element={<Issues />} />
        <Route path="manage" element={<Manage />} />
        <Route path="u/:component" element={<RedirectOldLink />} />
      </Route>
    </Routes> : <ActivityIndicator />}
    <Toast />
  </>
}
