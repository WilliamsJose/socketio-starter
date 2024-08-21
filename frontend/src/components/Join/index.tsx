import { ChangeEvent, useState } from "react"
import { Button, Container } from "./Join.styled"
import StyledInputComponent from "../Input";
import { toast } from "react-toastify";
import { useSocket } from "../../context/SocketContext";

function Join({ setOnChat }: { setOnChat: React.Dispatch<React.SetStateAction<boolean>>}) {
  const [name, setName] = useState<string>('');
  const [room, setRoom] = useState<string>('');
  const socket = useSocket();

  function handleJoin() {
    console.log(name);
    setOnChat(true);
  }

  function handleCreate() {
    if (!name || name.trim() === '') {
      toast('Please, enter your name first.');
      return;
    }
    socket.emit('createRoom', `${name}_id`, name)
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
