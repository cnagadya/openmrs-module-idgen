/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
import React from 'react';
export default class Forms extends React.Component {
  render() {
    return (
      <div>
        <form>
          <div className="form-group">
            <label htmlFor="validationServer01">Optional Field</label>
            <input
              type="text"
              className="form-control col-md-6"
              id="validationServer01"
              placeholder="Optional"/>

          </div>
          <div className="form-group">
            <label htmlFor="validationServer03">Required Field
              <span className="red">*</span>
            </label>
            <input
              type="text"
              className="form-control col-md-6 is-invalid"
              id="validationServer03"
              placeholder="Required"
              required/>
            <div className="invalid-feedback">
              Please provide Required Field.
            </div>
          </div>
          <div className="form-group">
            <label>Sample Select</label>
            <select className="form-control col-md-6">
              <option>Default select</option>
            </select>
          </div>
          <div className="form-group">
            <label >Text Area
            </label>
            <textarea className="form-control col-md-6" rows="3"></textarea>
          </div>
          <div className="form-group">
            <label >Date Picker
            </label>
            <div className="input-group  col-md-6">
              <span className="input-group-addon bg-white">
                <i className="fa  fa-calendar" aria-hidden="true"></i>
              </span>
              <input type="date" className="form-control"/>
            </div>
          </div>
          <button className="btn btn-success" type="submit">Submit form</button>
        </form>
      </div>
    )
  }
}