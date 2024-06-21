import {
  Routes,
  Route,
} from "react-router-dom";

import './index.css'

import Login from "@pages/Login";
import Orders from "@pages/Orders";


export default function App() {
  return <>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/orders" element={<Orders />} />
    </Routes>
  </>
}
