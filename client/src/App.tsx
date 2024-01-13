import Navbar from './components/Navbar'
import Arbitrage from './pages/arbitrage/Arbitrage'
import Calculator from './pages/calculator/Calculator'
import './App.css'
import { Route, Routes, BrowserRouter as Router } from "react-router-dom"

function App() {
    return (
        <>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/arbitrage" element={<Arbitrage />} />
                    <Route path="/calculator" element={<Calculator />} />
                </Routes>
            </Router>
        </>
    );
}

export default App
