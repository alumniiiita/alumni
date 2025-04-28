import axios from "axios";
import { setAlert } from "./alert";
import { GET_STORIES, STORY_ERROR , UPDATE_LIKES} from "./types";

// Add story
export const addStory = (formData) => async (dispatch) => {
	try {
		await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/stories`, formData, {
			headers: { "Content-Type": "multipart/form-data" }
		});
		dispatch(setAlert("Story posted successfully", "success"));
	} catch (err) {
		dispatch({
			type: STORY_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};


// Get Stories (paginated)
export const getStories = (page = 1) => async (dispatch) => {
	try {
		const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stories?page=${page}`);
		dispatch({
			type: GET_STORIES,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: STORY_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

export const likeStory = (id) => async (dispatch) => {
	try {
		const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/stories/like/${id}`);
		dispatch({
			type: UPDATE_LIKES,
			payload: { id, likes: res.data },
		});
	} catch (err) {
		dispatch({
			type: STORY_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

export const unlikeStory = (id) => async (dispatch) => {
	try {
		const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/stories/unlike/${id}`);
		dispatch({
			type: UPDATE_LIKES,
			payload: { id, likes: res.data },
		});
	} catch (err) {
		dispatch({
			type: STORY_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};