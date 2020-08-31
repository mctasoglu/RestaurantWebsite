/*!

This page is at the top of the web tree. This is where all the relevant pages are added to the treee to be displayed.

*/
import React, { Fragment } from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch, Link, Redirect, useHistory } from "react-router-dom";
import { createBrowserHistory } from "history";

import DemoNavbar from "components/Navbars/DemoNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import SignUp from "views/SignUp.js";
import Register from "views/Register.js";
import FirstPage from "views/Dashboard.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";
import AddPlan from "views/AddPlan.js";

import history from "layouts/history.js";

import routes from "routes.js";
import subRoutes from "subRoutes.js";

import bannerLogo from "assets/img/logo_word.png";

import firebase from "firebase.js";
import { storage } from "firebase.js";

import { JsxEmit } from "typescript";

var ps;

var name = "";

var db = firebase.firestore();

var admin = require("firebase-admin");

const emailRegExp = /^(\S)+(\@)([a-z\d\-])+(\.)([A-z]+)(\.[A-z]+)?$/;

const hist = createBrowserHistory();

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "black",
      activeColor: "info",
      products: [],
      productDisplay: [],
      hasLoaded: false,
      restaurantName: "",
      email: "",
      password: "",
      user: null,
      shouldRegister: false,
      address: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    };

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: true });
      } else {
        this.setState({ user: null });
      }
    });

    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.authListener = this.authListener.bind(this);
    this.signUp = this.signUp.bind(this);
    this.register = this.register.bind(this);
    this.mainPanel = React.createRef();
  }

  authListener() {
    firebase.auth().onAuthStateChanged((user) => {
      console.log(user);
      //console.log(user);
      name = this.state.restaurantName;
      //var resUID = db.collection("Restaurants").doc(`${name}`).UID;
      if (user) {
        console.log(user.disabled);
        //User is signed in
        console.log(user.displayName);

        localStorage.setItem("user", user.uid);
        //var nameRef = db.collection('RestaurantUIDs').doc(String(user.uid));
        //name = nameRef.resName;
        //console.log("uid: " + user.uid);
        console.log(user.displayName);
        console.log(user.email);
        console.log(user.password);
      } else {
        this.setState({ user: null });
        localStorage.removeItem("user");
        name = "default";
      }
    });
  }

  componentDidMount() {
    /* if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.mainPanel.current);
    } */
    //this.authListener();
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      document.body.classList.toggle("perfect-scrollbar-on");
    }
  }

  componentDidUpdate(e) {
    /* if (e.history.action === "PUSH") {
      this.mainPanel.current.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    } */
  }

  signUp = (e) => {
    e.preventDefault();
    return (
      <>
        <Route
          path="/chutoro.com/restaurant/signup"
          render={(props) => <SignUp />}
        />
        <Redirect to="/chutoro.com/restaurant/signup" />
      </>
    );
  };

  register = (e) => {
    e.preventDefault();
    return (
      <>
        <Route
          path="/chutoro.com/restaurant/register"
          render={(props) => <Register />}
        />
        <Redirect to="/chutoro.com/restaurant/register" />
      </>
    );
  };

  handleChange(e) {
    let name = e.target.type;

    if (name === "restaurantName") {
      this.setState({ restaurantName: e.target.value });
    } else if (name === "email") {
      this.setState({ email: e.target.value });
    } else {
      this.setState({ password: e.target.value });
    }
  }

  login(e) {
    e.preventDefault();

    if (this.state.password === "" && emailRegExp.test(this.state.email)) {
      console.log(this.state.email);
      var docRef = db.collection("Signed Restaurants").doc(this.state.email);
      let obj = this;
      docRef
        .get()
        .then(function (doc) {
          if (doc.exists) {
            console.log(true);
            hist.push("register");
            obj.setState({ shouldRegister: true });
            let dict = doc.data();

            obj.setState({ firstName: dict["first name"] });
            obj.setState({ lastName: dict["last name"] });
            obj.setState({ address: dict["address"] });
            obj.setState({ phoneNumber: dict["phone number"] });
            obj.setState({ restaurantName: dict["name"] });
          } else {
            // doc.data() will be undefined in this case
            alert("Please enter a password");
          }
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    } else {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((u) => {
          console.log(u);
          console.log("Logged in!");
          this.setState({ user: true });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  handleActiveClick = (color) => {
    this.setState({ activeColor: color });
  };
  handleBgClick = (color) => {
    this.setState({ backgroundColor: color });
  };
  render() {
    if (!this.state.user) {
      if (
        this.props.location.pathname === "/chutoro.com/restaurant/signup" &&
        this.state.shouldRegister === false
      ) {
        return (
          <div className="wrapper">
            <Route
              path="/chutoro.com/restaurant/signup"
              render={(props) => <SignUp />}
            />
          </div>
        );
      } else if (
        this.state.shouldRegister === true &&
        this.props.location.pathname !== "/chutoro.com/restaurant/signup" &&
        this.props.location.pathname !== "/chutoro.com/restaurant/"
      ) {
        console.log("redirected");
        return (
          <div className="wrapper">
            <Switch>
              <Route
                path="/chutoro.com/restaurant/register"
                render={(props) => (
                  <Register
                    name={this.state.restaurantName}
                    email={this.state.email}
                    firstName={this.state.firstName}
                    lastName={this.state.lastName}
                    address={this.state.address}
                    phoneNumber={this.state.phoneNumber}
                  />
                )}
              />
              <Redirect to="/chutoro.com/restaurant/register" />
            </Switch>
          </div>
        );
      } else {
        console.log(this.props.location.pathname);
        return (
          <div
            className="card"
            style={{
              margin: "auto",
              marginTop: "100px",
              width: "700px",
              display: "flex",
            }}
          >
            <div
              className="row img"
              style={{ width: "300px", margin: "auto", marginTop: "50px" }}
            >
              <img src={bannerLogo}></img>
            </div>
            <div
              class="row form-group"
              style={{
                display: "inline-block",
                width: "500px",
                margin: "auto",
                marginTop: "20px",

                marginBottom: "20px",
              }}
            >
              <input
                type="email"
                class="form-control"
                id="exampleInputEmail1"
                value={this.state.email}
                onChange={this.handleChange}
                placeholder="Enter email"
                style={{
                  height: "60px",
                  font: "inherit",
                  fontSize: "18px",
                  borderRadius: "10px",
                }}
              />
            </div>
            <div
              class="row form-group"
              style={{
                display: "inline-block",
                width: "500px",
                margin: "auto",

                fontSize: "28px",
                marginBottom: "20px",
              }}
            >
              <input
                type="password"
                class="form-control"
                id="exampleInputPassword1"
                value={this.state.password}
                onChange={this.handleChange}
                placeholder="Password"
                style={{
                  height: "60px",
                  font: "inherit",
                  fontSize: "18px",
                  borderRadius: "10px",
                }}
              />
            </div>
            <div
              className="row"
              style={{
                display: "inline-block",
                width: "500px",
                margin: "auto",

                marginBottom: "20px",
              }}
            >
              <div
                className="logInButton"
                style={{
                  height: "60px",
                  font: "inherit",
                  fontSize: "18px",
                  borderRadius: "10px",
                  width: "500px",
                  backgroundColor: "#Ff7197",
                  display: "flex",
                }}
                onClick={this.login}
              >
                <p style={{ margin: "auto" }}>Log In</p>
              </div>
            </div>
            <div
              className="row"
              style={{
                display: "inline-block",
                width: "500px",
                margin: "auto",

                marginBottom: "50px",
                display: "flex",
              }}
            >
              <Link
                to="/chutoro.com/restaurant/signup"
                style={{ color: "#0645AD", margin: "auto" }}
              >
                <p>Interested in becoming a restaurant partner with Chutoro?</p>
              </Link>
            </div>
          </div>
        );
      }
    }

    //If the fetching is completed, initialize all the relevant pages of the web tree.
    else {
      console.log("redirect");
      return (
        <>
          <div className="wrapper">
            {" "}
            <Sidebar
              {...this.props}
              routes={routes}
              bgColor={this.state.backgroundColor}
              activeColor={this.state.activeColor}
            />
            <div className="main-panel" ref={this.mainPanel}>
              <DemoNavbar {...this.props} />
              <Switch>
                {routes.map((prop, key) => {
                  return (
                    <Route
                      path={prop.layout + prop.path}
                      render={(props) => <prop.component data={this.state} />}
                      key={key}
                    />
                  );
                })}
                {subRoutes.map((prop, key) => {
                  return (
                    <Route
                      path={prop.layout + prop.path}
                      component={prop.component}
                      key={key}
                    />
                  );
                })}
              </Switch>
              <Footer fluid />
              <Redirect to="/chutoro.com/restaurant/dashboard" />
            </div>
          </div>
        </>
      );
    }
  }
  //Loading page
}

export default Dashboard;
