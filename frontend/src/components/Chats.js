import { useState, useEffect } from "react";
import { IoIosChatboxes } from "react-icons/io";
import "../App.css";

export default function Chats({ socket, username, roomid }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([{message:"Welcome", type:"welcome"}]);
  const [collapsed, setCollapsed] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  socket.on("message", (payload) => {
    console.log(payload.senderId);
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
  const handleKeyUp = (event) => {
    if (isInputFocused && event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div>
      <div className={`Chatbox ${collapsed ? "collapsed" : ""}`}>
        <div className="Messages">
          {messages.map((msg, index) => (
            <div
              style={{
                display: "flex",
                justifyContent:
                  msg.type=="user_message"?
                  (socket.id == msg.senderId ? "flex-end" : "flex-start"):
                  "center"
                  ,
              }}
            >
              <div key={index} className={`message-container ${msg.type}`}>
                {msg.type === "user_message" && (
                  <div>
                    <div className="sender-name">{msg.sender}</div>{" "}
                    <div className="message-body">{msg.message}</div>
                  </div>
                )}
                {msg.type === "new_user" && (
                  <div>
                    <div className="message-body" style={{fontSize:"small"}}>{msg.message}</div>
                  </div>
                )}
                {msg.type === "user_left" && (
                  <div >
                    <div className="message-body" style={{fontSize:"small"}}>{msg.message}</div>
                  </div>
                )}
                {msg.type === "welcome" && (
                  <div >
                    <div className="message-body" style={{fontSize:"small"}}>{msg.message}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="InputContainer">
          <input
            type="text"
            value={message}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={handleKeyUp}
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
        <IoIosChatboxes className="icon" />
      </button>
    </div>
  );
}
