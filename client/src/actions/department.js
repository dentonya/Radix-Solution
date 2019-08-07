import axios from "axios";
import setAlert from "./alert";

import {
	GET_DEPARTMENT,
	GET_DEPARTMENTS,
	CLEAR_DEPARTMENT,
	GET_ALL_DEPARTMENTS
} from "./types";

// Load all the departments
export const loadAllDepartments = () => {
	return async (dispatch) => {
		try {
			const {
				data: { departments }
			} = await axios.get("/department");

			dispatch({ type: GET_ALL_DEPARTMENTS, payload: departments });
		} catch (error) {
			dispatch({ type: CLEAR_DEPARTMENT });
			dispatch(setAlert(error.response.data.message, "danger"));
		}
	};
};

// Load departments via permissions
export const loadDepartments = (permissions, allDepartments = []) => {
	return async (dispatch) => {
		try {
			let isAdmin = false;
			for (val in permissions) {
				if (val == "admin") isAdmin = true;
			}

			if (isAdmin) {
				dispatch({ type: GET_DEPARTMENTS, payload: allDepartments });
			} else {
				const {
					data: { departments }
				} = await axios.get("/department/many", { departmentNames: permissions });

				dispatch({ type: GET_DEPARTMENTS, payload: departments });
			}
		} catch (error) {
			dispatch({ type: CLEAR_DEPARTMENT });
			dispatch(setAlert(error.response.data.message, "danger"));
		}
	};
};

// Load department
export const loadDepartment = (department) => {
	return async (dispatch) => {
		try {
			dispatch({ type: GET_DEPARTMENT, payload: department });
		} catch (error) {
			dispatch({ type: CLEAR_DEPARTMENT });
			dispatch(setAlert(error.response.data.message, "danger"));
		}
	};
};

// Clear department
export const clearDepartment = () => {
	return async (dispatch) => {
		dispatch({ type: CLEAR_DEPARTMENT });
	};
};
