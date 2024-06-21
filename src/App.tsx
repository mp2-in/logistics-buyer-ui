import {
  Routes,
  Route,
} from "react-router-dom";

import './index.css'

import Login from "@pages/Login";


export default function App() {
  return <>
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  </>
}
