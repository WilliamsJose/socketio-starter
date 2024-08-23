import { useState } from 'react'
import './App.css'
import Join from './components/Join';
import Chat from './components/Chat';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [onChat, setOnChat] = useState<boolean>(false);
  const [myId, setMyId] = useState<string>('');

  return (
    <>
      {onChat ? <Chat myId={myId} /> : <Join myId={myId} setOnChat={setOnChat} setMyId={setMyId} />}
      <ToastContainer />
    </>
  )
}

export default App
