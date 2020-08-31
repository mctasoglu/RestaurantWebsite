/*!

This page is for uploading products into the database

*/
import React, { Children } from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

import firebase from "firebase.js";
import { storage } from "firebase.js";

var db = firebase.firestore();

//Regexp for validating names. Needs to be improved...

let foodRegExp = /^[A-Z]((([a-zA-Z&']))+((\s)(([a-zA-z&']))+)?)+$/;

let descriptionRegExp = /^[\w( )\.\!&$:;]+$/;

let quantRegExp = /^([0-9])+((\.)([0-9]+))?$/;

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

var restaurantName = "";

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      showCheck: false,
      image: null,

      count: 1,
      currentCount: 0, //Phase out
      targetCount: 3,

      numDays: 1,
      nameAlert: false,
      productDescriptionAlert: false,
      timeAlert: false,
      dayAlert: false,
      favAlert: false,
      time: "",
      productDescription: "",
      daysList: [],
      daysAlert: {},
      isFav: false,
      currRow: -1,
      numPopped: -1,

      lastItemTab: -1, //Phase out

      itemAlerts: {}, //new way to keep track of filled item tabs

      items: {
        "Item 1": {
          name: "",
          quantity: "",
          units: "",
          alerts: { name: false, quantity: false, units: false },
        },
      }, //keep track of all the items that are added to the product
      itemsList: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.addNewForms = this.addNewForms.bind(this);
    this.addNewDays = this.addNewDays.bind(this);

    this.submitData = this.submitData.bind(this);
    this.getTime = this.getTime.bind(this);
    this.getDay = this.getDay.bind(this);
    this.getFav = this.getFav.bind(this);
    this.renderDays = this.renderDays.bind(this);
    window.addEventListener("submit", this.submitData);
  }

  componentDidMount = () => {
    let restWelcome = document.getElementsByClassName(
      "navbar-wrapper m-auto"
    )[0].children[0].innerHTML;
    let firstIdxOfSpace = restWelcome.indexOf(" ");
    let lastIdx = restWelcome.length - 1;

    restaurantName = restWelcome.substring(firstIdxOfSpace + 1, lastIdx);
  };

  getTime = (e) => {
    let timeTarget = e.target.value;
    if (timeTarget == "Select below...") {
      this.setState({ timeAlert: true });
    } else {
      this.setState({ time: timeTarget });
      this.setState({ timeAlert: false });
    }
  };

  getFav = (e) => {
    let favTarget = e.target.value;
    if (favTarget == "Select below...") {
      this.setState({ favAlert: true });
    } else {
      this.setState({ isFav: favTarget === "Yes" ? true : false });
      this.setState({ favAlert: false });
    }
  };

  getDay = (row, e) => {
    let dayTarget = e.target.value;
    var dict = this.state.daysAlert;
    let dList = this.state.daysList;

    if (row == this.state.currRow && this.state.numPopped == 0) {
      dList.pop();
      this.setState({ numPopped: 1 });
    }
    let idx = dList.indexOf(dayTarget);
    if (dayTarget == "Select below..." || idx != -1) {
      dict[row] = true;
      this.setState({ daysAlert: dict });
    } else {
      dict[row] = false;

      dList.push(dayTarget);
      this.setState({ currRow: row });
      this.setState({ numPopped: 0 });

      this.setState({ daysList: dList });
      this.setState({ daysAlert: dict });
    }
  };

  renderDays = () => {
    var result = [];
    for (let i = 0; i < this.state.numDays; i++) {
      result.push(
        <Row id={i}>
          <div class="form-group col-md-4">
            <label for="inputState">Day</label>
            <select
              id="inputState"
              class="form-control"
              onBlur={(e) => this.getDay(i, e)}
            >
              <option selected>Select below...</option>
              <option>Sunday</option>
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
              <option>Saturday</option>
            </select>
            <div
              id="day-alert"
              style={{
                textAlign: "center",
                color: "red",
                fontSize: "12px",
                display: this.state.daysAlert[i] ? "block" : "none",
              }}
            >
              Please select a day or pick a different day
            </div>
          </div>
        </Row>
      );
    }
    return result;
  };

  submitData = (e) => {
    e.preventDefault();

    db.collection("Signed Restaurants")
      .doc(this.state.name)
      .set({
        email: "mctasoglu@gmail.com",
      })
      .then(function (docRef) {
        console.log("Success");
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  };

  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
    });
    this.setState({ image: event.target.files[0] });

    setTimeout(() => {
      this.setState({ showCheck: true });
    }, 1000);
  }

  //Function to add new input lists when button is clicked. Also checks if the relevant fields are checked. There is a bug here, check to see if you can find it...
  addNewForms = (e) => {
    e.preventDefault();
    let vals = Object.values(this.state.itemAlerts);
    let sum = vals.reduce((total, amount) => total + amount);

    if (sum === this.state.targetCount) {
      this.setState({ count: this.state.count + 1 });
      this.setState({ targetCount: this.state.targetCount + 3 });
      let newCount = this.state.count + 1;
      let newKey = "Item " + newCount;

      var prevDict = this.state.items;

      prevDict[newKey] = {
        name: "",
        quantity: "",
        units: "",
        alerts: { name: false, quantity: false, units: false },
      };

      this.setState({ items: prevDict });
    } else {
      alert("Please fill out all the required forms");
    }
  };

  addNewDays = (e) => {
    e.preventDefault();

    this.setState({ numDays: this.state.numDays + 1 });
  };

  //Used to alert if any input is invalid according to regexp
  checkInputValue = (e) => {
    let labelName = e.target.parentElement.children[0].innerHTML;
    let rowNum = e.target.parentElement.parentElement.parentElement.id;
    let id = labelName + " " + rowNum;
    let dict = this.state.itemAlerts;

    let key = "Item " + rowNum;
    var prevDict = this.state.items;

    if (labelName == "Item Name") {
      if (!foodRegExp.test(e.target.value)) {
        prevDict[key]["alerts"]["name"] = true;

        dict[id] = false;
        /* if (id != this.state.lastItemTab) {
          this.setState({
            currentCount: Math.max(0, this.state.currentCount - 1),
          });
        }
        this.setState({ lastItemTab: id }); */
        this.setState({ itemAlerts: dict });
        prevDict[key]["name"] = "";
        this.setState({ items: prevDict });
      } else {
        prevDict[key]["alerts"]["name"] = false;
        /* this.setState({
          currentCount: Math.min(
            this.state.currentCount + 1,
            this.state.targetCount
          ),
        }); */
        dict[id] = true;
        this.setState({ itemAlerts: dict });
        prevDict[key]["name"] = e.target.value;
        this.setState({ items: prevDict });
      }
    } else if (labelName == "Quantity") {
      if (!quantRegExp.test(e.target.value)) {
        //alert.style.display = "block";
        prevDict[key]["alerts"]["quantity"] = true;
        /*  if (id != this.state.lastItemTab) {
          this.setState({
            currentCount: Math.max(0, this.state.currentCount - 1),
          });
        }
        this.setState({ lastItemTab: id }); */
        dict[id] = false;
        this.setState({ itemAlerts: dict });
        prevDict[key]["quantity"] = "";
        this.setState({ items: prevDict });
      } else {
        //alert.style.display = "none";
        prevDict[key]["alerts"]["quantity"] = false;
        /* this.setState({
          currentCount: Math.min(
            this.state.currentCount + 1,
            this.state.targetCount
          ),
        }); */
        dict[id] = true;
        this.setState({ itemAlerts: dict });
        prevDict[key]["quantity"] = e.target.value;
        this.setState({ items: prevDict });
      }
    } else if (labelName == "Measurement") {
      //let alert = document.getElementById("unit-alert");
      if (!e.target.value) {
        //alert.style.display = "block";
        prevDict[key]["alerts"]["units"] = true;
        /* if (id != this.state.lastItemTab) {
          this.setState({
            currentCount: Math.max(0, this.state.currentCount - 1),
          });
        }
        this.setState({ lastItemTab: id }); */
        dict[id] = false;
        this.setState({ itemAlerts: dict });
        prevDict[key]["units"] = e.target.value;
        this.setState({ items: prevDict });
      } else {
        //alert.style.display = "none";
        prevDict[key]["alerts"]["units"] = false;
        /* this.setState({
          currentCount: Math.min(
            this.state.currentCount + 1,
            this.state.targetCount
          ),
        }); */
        dict[id] = true;
        this.setState({ itemAlerts: dict });
        prevDict[key]["units"] = e.target.value;
        this.setState({ items: prevDict });
      }
    }
  };

  //Display the input fields
  displayForms = () => {
    let items = [];
    let count = this.state.count;
    for (let i = 0; i < count; i++) {
      let currItemCount = i + 1;
      let currItem = "Item " + currItemCount;

      items.push(
        <Row id={currItemCount}>
          <Col className="pr-1" md="6">
            <FormGroup>
              <label>Item Name</label>
              <Input
                placeholder="Company"
                type="text"
                onBlur={this.checkInputValue}
              />
              <div
                id="name-alert"
                style={{
                  textAlign: "center",
                  color: "red",
                  fontSize: "12px",
                  display: this.state.items[currItem]["alerts"]["name"]
                    ? "block"
                    : "none",
                }}
              >
                Must be a valid name with at least three characters
              </div>
            </FormGroup>
          </Col>
          <Col className="pr-1 pl-1" md="4">
            <FormGroup>
              <label>Quantity</label>
              <Input
                placeholder="Quantity"
                type="text"
                onBlur={this.checkInputValue}
              />
              <div
                id="quant-alert"
                style={{
                  textAlign: "center",
                  color: "red",
                  fontSize: "12px",
                  display: this.state.items[currItem]["alerts"]["quantity"]
                    ? "block"
                    : "none",
                }}
              >
                Quantity must be a number
              </div>
            </FormGroup>
          </Col>
          <Col className="pl-1" md="2">
            <FormGroup>
              <label>Measurement</label>
              <select
                id="inputState"
                class="form-control"
                onBlur={this.checkInputValue}
              >
                <option></option>
                <option>count</option>
                <option>mL</option>
                <option>L</option>
                <option>fl oz</option>

                <option>kg</option>
                <option>lbs</option>
              </select>
              <div
                id="unit-alert"
                style={{
                  textAlign: "center",
                  color: "red",
                  fontSize: "12px",
                  display: this.state.items[currItem]["alerts"]["units"]
                    ? "block"
                    : "none",
                }}
              >
                Please select an option
              </div>
            </FormGroup>
          </Col>
        </Row>
      );
    }

    return items;
  };

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col md="8" style={{ margin: "auto" }}>
              <Card className="card-user">
                <CardHeader>
                  <CardTitle tag="h5">Add a New Product</CardTitle>
                </CardHeader>
                <hr />
                <CardBody>
                  <Form style={{ alignContent: "center" }}>
                    <Row>
                      <Col
                        className="pr-1"
                        md="7"
                        style={{ marginRight: "10px" }}
                      >
                        <FormGroup>
                          <label>Product Name</label>
                          <Input
                            placeholder="Hamburger"
                            type="text"
                            onBlur={(e) => {
                              if (!foodRegExp.test(e.target.value)) {
                                this.setState({ nameAlert: true });
                              } else {
                                this.setState({ nameAlert: false });
                                this.setState({ name: e.target.value });
                              }
                            }}
                          />
                          <div
                            id="product-name-alert"
                            style={{
                              textAlign: "center",
                              color: "red",
                              fontSize: "12px",
                              display: this.state.nameAlert ? "block" : "none",
                            }}
                          >
                            Please enter a valid name
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col
                        className="pr-1"
                        md="10"
                        style={{ marginRight: "10px" }}
                      >
                        <FormGroup>
                          <label>Product Description</label>
                          <Input
                            placeholder="An immersion into authentic Pittsburgh cuisine"
                            type="text"
                            onBlur={(e) => {
                              if (!descriptionRegExp.test(e.target.value)) {
                                this.setState({
                                  productDescriptionAlert: true,
                                });
                              } else {
                                this.setState({
                                  productDescriptionAlert: false,
                                });
                                this.setState({
                                  productDescription: e.target.value,
                                });
                              }
                            }}
                          />
                          <div
                            id="product-description-alert"
                            style={{
                              textAlign: "center",
                              color: "red",
                              fontSize: "12px",
                              display: this.state.productDescriptionAlert
                                ? "block"
                                : "none",
                            }}
                          >
                            Please enter a valid description
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <div class="form-group col-md-4">
                        <label for="inputState">
                          Is this a favorite product?
                        </label>
                        <select
                          id="inputState"
                          class="form-control"
                          onBlur={this.getFav}
                        >
                          <option selected>Select below...</option>
                          <option>Yes</option>
                          <option>No</option>
                        </select>
                        <div
                          id="fav-alert"
                          style={{
                            textAlign: "center",
                            color: "red",
                            fontSize: "12px",
                            display: this.state.favAlert ? "block" : "none",
                          }}
                        >
                          Please select an option
                        </div>
                      </div>
                    </Row>
                    <div
                      className="container-fluid"
                      style={{ textAlign: "center" }}
                    >
                      <div className="header row flex-middle">
                        <div
                          className="col"
                          style={{
                            display: "inline-block",
                            height: "100%",
                            margin: "auto",
                          }}
                        >
                          <CardTitle
                            tag="h5"
                            style={{
                              margin: "auto",
                              marginBottom: "10px",
                              display: "inline-block",
                            }}
                          >
                            Add Days
                          </CardTitle>
                        </div>

                        <button
                          className="addButton"
                          style={{
                            backgroundColor: "transparent",
                            outline: "none",
                          }}
                          onClick={this.addNewDays}
                        >
                          <svg
                            width="3em"
                            height="3em"
                            viewBox="0 0 16 16"
                            class="bi bi-file-plus-fill"
                            fill="#Ff7197"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M12 1H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zM8.5 6a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V10a.5.5 0 0 0 1 0V8.5H10a.5.5 0 0 0 0-1H8.5V6z"
                            />
                          </svg>
                        </button>
                      </div>
                      <hr />
                    </div>

                    {this.renderDays()}
                    <hr />
                    <Row>
                      <div class="form-group col-md-4">
                        <label for="inputState">Time</label>
                        <select
                          id="inputState"
                          class="form-control"
                          onBlur={this.getTime}
                        >
                          <option selected>Select below...</option>
                          <option>8 AM</option>
                          <option>9 AM</option>
                          <option>10 AM</option>
                          <option>11 AM</option>
                          <option>12 PM</option>
                          <option>1 PM</option>
                          <option>2 PM</option>
                          <option>3 PM</option>
                          <option>4 PM</option>
                          <option>5 PM</option>
                          <option>6 PM</option>
                          <option>7 PM</option>
                          <option>8 PM</option>
                          <option>9 PM</option>
                          <option>10 PM</option>
                          <option>11 PM</option>
                          <option>12 AM</option>
                        </select>
                        <div
                          id="time-alert"
                          style={{
                            textAlign: "center",
                            color: "red",
                            fontSize: "12px",
                            display: this.state.timeAlert ? "block" : "none",
                          }}
                        >
                          Please select a time
                        </div>
                      </div>
                    </Row>
                    <Row>
                      <Col className="pr-1" md="4">
                        <FormGroup id="upload-div" style={{ height: "200px" }}>
                          <label
                            htmlFor="exampleInputEmail1"
                            style={{ marginBottom: "10px" }}
                          >
                            Upload Product Image (.jpg or .png)
                          </label>
                          <Input type="file" onChange={this.handleChange} />

                          <div
                            className={
                              this.state.showCheck
                                ? "translation-shown"
                                : "translation-hidden"
                            }
                            style={{
                              color: "green",
                              margin: "auto",
                            }}
                          >
                            <svg
                              width="5em"
                              height="5em"
                              viewBox="0 0 16 16"
                              class="bi bi-check2"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
                              />
                            </svg>
                          </div>
                        </FormGroup>
                      </Col>
                      <Col md="3">
                        <img
                          src={this.state.file}
                          id="meal-image"
                          style={{
                            width: "150px",
                            height: "auto",
                            margin: "auto",
                            marginTop: "10px",
                            display: "inline-block",
                          }}
                        />
                      </Col>
                    </Row>
                    <hr />
                    <div
                      className="container-fluid"
                      style={{ textAlign: "center" }}
                    >
                      <div className="header row flex-middle">
                        <div
                          className="col"
                          style={{
                            display: "inline-block",
                            height: "100%",
                            margin: "auto",
                          }}
                        >
                          <CardTitle
                            tag="h5"
                            style={{
                              margin: "auto",
                              display: "inline-block",
                            }}
                          >
                            Add Items
                          </CardTitle>
                        </div>

                        <button
                          className="addButton"
                          style={{
                            backgroundColor: "transparent",
                            outline: "none",
                          }}
                          onClick={this.addNewForms}
                        >
                          <svg
                            width="3em"
                            height="3em"
                            viewBox="0 0 16 16"
                            class="bi bi-file-plus-fill"
                            fill="#Ff7197"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M12 1H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zM8.5 6a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V10a.5.5 0 0 0 1 0V8.5H10a.5.5 0 0 0 0-1H8.5V6z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {this.displayForms()}
                    <Row>
                      <div className="update ml-auto mr-auto">
                        <Button variant="primary" type="submit">
                          Submit
                        </Button>
                      </div>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default User;
