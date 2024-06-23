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
  }, [])

  return <>
    {checkStatus ? <Routes>
      <Route path="" element={<Navigate to={'/login'} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/u/" element={<RequireAuth loggedIn={loggedIn}><><Outlet /></></RequireAuth>}>
        <Route path="orders" element={<Orders />} />
      </Route>
    </Routes> : <ActivityIndicator />}
  </>
}
