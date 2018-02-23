import React, { Component } from 'react';
import PropTypes from "prop-types";
import {customFieldsHelper} from "../../utils/helpers";
import {connect} from "react-redux";
import Select from 'react-select';
import DatePicker from '../../components/UI/DatePicker';
import {actionCreators} from "../../actions";

let _ = require('lodash');

class NewOpportunityForm extends Component {
    constructor(props) {
        super(props);

        this._handleInputChange = this._handleInputChange.bind(this);
        this._setCompany = this._setCompany.bind(this);

        this.state = {
            formState: props.opportunity
        }
    }

    _handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;
        let oppState = this.props.opportunity;

        // Special handling for custom field state
        if (/custom_fields\./.test(name)) {
            let customField = this.props.customFields[_.split(name, '.')[1]];
            let oppCustomFieldIndex = _.findIndex(oppState.custom_fields, (o) => o.custom_field_id === customField.field_id);

            if (oppCustomFieldIndex >= 0) {
                oppState.custom_fields[oppCustomFieldIndex].value = value;
            } else {
                if (typeof oppState.custom_fields !== 'object') {
                    oppState.custom_fields = [];
                }

                oppState.custom_fields.push({
                    custom_field_id: customField.field_id,
                    value: value
                });
            }
        } else {
            _.set(oppState, name, value);
        }

        this.setState({
            formState: oppState
        });

        this.props.setFormState(oppState)
    }

    _setCompany(value) {
        let selectedId = value ? value.value : null;
        let selectedName = value ? value.label : null;

        let event = {
            target: {
                type: 'select',
                name: 'company',
                value: {
                    id: selectedId,
                    name: selectedName
                }
            }
        };

        this._handleInputChange(event);
    }

    _searchCompanies(input, callback) {
        let search = '';

        if (input && input.length > 0) {
            search = {
                name: input
            }
        }

        return actionCreators.searchAccounts(search)
            .then((companies) => {
                let options = companies.map((company) => {
                    return {
                        value: company.id,
                        label: company.name
                    }
                });

                callback(null, {options: options})

                return {options: options};
            });
    }

    render() {
        let customFields = customFieldsHelper(this.state.formState, this.props.customFields, this._handleInputChange);
        let stageOptions = this.props.stages.map((stage) => {
            return {
                value: stage.id,
                label: stage.title
            }
        });

        let teamMembers = _.map(this.props.user.team.users, (member, index) => {
            return {
                value: member.id,
                label: member.name
            }
        });

        teamMembers.unshift({value:null, label: "Please select..."});

        return (
            <form id="opportunity-details-form">
                <div className="panel-opportunity-details-column">
                    <div className="input-container">
                        <label>Assignee</label>
                        <Select
                            value={this.props.opportunity.user_id}
                            onChange={(input) => {
                                let selected = input ? input.value : null;

                                let event = {
                                    target: {
                                        type: 'select',
                                        name: 'user_id',
                                        value: selected
                                    }
                                };

                                return this._handleInputChange(event);
                            }}
                            options={teamMembers}
                        />
                    </div>
                    <div className="input-container">
                        <label>Deal name</label>
                        <input type="text" name="name" placeholder="Name" onChange={this._handleInputChange} />
                    </div>
                    <div className="input-container">
                        <label>Amount</label>
                        <input type="text" name="amount" placeholder="Amount" onChange={this._handleInputChange} />
                    </div>
                    <div className="input-container">
                        <label>Probability</label>
                        <input type="text" name="probability" placeholder="Probability" onChange={this._handleInputChange} />
                    </div>
                    <div className="input-container">
                        <label>Expected Close</label>
                        <DatePicker name="expected_close" onChange={this._handleInputChange} />
                    </div>
                    <div className="input-container">
                        <label>Stage</label>
                        <Select
                            name="stage_id"
                            value={this.props.opportunity.stage_id}
                            onChange={(input) => {
                                let selected = input ? input.value : null;

                                let event = {
                                    target: {
                                        type: 'select',
                                        name: "stage_id",
                                        value: selected
                                    }
                                };

                                return this._handleInputChange(event);
                            }}
                            options={stageOptions}
                        />
                    </div>

                    <div className="input-container">
                        <label>Company</label>
                        <Select.Async
                            multi={false}
                            value={this.state.formState.company ? {value: this.state.formState.company.id, label: this.state.formState.company.name} : null}
                            onChange={this._setCompany}
                            filterOptions={(options) => options}
                            loadOptions={this._searchCompanies} />
                    </div>

                </div>
                <div className="panel-opportunity-details-column">
                    {customFields}
                </div>
            </form>
        )
    }
}

NewOpportunityForm.propTypes = {
    opportunity: PropTypes.object.isRequired,
    setFormState: PropTypes.func.isRequired,
    dataUpdated: PropTypes.bool.isRequired,
    customFields: PropTypes.object.isRequired,
    stages: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired
}

export default connect((store) => {
    return {
        opportunity: store.opportunityFlyoutState.data,
        dataUpdated: store.opportunityFlyoutState.dataUpdated,
        customFields: store.customFieldsState.opportunityFields,
        stages: store.stageState.data,
        user: store.authState.user
    }
})(NewOpportunityForm);