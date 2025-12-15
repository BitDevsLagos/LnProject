import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Buffer } from "buffer";
import Home from "./pages/Home";
import Wallet from "./pages/Wallet";
import Remittance from "./pages/Remittance";
import Merchant from "./pages/Merchant";
import Layout from "./components/Layout";
import { BreezProvider } from "./context/BreezContext";
import './App.css'

window.Buffer = Buffer;

// Wrapper to apply Layout to all routes
const LayoutWrapper = () => (
  <Layout>
    <Outlet />
  </Layout>
);

function App() {

  return (
    <BreezProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<LayoutWrapper />}>
            <Route path="/" element={<Home />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/remittance" element={<Remittance />} />
            <Route path="/merchant" element={<Merchant />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </BreezProvider>
  )
}

export default App
