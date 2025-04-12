import axios from "axios";
import { setAlert } from "./alert";
import {
	GET_USER,
	USER_ERROR,
	CLEAR_USER,
	UPDATE_USER,
	ACCOUNT_DELETED,
	GET_USERS,
	GET_REPOS,
	GET_USERS_ERROR,
	MAKE_ADMIN,
	REMOVE_ADMIN,
	MAKE_ADMIN_ERROR,
	REMOVE_ADMIN_ERROR,
	BLOCK_USER,
	BLOCK_USER_ERROR,
	UNBLOCK_USER,
	UNBLOCK_USER_ERROR,
	FOLLOW_USER,
	UNFOLLOW_USER,
} from "./types";

export const getCurrentUserProfile = () => async (dispatch) => {
	try {
		const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/me`);
		dispatch({
			type: GET_USER,
			payload: res.data,
		});
	} catch (error) {
		dispatch({ type: CLEAR_USER });
		dispatch({
			type: USER_ERROR,
			payload: {
				msg: error.response.statusText,
				status: error.response.status,
			},
		});
	}
};

// Create/update profile
export const createProfile =
	(formInput, history, edit = false) =>
	async (dispatch) => {
		try {
			const config = {
				headers: {
					"Content-Type": "application/json",
				},
			};

			const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/profile`, formInput, config);
			// console.log("Update Res = ",res)
			dispatch({
				type: GET_USER,
				payload: res.data,
			});

			dispatch(
				setAlert(edit ? "Profile Updated" : "Profile created", "safe")
			);
			if (!edit) {
				setTimeout(() => {
					history.push("/userprofile");
				}, 1500);
			}
		} catch (err) {
			const errors = err.response.data.errors;
			if (errors) {
				errors.forEach((e) => {
					dispatch(setAlert(e.msg, "danger"));
				});
			}
			dispatch({
				type: USER_ERROR,
				payload: {
					msg: err.response.statusText,
					status: err.response.status,
				},
			});
		}
	};

// add experience

export const addExperience = (formInput, history) => async (dispatch) => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/users/experience`, formInput, config);
		dispatch({
			type: UPDATE_USER,
			payload: res.data,
		});
		dispatch(setAlert("Experience added", "safe"));
		setTimeout(() => {
			history.push("/userprofile");
		}, 1500);
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach((e) => {
				dispatch(setAlert(e.msg, "danger"));
			});
		}
		dispatch({
			type: USER_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};

// add education

export const addEducation = (formInput, history) => async (dispatch) => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/users/education`, formInput, config);
		dispatch({
			type: UPDATE_USER,
			payload: res.data,
		});
		dispatch(setAlert("Education added", "safe"));
		setTimeout(() => {
			history.push("/userprofile");
		}, 1500);
	} catch (err) {
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach((e) => {
				dispatch(setAlert(e.msg, "danger"));
			});
		}
		dispatch({
			type: USER_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};

// delete experience
export const deleteExperience = (id) => async (dispatch) => {
	try {
		const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/users/experience/${id}`);
		dispatch({
			type: UPDATE_USER,
			payload: res.data,
		});
		dispatch(setAlert("Experince Deleted", "safe"));
	} catch (err) {
		dispatch({
			type: USER_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};

// delete education
export const deleteEducation = (id) => async (dispatch) => {
	try {
		const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/users/education/${id}`);
		dispatch({
			type: UPDATE_USER,
			payload: res.data,
		});
		dispatch(setAlert("Education Deleted", "safe"));
	} catch (err) {
		dispatch({
			type: USER_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};

// delete account and profile
export const deleteAccount = () => async (dispatch) => {
	if (window.confirm("Are you sure? This can NOT be undone!")) {
		try {
			await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/users`);
			dispatch({ type: CLEAR_USER });
			dispatch({ type: ACCOUNT_DELETED });
			dispatch(setAlert("Account Deleted", "safe"));
		} catch (err) {
			dispatch({
				type: USER_ERROR,
				payload: {
					msg: err.response.statusText,
					status: err.response.status,
				},
			});
		}
	}
};

// get User by id
export const getUserById = (userId) => async (dispatch) => {
	try {
		const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`);
		dispatch({
			type: GET_USER,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: USER_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};

// get all users
export const getUsers = (searchTerm) => async (dispatch) => {
	dispatch({ type: CLEAR_USER });
	try {
		if (searchTerm === "") {
			searchTerm = "all";
		}
		const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/search/${searchTerm}`);
		dispatch({
			type: GET_USERS,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: GET_USERS_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};

export const getGithubRepos = (username) => async (dispatch) => {
	try {
		const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/github/${username}`);
		dispatch({
			type: GET_REPOS,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: USER_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};

export const makeAdmin = (user_id) => async (dispatch) => {
	try {
		const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/${user_id}/make-admin`);
		dispatch({
			type: MAKE_ADMIN,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: MAKE_ADMIN_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};

export const removeAdmin = (user_id) => async (dispatch) => {
	try {
		const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/${user_id}/remove-admin`);
		dispatch({
			type: REMOVE_ADMIN,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: REMOVE_ADMIN_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};

export const blockUser = (user_id) => async (dispatch) => {
	try {
		const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/${user_id}/block`);
		dispatch({
			type: BLOCK_USER,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: BLOCK_USER_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};

export const unblockUser = (user_id) => async (dispatch) => {
	try {
		const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/${user_id}/unblock`);
		dispatch({
			type: UNBLOCK_USER,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: UNBLOCK_USER_ERROR,
			payload: {
				msg: err.response.statusText,
				status: err.response.status,
			},
		});
	}
};

export const followUser = (user_id) => async (dispatch) => {
	try {
		// console.log("inside actions file");
		const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/users/${user_id}/follow`);
		dispatch({
			type: FOLLOW_USER,
			payload: res.data,
		});
	} catch (err) {
		console.log(err);
	}
};

export const unFollowUser = (user_id) => async (dispatch) => {
	try {
		const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/users/${user_id}/unfollow`);
		dispatch({
			type: UNFOLLOW_USER,
			payload: res.data,
		});
	} catch (err) {
		console.log(err);
	}
};

export const getUsersByType = (user_type) => async (dispatch) => {
	try {
		const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/type/${user_type}`);
		return res.data;
	} catch (err) {
		console.log(err);
	}
};
