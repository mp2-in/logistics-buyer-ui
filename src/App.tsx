import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import './index.css'

import Login from "@pages/Login";
import Orders from "@pages/Orders";


export default function App() {
  return <>
    <Routes>
      <Route path="" element={<Navigate to={'/login'} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/orders" element={<Orders />} />
    </Routes>
  </>
}
