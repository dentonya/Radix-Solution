import axios from "axios";
import setAlert from "./alert";
import setAuthToken from "../utils/setAuthToken";

import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGOUT
} from "./types";

// Load User
export const loadUser = () => {
	return async (dispatch) => {
		try {
			setAuthToken();
			const {
				data: { user }
			} = await axios.get("/auth");

			dispatch({
				type: USER_LOADED,
				payload: user
			});
		} catch (error) {
			dispatch({ type: AUTH_ERROR });
			dispatch(setAlert(error.response.data.message, "danger"));
		}
	};
};

export const login = (formData) => {
	return async (dispatch) => {
		try {
			const {
				data: { user, token }
			} = await axios.post("/auth", formData);

			dispatch({ type: LOGIN_SUCCESS, payload: { user, token } });
		} catch (error) {
			dispatch({ type: LOGIN_FAIL });
			dispatch(setAlert(error.response.data.message, "danger"));
		}
	};
};

export const logout = () => {
	return async (dispatch) => {
		dispatch({ type: LOGOUT, payload: { user, token } });
		dispatch(setAlert("You're logged out", "success"));
	};
};

export const register = (formData) => {
	return async (dispatch) => {
		try {
			const {
				data: { user, token }
			} = await axios.post("/auth/register", formData);

			dispatch({ type: REGISTER_SUCCESS, payload: { user, token } });
		} catch (error) {
			dispatch({ type: REGISTER_FAIL });
			dispatch(setAlert(error.response.data.message, "danger"));
		}
	};
};
