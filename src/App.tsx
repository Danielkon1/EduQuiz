import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <p>select option</p>
      <button><a href='/user'>click me</a></button>
    </>
  )
}

export default App
