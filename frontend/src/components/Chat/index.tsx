import { ChangeEvent, useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { Container } from "./Chat.styled"
import StyledInputComponent from "../Input";
import { StyledButtonComponent } from "../Button";

interface Chat {
  myId: string
}

interface IMessage {
  senderId: string;
  content: string;
  timestamp: Date;
}

function Chat({ myId }: Chat) {
  const socket = useSocket();
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const [roomId, setRoomId] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');

  function handleChangeNewMessage(evt: ChangeEvent<HTMLInputElement>) {
    setNewMessage(evt.target.value);
  }

  function handleSendNewMessage(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    evt.preventDefault();
    socket.emit('sendMessage', roomId, newMessage, myId);
  }

  useEffect(() => {
    socket.on('newMessage', async (msg: string) => {
      const message: IMessage[] = JSON.parse(msg)
      setMessageList(message);
    })

    socket.on('roomCreated', async (msg: string) => {
      setRoomId(msg);
    })

    socket.on('participantJoined', async (participantId: string, roomId) => {
      setRoomId(roomId);
    })    
  }, [])

  return (
    <Container>
      <small>myId: {myId}</small>
      <small>roomId: {roomId}</small>
      <h1>Chat</h1>
      {messageList!.map(message => <p key={`${message.senderId}_${message.timestamp}`}>{message.content}</p>)}
      <StyledInputComponent type="text" onChange={(e) => handleChangeNewMessage(e)} />
      <StyledButtonComponent onClick={(e) => handleSendNewMessage(e)}>Enviar</StyledButtonComponent>
    </Container>
  )
}

export default Chat
