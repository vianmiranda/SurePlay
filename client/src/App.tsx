import { useState } from 'react'
import Arbitrage from './pages/arbitrage/arbitrage'
import Calculator from './pages/calculator/calculator'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Arbitrage /> */}
      <Calculator />
    </>
  )
}

export default App
