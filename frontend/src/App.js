import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:2000");

function App() {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("recieve-message", (recievedMessage) =>
      addMessage(recievedMessage)
    );

    return () => {
      socket.off("connect");
      socket.off("recieve-message");
    };
  }, []);

  const handleSend = () => {
    addMessage(message);
    socket.emit("send-message", message, room);
  };

  const handleJoin = () => {
    socket.emit("join-room", room, (roomid) =>
      addMessage(`joined room  ${roomid}`)
    );
  };

  const addMessage = (message) => {
    setMessageList((prev) => [...prev, message]);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ diaply: "flex" }}>
        <input
          type="text"
          onChange={(e) => setMessage(e.currentTarget.value)}
          value={message}
        />
        <button onClick={handleSend}>send</button>
      </div>
      <div style={{ diaply: "flex" }}>
        <input
          type="text"
          onChange={(e) => setRoom(e.currentTarget.value)}
          value={room}
        />
        <button onClick={handleJoin}>join</button>
        {messageList.map((message) => (
          <p key={message}>{message}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
