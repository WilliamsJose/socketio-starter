import { ChangeEvent, ReactNode, useState } from "react"
import { Button, Container } from "./Join.styled"
import StyledInputComponent from "../Input";
import { toast } from "react-toastify";
import { useSocket } from "../../context/SocketContext";

interface Join {
  setOnChat: React.Dispatch<React.SetStateAction<boolean>>;
  setMyId: React.Dispatch<React.SetStateAction<string>>;
  myId: string;
}

function Join({ setOnChat, setMyId, myId }: Join) {
  const [name, setName] = useState<string>('');
  const [room, setRoom] = useState<string>('');
  const socket = useSocket();

  function handleJoin() {
    if (!room || room.trim() === '') {
      toast('Please, enter room id first.');
      return;
    }
    if (!name || name.trim() === '') {
      toast('Please, enter your name first.');
      return;
    }
    setMyId(`${name}_${Date.now()}`)
    socket.emit('joinRoom', room, name, myId)
    setOnChat(true);
  }

  function handleCreate() {
    if (!name || name.trim() === '') {
      toast('Please, enter your name first.');
      return;
    }
    setMyId(`${name}_${Date.now()}`)
    socket.emit('createRoom', myId, name);
    setOnChat(true);
  }

  function handleNameChange(evt: ChangeEvent<HTMLInputElement>) {
    setName(evt.target.value);
  }

  function handleRoomChange(evt: ChangeEvent<HTMLInputElement>) {
    setRoom(evt.target.value);
  }

  return (
    <Container>
      <StyledInputComponent label="Seu nome:" id="name" type="text" onChange={(e) => handleNameChange(e)} />
      <Button onClick={handleCreate}>Criar sala</Button>
      <StyledInputComponent label="Id da sala:" id="room" type="text" onChange={(e) => handleRoomChange(e)} />
      <Button onClick={handleJoin}>Entrar</Button>
    </Container>
  )
}

export default Join
