//Registration page when new restaurants sign up

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

//Regexp for setting passwords: requires at least 6 characters, one special, and one Uppercase
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

  //Want to create url for uploaded image in registration
  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
    });
    this.setState({ image: event.target.files[0] });
  }

  //Before allowing registration, need to make sure that all input fields are properly filled
  registerUser = (e) => {
    let alerts = this.state.alerts;
    let vals = Object.values(alerts); //This is to check whether any alerts are activated
    let email = this.props.email;
    let name = this.props.name;
    let num = this.props.phoneNumber;
    let firstName = this.props.firstName;
    let lastName = this.props.lastName;
    let address = this.props.address;
    let src = this.state.file;
    let isValid = vals.filter((c) => c === true);
    console.log(this.state.file);

    //If no image is uploaded, must re-prompt user to upload an image
    if (this.state.file === null) {
      alert("Upload your restaurant logo");
    } else if (isValid.length !== 0) {
      // Check if alerts for password and re-enter password
      alert("Set a password and confirm it for your new account");
    } else if (
      alerts["confirm-password"] === true &&
      this.state.values["Password"] !==
        (typeof this.state.values["Confirm"] !== "undefined")
        ? this.state.values["Confirm"]
        : ""
    ) {
      //Want to make sure that passwords match
      alert("Make sure passwords match");
    } else if (isValid.length !== 0) {
      alert(
        "Make a password that is at least 6 characters long and includes at least one digit, one special character, one uppercase letter, and one lowercase letter"
      );
    } else {
      let img = this.state.image;
      //Want to upload image into Firebase storage
      const uploadImage = storage
        .ref(`images/${name}/logo/${img.name}`)
        .put(img);
      let imgPath = `images/${name}/logo/${img.name}`;
      let password = this.state.values["Password"];

      //Use firebase auth to create new user
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((result) => {
          const user = firebase.auth().currentUser;
          console.log(user);
          user.updateProfile({
            //Update user information with Firebase Authentication
            displayName: name,
            phoneNumber: num,
            photoUrl: src,
          });
        })
        .catch((err) => console.log(err))
        .then(() => {
          //HTTPS call function from Firebase Cloud Functions
          const setNewUserInfo = firebase
            .functions()
            .httpsCallable("setNewUserInfo");
          const removeTempUser = firebase
            .functions()
            .httpsCallable("removeTempUser"); //Removes the temporary account used to register from the database

          removeTempUser({ email: email });
          console.log("User was removed");
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
                  //Store the uploaded image into Storage
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
            .catch((err) => console.log(err))
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
    //Checks to see if password and/or confirm pasword input fields are properly
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
    //Render page for registration. Just HTML and CSS
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
