import { useState } from 'react'
import Arbitrage from './pages/arbitrage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Arbitrage />
    </>
  )
}

export default App
