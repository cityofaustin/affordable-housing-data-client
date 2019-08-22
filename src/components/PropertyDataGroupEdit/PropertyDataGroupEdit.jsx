// react
import React, { Component } from 'react';
// css
import './PropertyDataGroupEdit.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// components
import {UnitInformation} from '../UnitInformation/UnitInformation.jsx';
// libs
import _ from 'underscore';
import moment from 'moment';
// DatePicker
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class PropertyDataGroupEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			groupName: props.name,
			data: props.data,
			showGroup:  false,
			propertyId: props.propertyId,
			startDate: props.propertyValue.affordability_start,
			ExpireDate: props.propertyValue.affordability_expiration
		}
		//console.log(this.state.startDate);
		return;
	}

/*
	focousOut(value) {
		if(!moment(value).isValid()) {
	 		this.setState({selectedValue: moment()});
		}
	}*/

	handleInfoClick(field) {
		var data = this.state.data;
		var fieldData = data[field];
		var description = fieldData.description;
		alert(description);
		return;
	}

	handleSortRightClick() {
		var showGroup = this.state.showGroup;
		this.setState({showGroup: !showGroup});
		return;
	}

	onInputChange(field, e) {
		var updateData = {
			field: field,
			value: e.target.value,
			// verify: null
		}
		console.log(updateData);
		this.props.handleUpdateData(updateData);
		this.props.data[field].value = e.target.value;

		this.setVerifyFalse(field);
	}
	
	handleStartDateChange(field,e) {
		//console.log(e); //Tue Apr 02 2019 00:00:00 GMT-8500 (Central Daylight Time)
		/*
	  function dateConvert(dateobj) {
		var year = dateobj.getFullYear();
		var month = ("0" + (dateobj.getMonth()+1)).slice(-2);
		var date = ("0" + dateobj.getDate()).slice(-2);
		var hours = "00:00:00";
		var converted_date = year + "-" + month + "-" + date + " " + hours;
		return converted_date;
	}
		const newDate = dateConvert(e);	*/
		const newDate = (moment(e).isValid()) ? moment(e).format('YYYY-MM-DD') : "";	
		this.setState({
			startDate: e
		});
		var updateData = {
			field: field,
			value: newDate
		}
		this.props.handleUpdateData(updateData);
		this.setVerifyFalse(field);
	}	

	handleExpireDateChange(field,e) {/*
	  function dateConvert(dateobj) {
		var year = dateobj.getFullYear();
		var month = ("0" + (dateobj.getMonth()+1)).slice(-2);
		var date = ("0" + dateobj.getDate()).slice(-2);
		var hours = "00:00:00";
		var converted_date = year + "-" + month + "-" + date + " " + hours;
		return converted_date;
	}
		const newDate = dateConvert(e);	*/
		const newDate = (moment(e).isValid()) ? moment(e).format('YYYY-MM-DD') : "";	
		this.setState({
			ExpireDate: e
		});
		var updateData = {
			field: field,
			value: newDate
		}
		this.props.handleUpdateData(updateData);
		this.setVerifyFalse(field);
	}

	setVerifyFalse(field) {
		var id = field + '-verify-btn';
		var elem = document.getElementById(id);
		elem.innerText = 'VERIFY'
		elem.classList.remove('verified-btn');
		elem.classList.add('verify-btn');
		this.props.updatePropertyThis.state.updatedData[field].verify = false;
		this.props.updateVerifications(field, 0);
	}

	onRadioChange(field, val, e) {
		var updateData = {
			field: field,
			value: val
		}
		this.props.handleUpdateData(updateData);
		this.props.data[field].value = val;

		this.setVerifyFalse(field);
	}

	handleClickVerify(field, e, forceValue=null) {
		var updatedData = this.props.updatePropertyThis.state.updatedData;
		if (!_.has(updatedData, field)) {
			this.props.updatePropertyThis.state.updatedData[field] = {};
		}

		var verifyVal;
		if (!_.isNull(forceValue)) {
			// set to the opposite here so that it is set to the correct value below
			verifyVal = !forceValue;
		} else {
			verifyVal = this.props.updatePropertyThis.state.updatedData[field].verify;

			if (_.isUndefined(verifyVal)) {
				var verifications = this.props.verifications;
				if (_.has(verifications, field)) {
					verifyVal = verifications[field].verified;
				}
			}
		}


		if (verifyVal === true) {
			// make not verified
			this.props.updatePropertyThis.state.updatedData[field].verify = false;
			e.target.innerText = 'Verify'
			e.target.classList.remove('verified-btn');
			e.target.classList.add('verify-btn');

			this.props.updateVerifications(field, 0);
		} else {
			// make verified
			this.props.updatePropertyThis.state.updatedData[field].verify = true;
			e.target.innerText = 'Verified'
			e.target.classList.remove('verify-btn');
			e.target.classList.add('verified-btn');

			//TODO: you need to find a way to update the verifications object so when you close / open, the value still exists
			this.props.updateVerifications(field, 1);
		}

		//console.log(this.props.updatePropertyThis.state.updatedData);
	}

	renderGroupEdit() {
		var data = this.state.data;
		var group = [];
		function isTypeText(dataType) {
			if (dataType.match(/^varchar.*/)) {
				return true;
			} else {
				return false;
			}
		}

		function isTypeNum(dataType) {
			if ((dataType.match(/^int.*/))||(dataType.match(/^decimal.*/))) {
				return true;
			} else {
				return false;
			}
		}

		function isTypeBool(dataType) {
			if (dataType.match(/^tinyint.*/)) {
				return true;
			} else {
				return false;
			}
		}

		function isTypeDate(dataType) {
			if (dataType.match(/^datetime.*/)) {
				return true;
			} else {
				return false;
			}
		}

		var isVerified = (field) => {
			var verifications = this.props.verifications;
			if (verifications) {
				if (_.has(verifications, field) && verifications[field].verified === 1) {
					return true;
				}
			}
			return false;
		}

		var getVerifiedInfo = (field) => {

			var elem1 = <span></span>;
			var elem2 = <span></span>;
			var verifications = this.props.verifications;
			if (verifications && _.has(verifications, field)) {
				if (verifications[field].lastUpdated) {
					elem1 = <span>{'updated/verified on '}<b>{moment((verifications[field].lastUpdated)).format('YYYY-MM-DD h:mma')}</b></span>
				}
				if (verifications[field].updateUserEmail) {
					elem2 = <span>{'by '}<b>{verifications[field].updateUserEmail}</b></span>
				}
			}
			return <p>{elem1} {elem2}</p>
		}

		var getInput = (field, dataType, value, isEditable) => {
			if ((localStorage.getItem('is_admin')=== '2') && (this.state.groupName !== 'Contact Information')){
				isEditable=false;
			};
			if (isTypeText(dataType) || isTypeNum(dataType)) {
				return (
					<div className='form-group'>
					{field === 'unit_type' && 
					<span><p>Current Unit Type: <b>"{(value || value === 0) ? value : ''}"</b></p>
						<select size="1" readOnly={!isEditable} className='form-control text-or-num-input' id={field} defaultValue={(value || value === 0) ? value : ''} onChange={this.onInputChange.bind(this, field)}>
							<option value="" disabled={!isEditable}></option>
							<option value="ADU" disabled={!isEditable}>ADU</option>
							<option value="Single Family" disabled={!isEditable}>Single Family</option>
							<option value="Duplex" disabled={!isEditable}>Duplex</option>
							<option value="Fourplex" disabled={!isEditable}>Fourplex</option>
							<option value="Multifamily" disabled={!isEditable}>Multifamily</option>
						</select></span>
					}
					{field !== 'unit_type' && 
						<input type={isTypeText(dataType) ? 'text' : 'number'} readOnly={!isEditable} className='form-control text-or-num-input' id={field} defaultValue={(value || value === 0) ? value : ''} onChange={this.onInputChange.bind(this, field)} />
					}
					{ (field !== 'id' && isEditable) &&
						/* exclude verify button from id */
						<span>
							<button id={field + '-verify-btn'} onClick={this.handleClickVerify.bind(this, field)} className={'btn ' + (isVerified(field) ? 'btn-success verified-btn' : 'btn-danger verify-btn')}>{isVerified(field) ? 'Verified' : 'Verify'}</button>
							<span style={{'marginLeft': '20px'}}>{getVerifiedInfo(field)}</span>
						</span>
					}
					</div>
				);
			} else if (isTypeBool(dataType)) {
				return (
					<span>
						<div className='form-check form-check-inline'>
							<label className='form-check-label' htmlFor={field + '_yes'}>
								<input id={field + '_yes'} className='form-check-input' disabled={!isEditable} readOnly={!isEditable} name={field} type='radio' defaultChecked={value === 1 ? true : false} onClick={this.onRadioChange.bind(this, field, true)} />yes
							</label>
						</div>
						<div className='form-check form-check-inline'>
							<label className='form-check-label' htmlFor={field + '_no'}>
								<input id={field + '_no'} className='form-check-input' disabled={!isEditable}   readOnly={!isEditable} name={field} type='radio' defaultChecked={value === 0 ? true : false} onClick={this.onRadioChange.bind(this, field, false)}/>no
							</label>
						</div>
						<div className='form-check form-check-inline'>
							<label className='form-check-label' htmlFor={field + '_null'}>
								<input id={field + '_null'} className='form-check-input' disabled={!isEditable}  readOnly={!isEditable} name={field} type='radio' defaultChecked={(value !== 0 && value !== 1) ? true : false} onClick={this.onRadioChange.bind(this, field, null)}/>unknown
							</label>
						</div>
						{ (isEditable) &&
						<div className='form-check form-check-inline'>
							<button id={field + '-verify-btn'} onClick={this.handleClickVerify.bind(this, field)} className={'btn ' + (isVerified(field) ? 'btn-success verified-btn' : 'btn-danger verify-btn')}>{isVerified(field) ? 'Verified' : 'Verify'}</button>
						</div>
						}
						<div>
							<span style={{'marginLeft': '20px'}}>{getVerifiedInfo(field)}</span>
						</div>
					</span>
				);
			}  else if (isTypeDate(dataType)) {
				//related dates
				const today = new Date();
				const sDate = new Date(this.state.startDate);
				const eDate = new Date(this.state.ExpireDate);
				//selected date value
				const minDate = (moment(this.state.startDate).isValid()) ? sDate : today;	
				const maxDate = (moment(this.state.ExpireDate).isValid()) ? eDate : today;	
				return (
					<div className='form-group'>
					{field === 'affordability_start' && 
						<DatePicker value={moment(this.state.startDate).isValid() ? moment(this.state.startDate).format('YYYY-MM-DD') : ""} 
						selected={minDate} 
						onChange={this.handleStartDateChange.bind(this,field)}
						className="form-control"
						dateFormat="yyyy-MM-dd" 
						isClearable={isEditable} 
						showYearDropdown 
						scrollableYearDropdown
						yearDropdownItemNumber={15}
						disabled={!isEditable} />
					}
					{field === 'affordability_expiration' &&
						<DatePicker  value={moment(this.state.ExpireDate).isValid() ? moment(this.state.ExpireDate).format('YYYY-MM-DD') : ""} 
						selected={maxDate} 
						minDate={minDate} 
						className="form-control"
						onChange={this.handleExpireDateChange.bind(this,field)} dateFormat="yyyy-MM-dd" 
						isClearable={isEditable} 
						showYearDropdown
						yearDropdownItemNumber={15}
						disabled={!isEditable} />
					}
					{ (field !== 'id' && isEditable) &&
						/* exclude verify button from id */
						<span>
							<button id={field + '-verify-btn'} onClick={this.handleClickVerify.bind(this, field)} className={'btn ' + (isVerified(field) ? 'btn-success verified-btn' : 'btn-danger verify-btn')}>{isVerified(field) ? 'Verified' : 'Verify'}</button>
							
								<span style={{'marginLeft': '20px'}}>{getVerifiedInfo(field)}</span>

						</span>
					}
					</div>
				);
			} else if (dataType.match(/.*enum.*/)) {

				// parse options from enum cases
				var indices = [];
				for (var d in dataType) {
					if (dataType[d] === '\'') {
						indices.push(parseInt(d));
					}
				}
				var values = [];
				for (var i in indices) {
					if (i % 2 === 0) {
						var start = indices[i] + 1;
						var endIndex = parseInt(i) + 1;
						var end = indices[endIndex];
						var enumValue = dataType.substring(start, end);
						values.push(enumValue)
					}
				}

				values.push('unknown');

				var elements = [];
				for (var v of values) {
					if (v === 'unknown') {
						var elem = (
							<span key={field + '_' + v}>
								<div className='form-check form-check-inline'>
									<label className='form-check-label' htmlFor={field + '_' + v}>
										<input id={field + '_' + v} className='form-check-input' disabled={!isEditable}   readOnly={!isEditable} name={field} type='radio' defaultChecked={value == null ? true : false} onClick={this.onRadioChange.bind(this, field, null)} />{v}
									</label>
								</div>
							</span>
						);
					} else {
						elem = (
							<span key={field + '_' + v}>
								<div className='form-check form-check-inline'>
									<label className='form-check-label' htmlFor={field + '_' + v}>
										<input id={field + '_' + v} className='form-check-input' disabled={!isEditable}  readOnly={!isEditable} name={field} type='radio' defaultChecked={(v === value) ? true : false} onClick={this.onRadioChange.bind(this, field, v)} />{v}
									</label>
								</div>
							</span>
						);
					}
					elements.push(elem);
				}
				if (isEditable) {
				elements.push(
					<span key={field + '_verify_btn'}>
						<div className='form-check form-check-inline'>
							<button id={field + '-verify-btn'} onClick={this.handleClickVerify.bind(this, field)} className={'btn ' + (isVerified(field) ? 'btn-success verified-btn' : 'btn-danger verify-btn')}>{isVerified(field) ? 'Verified' : 'Verify'}</button>
							<span style={{'marginLeft': '20px'}}>{getVerifiedInfo(field)}</span>
						</div>
					</span>
				);
				}
				return elements;

			} else {
				return (<div>ERROR</div>);
			}
		}

		for (var d in data) {
			group.push(
				<div className='property-group-input-container' key={d}>
					<span><b>{data[d].name}: </b><img onClick={ this.handleInfoClick.bind(this, d) } className='info-img' alt="info" src='/img/info.png'/></span>
					<br/>
					<div className='property-group-input'>
						{getInput(d, data[d].dataType, data[d].value, data[d].editable)}
					</div>
				</div>
			);
		}
		return group;
	}

	render() {
		return (
			<div className='property-group'>
				<span>
					<img alt="img-sort" onClick={this.handleSortRightClick.bind(this)} className='dropdown-triangle' src={this.state.showGroup ? '/img/sort-down.png' : '/img/sort-right.png'}/>
					<u>{this.state.groupName}</u>
				</span>
			{ this.state.showGroup && this.state.groupName !== 'Unit Information' &&
				<div className='property-group-inputs'>
					{this.renderGroupEdit()}
				</div>
			}
			{ this.state.showGroup && this.state.groupName === 'Unit Information' &&
				<div>
					<UnitInformation updatePropertyThis={this.props.updatePropertyThis} />
				</div>
			}
			</div>
		);
	}
}

export {PropertyDataGroupEdit};
