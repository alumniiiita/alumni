import { GET_CONVERSATIONS, GET_MESSAGES, MESSAGE_SENT } from "../actions/types";

const initialState = {
	conversations: [],
	currentConversation: null,
	messages: [],
	loading: true,
	error: {},
};

export default function chatReducer(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case GET_CONVERSATIONS:
			return {
				...state,
				conversations: payload,
				loading: false,
			};
		case GET_MESSAGES:
			return {
				...state,
				messages: payload,
				loading: false,
			};
		case MESSAGE_SENT:
			return {
				...state,
				messages: [...state.messages, payload],
			};

		default:
			return state;
	}
}
