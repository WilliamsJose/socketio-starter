import { useState } from 'react'
import './App.css'
import Join from './components/Join';
import Chat from './components/Chat';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [onChat, setOnChat] = useState(false)

  return (
    <>
      {onChat ? <Chat /> : <Join setOnChat={setOnChat} />}
      <ToastContainer />
    </>
  )
}

export default App
