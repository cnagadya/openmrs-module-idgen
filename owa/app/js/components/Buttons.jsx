/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
import React from 'react';
export default class Buttons extends React.Component {
  render() {
    return (
      <div>
        <input type="button" value="Primary Button" className="btn btn-primary"/>
        <br/><br/>
        <button className="btn btn-secondary btn-sm">
        <i className="fa fa-cubes" aria-hidden="true"></i>Secondary Button
        </button>
        <br/><br/>
        <a className="btn btn-primary text-center" href="">
        <i className="fa fa-tachometer fa-2x" aria-hidden="true"></i>
        <br/>
        Button With Icon</a>
        <br/><br/>
        <a className="btn btn-danger" href="#">
          Danger
        </a>
        <br/><br/>
        <input type="submit" value="Success" className="btn btn-success"/>
      </div>
    )
  }
}