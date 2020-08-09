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

let foodRegExp = /^[A-Z]((([a-zA-Z&]){2,})+((\s)(([a-zA-z&]))+)?)+$/;

let quantRegExp = /^([0-9])+((\.)([0-9]+))?$/;

var restaurantName = "";

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      showCheck: false,
      image: null,

      count: 1,
      currentCount: 0,
      targetCount: 3,

      items: { "Item 1": {} },
      itemsList: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.addNewForms = this.addNewForms.bind(this);

    this.submitData = this.submitData.bind(this);
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

  submitData = (e) => {
    e.preventDefault();
    let img = this.state.image;
    const uploadImage = storage
      .ref(`images/${restaurantName}/${img.name}`)
      .put(img);
    let imgPath = `images/${restaurantName}/${img.name}`;

    if (this.state.name == "") {
      alert("Give your product a name");
    } else if (this.state.image == null) {
      alert("Please upload an image of the product");
    } else if (this.state.currentCount != this.state.targetCount) {
      alert("Please fill out all the required forms");
    } else {
      let keys = Object.keys(this.state.items);
      let prevDict = this.state.items;
      let sortedKeys = keys.sort();
      var newList = [];

      //Convert the dictionary items into a list sorted by key

      for (let i = 0; i < sortedKeys.length; i++) {
        let key = sortedKeys[i];
        let dict = prevDict[key];
        newList.push({ key: dict });
      }
      db.collection("Restaurants")
        .doc(restaurantName)
        .collection("Products")
        .doc(this.state.name)
        .set({
          name: this.state.name,
          items: newList,
          imagePath: imgPath,
        })
        .then(function (docRef) {
          uploadImage.on(
            "state_changed",
            (snapshot) => {},
            (error) => {
              console.log(error);
            },
            () => {
              storage
                .ref(`images/${restaurantName}`)

                .child(img.name)
                .getDownloadURL()
                .then((url) => {
                  console.log(url);
                  window.location.reload(false);
                });
            }
          );
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    }
  };

  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
    });
    this.setState({ image: event.target.files[0] });
    console.log(URL.createObjectURL(event.target.files[0]));

    setTimeout(() => {
      this.setState({ showCheck: true });
    }, 1000);
  }

  /* handleResize = () => {
    let div = document.getElementById("upload-div");

    let divWidth = div.getBoundingClientRect().width;
    let img = document.getElementById("meal-image");

    let imgMarginLeft = (divWidth - 150) / 2;
    if (imgMarginLeft < 0) {
      img.style.marginLeft = "0";
    } else {
      img.style.marginLeft = imgMarginLeft + "px";
    }
  }; */

  //Function to add new input lists when button is clicked. Also checks if the relevant fields are checked. There is a bug here, check to see if you can find it...
  addNewForms = (e) => {
    e.preventDefault();

    if (this.state.currentCount == this.state.targetCount) {
      this.setState({ count: this.state.count + 1 });
      this.setState({ targetCount: this.state.targetCount + 3 });
      let newCount = this.state.count + 1;
      let newKey = "Item " + newCount;
      console.log(newKey);
      var prevDict = this.state.items;

      prevDict[newKey] = {};

      this.setState({ items: prevDict });
    } else {
      console.log(this.state.count);
      alert("Please fill out all the required forms");
    }
  };

  //Used to alert if any input is invalid according to regexp
  checkInputValue = (e) => {
    let labelName = e.target.parentElement.children[0].innerHTML;
    let rowNum = e.target.parentElement.parentElement.parentElement.id;

    let key = "Item " + rowNum;
    var prevDict = this.state.items;

    if (labelName == "Item Name") {
      let alert = document.getElementById("name-alert");
      if (!foodRegExp.test(e.target.value)) {
        alert.style.display = "block";
        this.setState({
          currentCount: Math.max(0, this.state.currentCount - 1),
        });
        prevDict[key]["name"] = "";
        this.setState({ items: prevDict });
      } else {
        alert.style.display = "none";
        this.setState({ currentCount: this.state.currentCount + 1 });
        prevDict[key]["name"] = e.target.value;
        this.setState({ items: prevDict });
      }
    } else if (labelName == "Quantity") {
      let alert = document.getElementById("quant-alert");
      if (!quantRegExp.test(e.target.value)) {
        alert.style.display = "block";
        this.setState({
          currentCount: Math.max(0, this.state.currentCount - 1),
        });
        prevDict[key]["quantity"] = "";
        this.setState({ items: prevDict });
      } else {
        alert.style.display = "none";
        this.setState({ currentCount: this.state.currentCount + 1 });
        prevDict[key]["quantity"] = e.target.value;
        this.setState({ items: prevDict });
      }
    } else if (labelName == "Measurement") {
      let alert = document.getElementById("unit-alert");
      if (!e.target.value) {
        alert.style.display = "block";
        this.setState({
          currentCount: Math.max(0, this.state.currentCount - 1),
        });
        prevDict[key]["units"] = e.target.value;
        this.setState({ items: prevDict });
      } else {
        alert.style.display = "none";
        this.setState({ currentCount: this.state.currentCount + 1 });
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
      items.push(
        <Row id={count}>
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
                  display: "none",
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
                  display: "none",
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
                  display: "none",
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
                              let alert = document.getElementById(
                                "product-name-alert"
                              );
                              if (!foodRegExp.test(e.target.value)) {
                                alert.style.display = "block";
                              } else {
                                alert.style.display = "none";
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
                              display: "none",
                            }}
                          >
                            Please enter a valid name
                          </div>
                        </FormGroup>
                      </Col>
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