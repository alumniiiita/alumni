import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_BACKEND_URL);

const ChatWindow = ({ auth: { authUser } }) => {
	const { id } = useParams(); // id = friendId or groupId
	const [messages, setMessages] = useState([]);
	const [text, setText] = useState("");
	const scrollRef = useRef();

	const isGroupChat = id.startsWith("group_"); // (💡 Your frontend logic can mark group IDs like this)

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/messages/${id}`);
				setMessages(res.data);
			} catch (err) {
				console.error(err.message);
			}
		};

		fetchMessages();

		// Join group room for real-time chat
		socket.emit("joinGroup", id);

		// Receive real-time messages
		socket.on("receiveMessage", (data) => {
			if (data.conversationId === id) {
				setMessages((prev) => [...prev, { sender: data.senderId, text: data.text }]);
			}
		});

		return () => {
			socket.off("receiveMessage");
		};
	}, [id]);

	const sendMessage = async (e) => {
		e.preventDefault();
		if (text.trim() === "") return;

		try {
			await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/messages/send`, {
				conversationId: id,
				text,
			});

			socket.emit("sendMessage", {
				senderId: authUser._id,       // 💥 Dynamic logged-in user
				receiverId: !isGroupChat ? id : null, // 💥 Only in one-to-one chat
				text,
				conversationId: id,
				isGroup: isGroupChat,
			});

			setMessages((prev) => [...prev, { sender: authUser._id, text }]);
			setText("");
		} catch (err) {
			console.error(err.message);
		}
	};

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
			{/* Message List */}
			<div style={{ flex: 1, overflowY: "auto", padding: "1em" }}>
				{messages.map((msg, index) => (
					<div
						key={index}
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

			{/* Message Input Box */}
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
