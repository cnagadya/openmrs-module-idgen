/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';
import ReactTable from 'react-table';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-table/react-table.css';
import {FaSearch} from 'react-icons/lib/fa';
import {Input} from 'reactstrap';
import apiCall from '../../utilities/apiHelper';

export default class LogEntries extends React.Component {
    constructor() {
        super();
        this.state = {
            logEntries: [],
            isHidden: true,
            filteredLogEntries: '',
            startDate: '',
            endDate: '',
            searchFilters: {
                identifier: '',
                comment: ''
            }
        };
        this.getLogEntries = this.getLogEntries.bind(this);
        this.advancedSearch = this.advancedSearch.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChangeStart = this.handleChangeStart.bind(this);
        this.handleChangeEnd = this.handleChangeEnd.bind(this);
    }
    getLogEntries() {
        apiCall(null, 'get', '/idgen/logentry?v=full&identifier=&comment=&source&generatedBy=&dateGenerated=').then((response) => {
            this.setState({logEntries: response.results});
        });
    }
    advancedSearchView() {
        this.setState({
            isHidden: !this.state.isHidden
        })
    }

    advancedSearch() {
        const {identifier, comment} = this.state.searchFilters;
        // const comment= this.state.searchFilters.comment;
        console.log(identifier, this.state.searchFilters, this.state.startDate);
        apiCall(null, 'get', `/idgen/logentry?v=full&identifier=${identifier}&comment=${comment}&source&generatedBy=`).then((response) => {
            this.setState({logEntries: response.results});
            console.log("Clicked Search Button", response);
        });
        this.setState({
            isHidden: !this.state.isHidden
        })
    }

    handleSearch(event) {
        const {name, value} = event.target;
        this.setState({
            searchFilters: Object.assign({}, this.state.searchFilters, {[name]: value})
        }, () => {
            console.log("search", this.state.searchFilters)
        });
    }
    handleChangeStart(date) {
        this.setState({startDate: date});
    }
    handleChangeEnd(date) {
        this.setState({endDate: date});
    }
    componentDidMount() {
        this.getLogEntries();
    }
    render() {
        let logEntries = this.state.logEntries
        if (this.state.filteredLogEntries) {
            logEntries = logEntries.filter(LogEntry => {
                let formattedDate = moment(LogEntry.dateGenerated).format('DD/MM/YYYY')
                return LogEntry
                    .source
                    .toLowerCase()
                    .includes(this.state.filteredLogEntries.toLowerCase()) || LogEntry
                    .identifier
                    .toLowerCase()
                    .includes(this.state.filteredLogEntries.toLowerCase()) || LogEntry
                    .comment
                    .toLowerCase()
                    .includes(this.state.filteredLogEntries.toLowerCase()) || formattedDate.includes(this.state.filteredLogEntries) || (LogEntry.generatedBy.username.toLowerCase()).includes(this.state.filteredLogEntries.toLowerCase())
            })
        }
        return (
            <div className="logwrapper">
                <div className="search_label">
                    <i className=""></i>
                    <span>Search Log Entries</span>
                </div>
                <div className="logSearch">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Search"
                            className="log_searchbox"
                            defaultValue={this.state.filteredLogEntries}
                            onChange={e => this.setState({filteredLogEntries: e.target.value})}/>
                        <span className="input-group-btn">
                            <button className="btn btn-secondary" type="button">< FaSearch/></button>
                        </span>
                    </div>
                    <button
                        className="searchlink"
                        onClick={this
                        .advancedSearchView
                        .bind(this)}>More Search Options</button>
                </div>
                <div className="logs_table_area">
                    <div >{!this.state.isHidden && <div className="advanced_wrapper">
                            <form>
                                <br/>
                                <fieldset>
                                    <div className="col-sm-6 col-md-4">
                                        <label className="search_lbl" name="source">Source Name</label>
                                        <Input type="select" id="source">
                                            {this.state.logEntries.map(LogEntry => <option>({LogEntry.source})</option>)}
                                        </Input>
                                    </div>
                                    <div className="col-sm-6 col-md-4">
                                        <label className="search_lbl">Identifier Contains</label>
                                        <Input id="identifier" name="identifier" onChange={this.handleSearch}/>
                                    </div>
                                    <div className="col-sm-6 col-md-4">
                                        <label className="search_lbl" name="gen_range">Generate Between</label>
                                        <DatePicker
                                            className="form-control"
                                            selected={this.state.startDate}
                                            selectsStart
                                            startDate={this.state.startDate}
                                            endDate={this.state.endDate}
                                            onChange={this.handleChangeStart}
                                            placeholderText="From Date"
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"/>
                                        <span>-</span>
                                        <DatePicker
                                            className="form-control"
                                            selected={this.state.endDate}
                                            selectsEnd
                                            startDate={this.state.startDate}
                                            endDate={this.state.endDate}
                                            onChange={this.handleChangeEnd}
                                            placeholderText="To Date"
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"/>
                                    </div>
                                    <div className="col-sm-6 col-md-4">
                                        <label className="search_lbl" name="gen_by">Generated By</label>
                                        <Input id="gen_by"/>
                                    </div>
                                    <div className="col-sm-6 col-md-4">
                                        <label className="search_lbl">Comment Contains</label>
                                        <Input id="comment" name="comment" onChange={this.handleSearch}/>
                                    </div>
                                    <div className="clear"></div>
                                </fieldset>
                                <div className="btn-group" role="group">
                                    <input
                                        type="button"
                                        value="Search"
                                        className=" col-sm-6 button confirm"
                                        onClick={this.advancedSearch}/>
                                    <button className="col-sm-6 cancelbtn">Clear All
                                    </button>
                                </div>
                            </form>
                        </div>}</div>
                    <div className="table-responsive logs_table">
                        <ReactTable
                            data={logEntries}
                            noDataText='No Log Entries Found'
                            pageSize = {(logEntries.length === 0) ? 5: (logEntries.length < 20)? logEntries.length: 20}
                            filterAll={true}
                            columns={[
                            {
                                accessor: 'source',
                                Header: 'Source Name',
                                width: undefined,
                                minWidth: 110
                            }, {
                                accessor: 'identifier',
                                Header: 'Identifier',
                                width: undefined,
                                minWidth: 100,
                                maxWidth: 100,
                                className: 'center'
                            }, {
                                accessor: date => moment(date.dateGenerated).format('DD/MM/YYYY'),
                                Header: 'Date Generated',
                                width: undefined,
                                minWidth: 135,
                                maxWidth: 160,
                                id: 'dateGenerated',
                                className: 'center'
                            }, {
                                accessor: 'generatedBy[username]',
                                Header: 'Generated By',
                                width: undefined,
                                minWidth: 100,
                                maxWidth: 150,
                                className: 'center'
                            }, {
                                accessor: 'comment',
                                Header: 'Comments',
                                minWidth: 140
                            }
                        ]}/>
                    </div>
                </div>
            </div>
        )
    }
}
