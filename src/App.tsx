import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation
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
import PaytmHome from "@pages/Paytm/Home";

const RequireAuth = ({ children, loggedIn, setRedirectPath }: { children: React.ReactNode, loggedIn: boolean, setRedirectPath: (path: string) => void }) => {
  if (loggedIn) {
    return children
  } else {
    const loc = useLocation()
    setRedirectPath(loc.pathname)
    return <Navigate to={'/login'} />
  }
}

export default function App() {
  let { loggedIn, checkLoginStatus, setRedirectPath } = useAppConfigStore(state => ({ loggedIn: state.loggedIn, checkLoginStatus: state.checkLoginStatus, setRedirectPath: state.setRedirectPath }));
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
      <Route path="/" element={<RequireAuth loggedIn={loggedIn} setRedirectPath={path => setRedirectPath(path)}><><Outlet /></></RequireAuth>}>
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
        <Route path="paytm/home" element={<PaytmHome />} />
        <Route path="u/:component" element={<RedirectOldLink />} />
      </Route>
    </Routes> : <ActivityIndicator />}
    <Toast />
  </>
}
