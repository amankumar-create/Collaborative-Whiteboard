import { useState, useEffect } from "react";
import { IoIosChatboxes } from "react-icons/io";
import "../App.css";

export default function Chats({ socket, username, roomid }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  socket.on("message", (payload) => {
    console.log(payload.message);
    setMessages([...messages, payload]);
  });

  function handleSend() {
    if (message != "") {
      socket.emit("sendMessage", {
        message: message,
        room: roomid,
      });
      setMessage("");
    }
  }
  function handleChange(event) {
    setMessage(event.target.value);
  }

  return (
    <div>
      <div className={`Chatbox ${collapsed ? "collapsed" : ""}`}>
        <div className="Messages">
          {messages.map((msg, index) => (
            <div key={index} className={`Message ${msg.type}`}>
              {msg.type === "user_message" && (
                <div style={{ margin: "8px" }}>
                  <strong style={{ color: "#138D75" }}>{msg.sender}:</strong>{" "}
                  {msg.message}
                </div>
              )}
              {msg.type === "new_user" && (
                <div style={{ margin: "8px" }}>
                  <strong style={{ color: "green" }}>{msg.message}</strong>
                </div>
              )}
              {msg.type === "user_left" && (
                <div style={{ margin: "8px" }}>
                  <strong style={{ color: "#E74C3C" }}>{msg.message}</strong>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="InputContainer">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
      <button
        className="Toggle-Collapse Chat-Button"
        onClick={() => {
          setCollapsed(!collapsed);
          console.log(collapsed);
        }}
      >
        <IoIosChatboxes className="icon"/>
      </button>
    </div>
  );
}
