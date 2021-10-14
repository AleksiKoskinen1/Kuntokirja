import React, { Component } from 'react';
import zxcvbn from 'zxcvbn';

class passwordStrengthMeter extends Component {

    constructor(props) {
        
		  super(props);
    } 

  createPasswordLabel (result)  {

    switch (result.score) {
      case 0:
        return 'Heikko';
      case 1:
        return 'Heikko';
      case 2:
        return 'Kohtalainen';
      case 3:
        return 'Hyvä';
      case 4:
        return 'Vahva';
      default:
        return 'Heikko';
    }
  }

  render() {

    const testedResult = zxcvbn(this.props.password);

    return (
      <div className="password-strength-meter">
        {this.props.password && (
          <>
            <progress className={`password-strength-meter-progress strength-${this.createPasswordLabel(testedResult)}`} value={testedResult.score} max="4" />
            <br />
            <label className="password-strength-meter-label">
                  <strong>Salasanan vahvuus:</strong> {this.createPasswordLabel(testedResult)}
            </label>
          </>
        )}
      </div>
    );
  }
}

export default passwordStrengthMeter;