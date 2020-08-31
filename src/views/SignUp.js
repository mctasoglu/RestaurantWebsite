/*!

=========================================================
* Paper Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";

const streetRegExp = /^\d+\s[A-z']+\s[A-z]+/;
const cityRegExp = /^([A-Z][A-z']+)((([\.\,])?\s[A-z\.\']+)|([\-][A-z\.\']+))*?$/;
const zipCodeRegExp = /^(\d){5}(\-(\d){4})?$/;
const phoneNumRegExp = /^(\(\d{3}\))(\s)?(\d{3})(\-\d{4})$/;
const nameRegExp = /^(\D)+$/;
const emailRegExp = /^(\S)+(\@)([a-z\d\-])+(\.)([A-z]+)(\.[A-z]+)?$/;

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      states: [
        "Alabama",
        "Alaska",

        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "District of Columbia",

        "Florida",
        "Georgia",

        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",

        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",

        "Ohio",
        "Oklahoma",
        "Oregon",

        "Pennsylvania",

        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",

        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming",
      ],
      alerts: {},
      values: {},
    };

    this.verifyInput = this.verifyInput.bind(this);
    this.renderStates = this.renderStates.bind(this);
    this.submit = this.submit.bind(this);
  }

  verifyInput = (id, e) => {
    console.log(id);
    let val = e.target.value;
    var values = this.state.values;
    var alerts = this.state.alerts;
    if (id === "street-name") {
      if (streetRegExp.test(val)) {
        values["Street Name"] = val;
        alerts[id] = false;
        this.setState({ values: values });
        this.setState({ alerts: alerts });
      } else {
        alerts[id] = true;
        this.setState({ alerts: alerts });
      }
    } else if (id === "restaurant-name") {
      console.log(true);
      if (val !== "") {
        values["Restaurant Name"] = val;
        alerts[id] = false;
        this.setState({ values: values });
        this.setState({ alerts: alerts });
      } else {
        alerts[id] = true;
        this.setState({ alerts: alerts });
      }
    } else if (id === "city") {
      if (cityRegExp.test(val)) {
        values["City"] = val;
        alerts[id] = false;
        this.setState({ values: values });
        this.setState({ alerts: alerts });
      } else {
        alerts[id] = true;
        this.setState({ alerts: alerts });
      }
    } else if (id === "inputState") {
      if (val !== "State") {
        values["State"] = val;
        alerts[id] = false;
        this.setState({ values: values });
        this.setState({ alerts: alerts });
      } else {
        alerts[id] = true;
        this.setState({ alerts: alerts });
      }
    } else if (id === "zip-code") {
      if (zipCodeRegExp.test(val)) {
        values["Zip Code"] = val;
        alerts[id] = false;
        this.setState({ values: values });
        this.setState({ alerts: alerts });
      } else {
        alerts[id] = true;
        this.setState({ alerts: alerts });
      }
    } else if (id === "restaurant-info") {
      if (val.length >= 75) {
        values["Description"] = val;
        alerts[id] = false;
        this.setState({ values: values });
        this.setState({ alerts: alerts });
      } else {
        alerts[id] = true;

        this.setState({ alerts: alerts });
      }
    } else if (id === "first-name") {
      if (nameRegExp.test(val)) {
        values["First Name"] = val;
        alerts[id] = false;
        this.setState({ values: values });
        this.setState({ alerts: alerts });
      } else {
        alerts[id] = true;

        this.setState({ alerts: alerts });
      }
    } else if (id === "last-name") {
      if (nameRegExp.test(val)) {
        values["Last Name"] = val;
        alerts[id] = false;
        this.setState({ values: values });
        this.setState({ alerts: alerts });
      } else {
        alerts[id] = true;

        this.setState({ alerts: alerts });
      }
    } else if (id === "phone-number") {
      if (phoneNumRegExp.test(val)) {
        values["Phone Number"] = val;
        alerts[id] = false;
        this.setState({ values: values });
        this.setState({ alerts: alerts });
      } else {
        alerts[id] = true;

        this.setState({ alerts: alerts });
      }
    } else if (id === "email") {
      if (emailRegExp.test(val)) {
        values["Email"] = val;
        alerts[id] = false;
        this.setState({ values: values });
        this.setState({ alerts: alerts });
      } else {
        alerts[id] = true;

        this.setState({ alerts: alerts });
      }
    }
  };

  renderStates = () => {
    let options = this.state.states.map((state) => {
      return <option>{state}</option>;
    });

    return options;
  };

  submit = (e) => {
    let templateId = "template_3TdWgxG9";
    let vals = this.state.values;
    let alerts = Object.values(this.state.alerts);
    let values = Object.values(vals);
    let valKeys = Object.keys(vals);
    let isValidKeys = valKeys.filter((c) => c !== "Floor");

    let isValid = alerts.filter((c) => c === true);
    console.log(isValidKeys);
    console.log(isValid);
    if (isValidKeys.length < 10 || isValid.length !== 0) {
      alert("Please fill out all forms");
    } else {
      console.log(true);
      let floor = typeof vals["Floor"] === "undefined" ? "" : vals["Floor"];

      this.sendFeedback(templateId, {
        restaurant_name: vals["Restaurant Name"],
        restaurant_address: `${vals["Street Name"]} ${floor}, ${vals["City"]}, ${vals["State"]} ${vals["Zip Code"]}`,
        restaurant_description: vals["Description"],
        owner_name: `${vals["First Name"]} ${vals["Last Name"]}`,
        phone_number: vals["Phone Number"],
        email: vals["Email"],
        from_name: vals["Restaurant Name"],
        reply_to: vals["Email"],
      });
    }
  };

  sendFeedback(templateId, variables) {
    window.emailjs
      .send("gmail", templateId, variables)
      .then(() => {
        window.location.reload();
        console.log("Email successfully sent!");
      })
      // Handle errors here however you like, or use a React error boundary
      .catch((err) =>
        console.error(
          "Oh well, you failed. Here some thoughts on the error that occured:",
          err
        )
      );
  }

  render() {
    return (
      <>
        <div className="content">
          <div
            className="card"
            style={{
              margin: "auto",
              marginTop: "50px",
              width: "60%",
              marginBottom: "50px",

              display: "flex",
            }}
          >
            <div
              class="row form-group"
              style={{
                display: "inline-block",
                width: "500px",
                margin: "auto",
                marginTop: "20px",

                fontSize: "30px",
                marginBottom: "10px",
                display: "flex",
              }}
            >
              <b style={{ display: "inline-block", margin: "auto" }}>
                Partner with Chutoro!
              </b>
            </div>
            <div
              style={{
                border: "2px solid black",
                marginBottom: "10px",
                width: "95%",
                marginLeft: "20px",
              }}
            ></div>

            <h5 class="card-title" style={{ marginLeft: "20px" }}>
              Restaurant Information
            </h5>
            <div
              class="row form-group"
              style={{
                marginTop: "10px",
                marginLeft: "20px",

                marginBottom: "20px",
                width: "95%",
              }}
            >
              <input
                type="text"
                class="form-control"
                id="restaurant-name"
                placeholder="Name"
                onBlur={(e) => this.verifyInput("restaurant-name", e)}
                style={{
                  font: "inherit",

                  borderRadius: "10px",
                }}
              />
              <div
                className="name-alert"
                style={{
                  color: "red",
                  margin: "auto",

                  display: this.state.alerts["restaurant-name"]
                    ? "block"
                    : "none",
                }}
              >
                Please enter your restaurant name
              </div>
            </div>
            <div
              class="row form-group"
              style={{
                marginLeft: "20px",
                width: "95%",

                marginBottom: "20px",
              }}
            >
              <div className="col" style={{ paddingLeft: "0" }}>
                <input
                  type="address"
                  class="form-control"
                  id="street-name"
                  placeholder="Street Address"
                  onBlur={(e) => this.verifyInput("street-name", e)}
                  style={{
                    font: "inherit",

                    borderRadius: "10px",
                  }}
                />
                <div
                  className="street-alert"
                  style={{
                    color: "red",
                    margin: "auto",

                    display: this.state.alerts["street-name"]
                      ? "block"
                      : "none",
                  }}
                >
                  Please enter a valid street address
                </div>
              </div>
              <div className="col" style={{ paddingRight: "0" }}>
                <input
                  type="address"
                  class="form-control"
                  id="Floor"
                  onBlur={(e) => {
                    let dict = this.state.values;
                    dict["Floor"] = e.target.value;
                    this.setState({ values: dict });
                  }}
                  placeholder="Floor / Suite (optional)"
                  style={{
                    font: "inherit",

                    borderRadius: "10px",
                  }}
                />
              </div>
            </div>
            <div
              class="row form-group"
              style={{
                marginLeft: "20px",
                width: "95%",

                marginBottom: "20px",
              }}
            >
              <div className="col" style={{ paddingLeft: "0" }}>
                <input
                  type="address"
                  class="form-control"
                  id="city"
                  onBlur={(e) => this.verifyInput("city", e)}
                  placeholder="City"
                  style={{
                    font: "inherit",

                    borderRadius: "10px",
                  }}
                />
                <div
                  className="city-alert"
                  style={{
                    color: "red",
                    margin: "auto",

                    display: this.state.alerts["city"] ? "block" : "none",
                  }}
                >
                  Please enter a valid city
                </div>
              </div>
              <div className="col">
                <select
                  id="inputState"
                  class="form-control"
                  onBlur={(e) => this.verifyInput("inputState", e)}
                  style={{
                    font: "inherit",

                    borderRadius: "10px",
                    height: "45.74px",
                  }}
                >
                  <option selected>State</option>
                  {this.renderStates()}
                </select>
                <div
                  className="state-alert"
                  style={{
                    color: "red",
                    margin: "auto",

                    display: this.state.alerts["inputState"] ? "block" : "none",
                  }}
                >
                  Please enter a valid state
                </div>
              </div>
              <div className="col" style={{ paddingRight: "0" }}>
                <input
                  type="address"
                  class="form-control"
                  id="zip-code"
                  onBlur={(e) => this.verifyInput("zip-code", e)}
                  placeholder="Zip Code"
                  style={{
                    font: "inherit",

                    borderRadius: "10px",
                  }}
                />
                <div
                  className="zip-code-alert"
                  style={{
                    color: "red",
                    margin: "auto",

                    display: this.state.alerts["zip-code"] ? "block" : "none",
                  }}
                >
                  Please enter a valid zip code
                </div>
              </div>
            </div>
            <div
              class="row form-group"
              style={{
                marginTop: "10px",
                marginLeft: "20px",

                marginBottom: "20px",
                width: "95%",
              }}
            >
              <textarea
                rows="10"
                class="form-control"
                id="restaurant-info"
                onBlur={(e) => this.verifyInput("restaurant-info", e)}
                placeholder="Restaurant Information"
                style={{
                  font: "inherit",
                  maxHeight: "300px",

                  borderRadius: "10px",
                }}
              />
              <div
                className="info-alert"
                style={{
                  color: "red",
                  margin: "auto",

                  display: this.state.alerts["restaurant-info"]
                    ? "block"
                    : "none",
                }}
              >
                Please write a 75 character mininmum description of your
                restaurant
              </div>
            </div>

            <h5 class="card-title" style={{ marginLeft: "20px" }}>
              Owner Information
            </h5>
            <div
              class="row form-group"
              style={{
                marginLeft: "20px",
                width: "95%",

                marginBottom: "20px",
              }}
            >
              <div className="col" style={{ paddingLeft: "0" }}>
                <input
                  type="name"
                  class="form-control"
                  id="first-name"
                  onBlur={(e) => this.verifyInput("first-name", e)}
                  placeholder="First Name"
                  style={{
                    font: "inherit",

                    borderRadius: "10px",
                  }}
                />
                <div
                  className="first-name-alert"
                  style={{
                    color: "red",
                    margin: "auto",

                    display: this.state.alerts["first-name"] ? "block" : "none",
                  }}
                >
                  Please enter a name
                </div>
              </div>
              <div className="col" style={{ paddingRight: "0" }}>
                <input
                  type="name"
                  class="form-control"
                  onBlur={(e) => this.verifyInput("last-name", e)}
                  id="last-name"
                  placeholder="Last Name"
                  style={{
                    font: "inherit",

                    borderRadius: "10px",
                  }}
                />
                <div
                  className="last-name-alert"
                  style={{
                    color: "red",
                    margin: "auto",

                    display: this.state.alerts["last-name"] ? "block" : "none",
                  }}
                >
                  Please enter a name
                </div>
              </div>
            </div>
            <div
              class="row form-group"
              style={{
                marginTop: "10px",
                marginLeft: "20px",

                marginBottom: "20px",
                width: "95%",
              }}
            >
              <input
                type="text"
                class="form-control"
                id="phone-number"
                onBlur={(e) => this.verifyInput("phone-number", e)}
                placeholder="Mobile Phone Number (xxx) xxx-xxxx"
                style={{
                  font: "inherit",

                  borderRadius: "10px",
                }}
              />
              <div
                className="phone-number-alert"
                style={{
                  color: "red",
                  margin: "auto",

                  display: this.state.alerts["phone-number"] ? "block" : "none",
                }}
              >
                Please enter a valid phone number
              </div>
            </div>
            <div
              class="row form-group"
              style={{
                marginTop: "10px",
                marginLeft: "20px",

                marginBottom: "20px",
                width: "95%",
              }}
            >
              <input
                type="text"
                class="form-control"
                id="email"
                onBlur={(e) => this.verifyInput("email", e)}
                placeholder="Email Address"
                style={{
                  font: "inherit",

                  borderRadius: "10px",
                }}
              />
              <div
                className="email-alert"
                style={{
                  color: "red",
                  margin: "auto",

                  display: this.state.alerts["email"] ? "block" : "none",
                }}
              >
                Please enter a valid email address
              </div>
            </div>
            <div
              className="row"
              style={{
                display: "inline-block",

                marginLeft: "20px",
                width: "95%",

                marginBottom: "20px",
              }}
            >
              <div
                className="logInButton"
                onClick={this.submit}
                style={{
                  font: "inherit",
                  height: "45.74px",

                  borderRadius: "10px",

                  width: "100%",
                  backgroundColor: "#Ff7197",
                  display: "flex",
                }}
              >
                <p style={{ margin: "auto" }}>Submit</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default SignUp;
