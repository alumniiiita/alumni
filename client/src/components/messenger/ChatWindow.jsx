// src/components/messenger/ChatWindow.jsx

import React, { useEffect, useState, useRef,useCallback } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { socket } from '../../socket';



const ChatWindow = ({ auth: { authUser } }) => {
	const { id } = useParams(); // conversationId
	const [messages, setMessages] = useState([]);
	const [text, setText] = useState("");
	const [receiverId, setReceiverId] = useState(null);
	const scrollRef = useRef();
	const [isGroupChat, setIsGroupChat] = useState(false);



	//const isGroupChat = id.startsWith("group");
	
	  // 1) stable handler reference
  const handleReceive = useCallback(
    (data) => {
      if (data.conversationId === id) {
        setMessages((prev) => [
          ...prev,
          { sender: data.senderId, text: data.text },
        ]);
      }
      console.log("🔔 receiveMessage", data);
    },
    [id]
  );

  useEffect(() => {
    if (!authUser) return;

    // 2) ensure socket is connected
    socket.connect();

	socket.emit("addUser", authUser._id);


    socket.emit("joinGroup", id);

    // 3) fetch existing messages + receiver
    (async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/messages/${id}`
        );
        setMessages(res.data);
		const conv = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/conversations/${id}`);
		const conversation = conv.data;
  
		if (conversation.isGroup) {
		  setReceiverId(null);    // No receiver for group
		} else {
		  const other = conversation.members.find((m) => m._id !== authUser._id);
		  if (other) setReceiverId(other._id);
		}
  
		// 🔥 Here's the fixed line:
		setIsGroupChat(conversation.isGroup); 
      } catch (err) {
        console.error("Fetch error:", err);
      }
    })();

    // 4) hook up your listener
    socket.on("receiveMessage", handleReceive);

    return () => {
      // 5) clean up listener & leave room
      socket.off("receiveMessage", handleReceive);
      socket.emit("leaveGroup", id);
      // note: we do NOT disconnect here if you want the socket alive app-wide
    };
  }, [id, authUser?._id, isGroupChat, handleReceive]);



	const sendMessage = async (e) => {
        e.preventDefault();
        if (text.trim() === "") return;
    
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/messages/send`, {
                conversationId: id,
                text,
            });
            // console.log("🚀 Sending message:");
			// console.log("senderId:", authUser._id);
			// console.log("receiverId:", !isGroupChat ? receiverId : null);
			// console.log("conversationId:", id);
			// console.log("text:", text);
			console.log("isGroup:", isGroupChat);

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
            console.error("Error sending:", err.message);
        }
    };
    

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
			<div style={{ flex: 1, overflowY: "auto", padding: "1em" }}>
				{messages.map((msg, idx) => (
					<div
						key={idx}
						ref={scrollRef}
						style={{
							textAlign: msg.sender === authUser._id ? "right" : "left",
							marginBottom: "1em",
						}}
					>
						<div
							style={{
								display: "inline-block",
								padding: "10px 15px",
								backgroundColor: msg.sender === authUser._id ? "#DCF8C6" : "#F1F0F0",
								borderRadius: "20px",
								maxWidth: "60%",
								wordWrap: "break-word",
							}}
						>
							{msg.text}
						</div>
					</div>
				))}
			</div>

			<form onSubmit={sendMessage} style={{ display: "flex", borderTop: "1px solid lightgray" }}>
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
		</div>
	);
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(ChatWindow);
