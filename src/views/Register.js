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
// react plugin used to create google maps
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Input,
  FormGroup,
} from "reactstrap";

import firebase from "firebase.js";
import { storage } from "firebase.js";
require("firebase/functions");

let db = firebase.firestore();

const passRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=\-<>\,\.\/?\\{}\[\]]).{6,}$/;

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alerts: {},
      values: {},
      visibility: {},
      file: null,
      image: null,
    };

    this.registerUser = this.registerUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
    });
    this.setState({ image: event.target.files[0] });
  }

  registerUser = (e) => {
    let alerts = this.state.alerts;
    let vals = Object.values(alerts);
    let email = this.props.email;
    let name = this.props.name;
    let num = this.props.phoneNumber;
    let firstName = this.props.firstName;
    let lastName = this.props.lastName;
    let address = this.props.address;
    let src = this.state.file;
    let isValid = vals.filter((c) => c === true);
    console.log(isValid);
    console.log(name);
    if (this.state.file === null) {
      alert("Upload your restaurant logo");
    } else if (isValid.length !== 0) {
      alert("Set a password and confirm it for your new account");
    } else if (
      alerts["confirm-password"] === true &&
      this.state.values["Password"] !==
        (typeof this.state.values["Confirm"] !== "undefined")
        ? this.state.values["Confirm"]
        : ""
    ) {
      alert("Make sure passwords match");
    } else if (isValid.length !== 0) {
      alert(
        "Make a password that is at least 6 characters long and includes at least one digit, one special character, one uppercase letter, and one lowercase letter"
      );
    } else {
      let img = this.state.image;
      const uploadImage = storage
        .ref(`images/${name}/logo/${img.name}`)
        .put(img);
      let imgPath = `images/${name}/logo/${img.name}`;
      let password = this.state.values["Password"];

      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((result) => {
          const user = firebase.auth().currentUser;
          console.log(user);
          user.updateProfile({
            displayName: name,
            phoneNumber: num,
            photoUrl: src,
          });
        })
        .then(() => {
          const setNewUserInfo = firebase
            .functions()
            .httpsCallable("setNewUserInfo");
          const removeTempUser = firebase
            .functions()
            .httpsCallable("removeTempUser");
          removeTempUser({ email: email });
          setNewUserInfo({
            name: name,
            phoneNumber: num,
            email: email,
            firstName: firstName,
            lastName: lastName,
            address: address,
            logoPath: imgPath,
          })
            .then(function (docRef) {
              uploadImage.on(
                "state_changed",
                (snapshot) => {},
                (error) => {},
                () => {
                  storage
                    .ref(`images/${name}/logo`)

                    .child(img.name)
                    .getDownloadURL()
                    .then((url) => {
                      window.location.reload(false);
                    });
                }
              );
            })
            .then((result) => {
              alert("Account Created!");
            })
            .catch((err) => console.log(err));
        })

        .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
        });
    }
  };

  verifyInput = (id, e) => {
    console.log(id);
    let val = e.target.value;
    var values = this.state.values;
    var alerts = this.state.alerts;
    if (id === "password") {
      if (passRegExp.test(val)) {
        values["Password"] = val;
        alerts[id] = false;
        this.setState({ values: values });
        this.setState({ alerts: alerts });
      } else {
        alerts[id] = true;
        this.setState({ alerts: alerts });
      }
    } else if (id === "confirm-password") {
      if (
        typeof values["Password"] !== "undefined" &&
        val === values["Password"]
      ) {
        values["Confirm"] = val;

        alerts[id] = false;
        this.setState({ values: values });
        this.setState({ alerts: alerts });
      } else {
        alerts[id] = true;
        this.setState({ alerts: alerts });
      }
    }
  };

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
                Registration
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
              <label for="restaurant-name">Restaurant Name</label>
              <input
                type="text"
                class="form-control"
                id="restaurant-name"
                value={this.props.name}
                style={{
                  font: "inherit",

                  borderRadius: "10px",
                }}
                readOnly
              />
            </div>
            <Row
              style={{
                marginTop: "10px",
                marginLeft: "20px",

                marginBottom: "20px",
                width: "95%",
              }}
            >
              <div>
                <FormGroup id="upload-div" style={{ height: "200px" }}>
                  <label
                    htmlFor="exampleInputEmail1"
                    style={{ marginBottom: "10px" }}
                  >
                    Restaurant Logo
                  </label>
                  <Input type="file" onChange={this.handleChange} />
                </FormGroup>
              </div>
              <Col style={{ display: "flex" }}>
                <img
                  src={this.state.file}
                  id="meal-image"
                  style={{
                    width: "150px",
                    height: "150px",
                    margin: "auto",
                    marginTop: "10px",
                    display: "inline-block",
                  }}
                />
              </Col>
            </Row>
            <div
              class="row form-group"
              style={{
                marginTop: "10px",
                marginLeft: "20px",

                marginBottom: "20px",
                width: "95%",
              }}
            >
              <label for="restaurant-address">Restaurant Address</label>
              <input
                type="text"
                class="form-control"
                id="restaurant-address"
                value={this.props.address}
                style={{
                  font: "inherit",

                  borderRadius: "10px",
                }}
                readOnly
              />
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
                <label for="first-name">First Name</label>
                <input
                  type="name"
                  class="form-control"
                  id="first-name"
                  value={this.props.firstName}
                  style={{
                    font: "inherit",

                    borderRadius: "10px",
                  }}
                  readOnly
                />
              </div>
              <div className="col" style={{ paddingRight: "0" }}>
                <label for="last-name">Last Name</label>
                <input
                  type="name"
                  class="form-control"
                  id="last-name"
                  value={this.props.lastName}
                  style={{
                    font: "inherit",

                    borderRadius: "10px",
                  }}
                  readOnly
                />
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
              <label for="phone-number">Phone Number</label>
              <input
                type="text"
                class="form-control"
                id="phone-number"
                value={this.props.phoneNumber}
                style={{
                  font: "inherit",

                  borderRadius: "10px",
                }}
                readOnly
              />
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
              <label for="email">Email</label>
              <input
                type="text"
                class="form-control"
                id="email"
                value={this.props.email}
                style={{
                  font: "inherit",

                  borderRadius: "10px",
                }}
                readOnly
              />
            </div>
            <h5 class="card-title" style={{ marginLeft: "20px" }}>
              Account Information
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
              <label for="restaurant-name">Username</label>
              <input
                type="text"
                class="form-control"
                id="username"
                value={this.props.email}
                style={{
                  font: "inherit",

                  borderRadius: "10px",
                }}
                readOnly
              />
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
                <label for="password">Password</label>
                <input
                  type={this.state.visibility["pass"] ? "text" : "password"}
                  class="form-control"
                  id="password"
                  placeholder="Password"
                  onBlur={(e) => this.verifyInput("password", e)}
                  style={{
                    font: "inherit",

                    borderRadius: "10px",
                  }}
                />

                <input
                  type="checkbox"
                  onClick={(e) => {
                    let dict = this.state.visibility;
                    if (typeof dict["pass"] === "undefined") {
                      dict["pass"] = true;
                    } else {
                      dict["pass"] = !dict["pass"];
                    }
                    this.setState({ visibility: dict });
                  }}
                  value=""
                  id="defaultCheck1"
                  style={{
                    font: "inherit",
                    position: "relative",
                    fontSize: "14px",
                  }}
                />
                <label
                  class="form-check-label"
                  for="defaultCheck1"
                  style={{ marginLeft: "5px", fontSize: "14px" }}
                >
                  Show Password
                </label>
                <div
                  className="password-alert"
                  style={{
                    color: "red",
                    margin: "auto",

                    display: this.state.alerts["password"] ? "block" : "none",
                  }}
                >
                  Please enter a valid password
                </div>
              </div>
              <div className="col" style={{ paddingRight: "0" }}>
                <label for="confirm-password">Confirm Password</label>
                <input
                  type={this.state.visibility["confirm"] ? "text" : "password"}
                  class="form-control"
                  id="confirm-password"
                  onBlur={(e) => this.verifyInput("confirm-password", e)}
                  placeholder="Confirm Pasword"
                  style={{
                    font: "inherit",

                    borderRadius: "10px",
                  }}
                />
                <input
                  type="checkbox"
                  onClick={(e) => {
                    let dict = this.state.visibility;
                    if (typeof dict["confirm"] === "undefined") {
                      dict["confirm"] = true;
                    } else {
                      dict["confirm"] = !dict["confirm"];
                    }
                    this.setState({ visibility: dict });
                  }}
                  value=""
                  id="defaultCheck1"
                  style={{
                    font: "inherit",
                    position: "relative",
                    fontSize: "14px",
                  }}
                />
                <label
                  class="form-check-label"
                  for="defaultCheck1"
                  style={{ marginLeft: "5px", fontSize: "14px" }}
                >
                  Show Password
                </label>
                <div
                  className="confirm-password-alert"
                  style={{
                    color: "red",
                    margin: "auto",

                    display: this.state.alerts["confirm-password"]
                      ? "block"
                      : "none",
                  }}
                >
                  Passwords must match
                </div>
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
                onClick={this.registerUser}
                style={{
                  font: "inherit",
                  height: "45.74px",

                  borderRadius: "10px",

                  width: "100%",
                  backgroundColor: "#Ff7197",
                  display: "flex",
                }}
              >
                <p style={{ margin: "auto" }}>Register</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Register;
