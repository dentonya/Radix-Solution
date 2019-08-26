import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import Spinner from "../layout/Spinner";

import { loadDepartments } from "../../actions/department";
import { loadSubDepartments } from "../../actions/subdepartment";
import { addEmployee } from "../../actions/employee";

const AddEmployee = ({
	loadDepartments,
	loadSubDepartments,
	addEmployee,
	auth,
	department: { loading, departments },
	subDepartment: { subDepartments }
}) => {
	const [formData, setFormData] = useState({
		subDepartmentArray: new Set(),
		departmentArray: new Set(),
		name: "",
		gender: ""
	});
	const { departmentArray, subDepartmentArray, name, gender } = formData;

	useEffect(() => {
		const { loading, isAdmin, user } = auth;
		if (!loading && user !== null) loadDepartments(isAdmin, user.permissions);
	}, [loadDepartments, auth]);

	useEffect(() => {
		if (departmentArray.size > 0) loadSubDepartments(null, [...departmentArray]);
	}, [departmentArray, loadSubDepartments]);

	const onChange = (e) => {
		e.preventDefault();
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const removeSetElement = (set, value) => {
		set.delete(value);
		return new Set([...set]);
	};

	const onSelectChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;

		e.preventDefault();
		setFormData({
			...formData,
			[name]: formData[name].has(value)
				? removeSetElement(formData[name], value)
				: new Set([...formData[name], value])
		});
	};

	const onSubmit = (e) => {
		e.preventDefault();
		addEmployee({
			...formData,
			departments: [...departmentArray],
			subDepartments: [...subDepartmentArray]
		});
	};

	if (loading) {
		return <Spinner />;
	} else {
		return (
			<form onSubmit={(e) => onSubmit(e)}>
				<div className="form-group row">
					<label htmlFor="employeeNameField" className="col-2 col-form-label">
						Name
					</label>
					<input
						className="custom-select col"
						id="employeeNameField"
						name="name"
						required
						placeholder="Enter name"
						multiple={true}
						value={name}
						onChange={(e) => onChange(e)}
					/>
				</div>

				<div className="form-group row">
					<label htmlFor="genderField" className="col-2 col-form-label">
						Gender
					</label>
					<select
						className="custom-select col"
						id="genderField"
						name="gender"
						required
						value={gender}
						onChange={(e) => onChange(e)}
					>
						<option value>Choose a gender</option>
						<option value="male">Male</option>
						<option value="female">Female</option>
					</select>
				</div>

				<div className="form-group row">
					<label htmlFor="departmentField" className="col-2 col-form-label">
						Department
					</label>
					<select
						className="custom-select col"
						id="departmentField"
						name="departmentArray"
						required
						multiple={true}
						value={[...departmentArray]}
						onChange={(e) => onSelectChange(e)}
					>
						{departments.map(({ label, _id }, index) => (
							<option value={_id} key={index}>
								{label}
							</option>
						))}
					</select>
				</div>

				<div className="form-group row">
					<label htmlFor="subDepartmentField" className="col-2 col-form-label">
						Subdepartment
					</label>
					<select
						className="custom-select col"
						id="subDepartmentField"
						name="subDepartmentArray"
						size="8"
						required
						multiple={true}
						value={[...subDepartmentArray]}
						onChange={(e) => onSelectChange(e)}
					>
						{subDepartments.map(({ label, _id }, index) => (
							<option value={_id} key={index}>
								{label}
							</option>
						))}
					</select>
				</div>

				<div className="row">
					{/* <div className="col" /> */}
					<input type="submit" value="Submit" className="btn btn-primary col ml-3" />
				</div>
			</form>
		);
	}
};

const mapStateToProps = (state) => {
	return {
		department: state.department,
		subDepartment: state.subdepartment,
		auth: state.auth
	};
};

export default connect(
	mapStateToProps,
	{ loadDepartments, loadSubDepartments, addEmployee }
)(AddEmployee);
