/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
import React from 'react';
export default class Notifications extends React.Component {
  render() {
    return (
      <div>
        <div className="row justify-content-md-center">
          <div className="alert alert-success" role="alert">
            <strong>
              <i className="fa fa-check" aria-hidden="true"></i>
            </strong>
            Nom d'utilisateur ou mot de passe incorrect!
          </div>
        </div>
        <div className="row justify-content-md-center">
          <div className="alert alert-warning" role="alert">
            <strong>
              <i className="fa fa-exclamation" aria-hidden="true"></i>
            </strong>
            Nom d'utilisateur ou mot de passe incorrect!
          </div>
        </div>
        <div className="row justify-content-md-center">
          <div className="alert alert-danger" role="alert">
            <strong><i className="fa fa-times" aria-hidden="true"></i></strong>
            Nom d'utilisateur ou mot de passe incorrect!
          </div>
        </div>
      </div>
    )
  }
}