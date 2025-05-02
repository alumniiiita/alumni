import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { socket } from "../../socket";

const ChatWindow = ({ auth: { authUser } }) => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [receiverId, setReceiverId] = useState(null);
  const [chatTitle, setChatTitle] = useState(""); // ✅ Group name or friend name
  const [membersMap, setMembersMap] = useState({}); // ✅ UserId -> Name map
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [youBlocked, setYouBlocked] = useState(false);
    const [blockedBy, setBlockedBy] = useState(false);
  const scrollRef = useRef();

  const handleReceive = useCallback(
    (data) => {
      if (data.conversationId === id) {
        setMessages((prev) => [
          ...prev,
          { sender: data.senderId, text: data.text },
        ]);
      }
    },
    [id]
  );

  useEffect(() => {
    if (!authUser) return;

    socket.connect();
    socket.emit("addUser", authUser._id);
    socket.emit("joinGroup", id);

    (async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/messages/${id}`);
        setMessages(res.data);

        const conv = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/conversations/${id}`);
        const conversation = conv.data;

        setIsGroupChat(conversation.isGroup);
       setChatTitle(conversation.isGroup ? conversation.groupName : "");
       setYouBlocked(conversation.youBlocked);
       setBlockedBy(conversation.blockedBy);

        const userMap = {};
        conversation.members.forEach((m) => {
          userMap[m._id] = m.name;
        });
        setMembersMap(userMap);

        if (!conversation.isGroup) {
          const other = conversation.members.find((m) => m._id !== authUser._id);
          if (other) {
            setReceiverId(other._id);
            setChatTitle(other.name);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    })();

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.emit("leaveGroup", id);
    };
  }, [id, authUser?._id, handleReceive]);

  const sendMessage = async (e) => {
	e.preventDefault();
	if (text.trim() === "") return;
  
	try {
	  await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/messages/send`, {
		conversationId: id,
		text,
	  });
  
	  socket.emit("sendMessage", {
		senderId: authUser._id,
		receiverId: !isGroupChat ? receiverId : null,
		conversationId: id,
		text,
		isGroup: isGroupChat,
	  });
  
	  setMessages((prev) => [...prev, { sender: authUser._id, text }]);
	  setText("");
	} catch (err) {
	  if (err.response?.status === 403) {
		alert("🚫 You are blocked by this user. You can't send messages.");
	  } else {
		console.error("Error sending:", err.message);
	  }
	}
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#f4f4f4" }}>
      {/* Header */}
      <div style={{ padding: "1em", borderBottom: "1px solid lightgray", backgroundColor: "white", fontWeight: "bold", fontSize: "1.2rem", textAlign: "center" }}>
        {chatTitle || "Chat"}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1em" }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            ref={scrollRef}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: msg.sender === authUser._id ? "flex-end" : "flex-start",
              marginBottom: "1em",
            }}
          >
            {/* Sender Name */}
            <div style={{ fontSize: "0.8rem", color: "gray", marginBottom: "0.2em" }}>
              {msg.sender === authUser._id ? "You" : membersMap[msg.sender] || "Unknown"}
            </div>

            {/* Message Bubble */}
            <div
              style={{
                padding: "10px 15px",
                backgroundColor: msg.sender === authUser._id ? "#DCF8C6" : "#ffffff",
                borderRadius: "15px",
                maxWidth: "70%",
                wordWrap: "break-word",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
	  {youBlocked ? (
        <div style={{ padding: "1em", background: "#fff3cd", borderTop: "1px solid lightgray", color: "#856404", textAlign: "center" }}>
            You've blocked this user. Unblock them to send messages.
         </div>
       ) : blockedBy ? (
         <div style={{ padding: "1em", background: "#f8d7da", borderTop: "1px solid lightgray", color: "#721c24", textAlign: "center" }}>
          You have been blocked by this user. You cannot send messages.
         </div>
        ) : (
      <form onSubmit={sendMessage} style={{ display: "flex", borderTop: "1px solid lightgray", background: "white" }}>
           <input
            type="text"
           value={text}
           onChange={(e) => setText(e.target.value)}
             placeholder="Type your message..."
            style={{ flex: 1, padding: "1em", border: "none" }}
           />
           <button type="submit" className="btn btn-primary" style={{ borderRadius: "0" }}>
             Send
           </button>
         </form>
         )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ChatWindow);
