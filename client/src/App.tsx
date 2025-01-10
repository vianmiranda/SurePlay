import Navbar from './components/Navbar'
import Arbitrage from './pages/arbitrage/Arbitrage'
import Calculator from './pages/calculator/Calculator'
import './App.css'
import { Route, Routes, BrowserRouter as Router, Navigate } from "react-router-dom"

/**
 * Main function for App. Constructs the navbar and routes.
 * Consists of Arbitrage and Calculator pages.
 * 
 * @returns Application component.
 */
function App() {
    return (
        <>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Navigate to="/arbitrage" replace />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                    <Route path="/arbitrage" element={<Arbitrage />} />

                    <Route path="/calculator" element={<Calculator />} />
                </Routes>
            </Router>
        </>
    );
}

export default App
