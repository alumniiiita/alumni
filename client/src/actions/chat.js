import axios from "axios";
import {
	GET_CONVERSATIONS,
	GET_MESSAGES,
	MESSAGE_SENT,
} from "../actions/types";

export const getConversations = (user) => async (dispatch) => {
	if(user){
		try {
			const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/conversations/${user._id}`);
			dispatch({
				type: GET_CONVERSATIONS,
				payload: res.data,
			});
		} catch (err) {
			console.log(err);
		}
	}
};

export const getMessages = (currentChat) => async (dispatch) => {
	try {
		if (currentChat) {
			const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/messages/${currentChat._id}`);
			dispatch({
				type: GET_MESSAGES,
				payload: res.data,
			});
		}
	} catch (err) {
		console.log(err);
	}
};

export const sendMessage = (message) => async (dispatch) => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};
		const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/messages/`, message, config);
		dispatch({
			type: MESSAGE_SENT,
			payload: res.data,
		});
	} catch (err) {
		console.log(err);
	}
};

export const getOnlineUserData = (users_ids) => async (dispatch) => {
	try{

	}
	catch(err){

	}
}