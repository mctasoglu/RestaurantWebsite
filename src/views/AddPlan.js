/*
This page is to upload plans according to the relevant products. Try to implement a feature where you can click each product you want to add, 
and then once you submit, it will create a new meal plan entry in firebase.
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

import { Product, productConverter } from "components/Classes/ProductClass.js";

var db = firebase.firestore();

var productArr = [];

let foodRegExp = /^[A-Z]((([a-zA-Z&]){2,})+((\s)(([a-zA-z&]))+)?)+$/;

let quantRegExp = /^([0-9])+((\.)([0-9]+))?$/;

var name = "";

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

      products: [],
      imgUrl: "",
      hasLoaded: false,
      displayedProducts: [],
    };

    this.handleChange = this.handleChange.bind(this);
    let list = this.props.products;

    //window.addEventListener("resize", this.handleResize);
    this.submitData = this.submitData.bind(this);
    console.log(list);

    window.addEventListener("submit", this.submitData);
    this.state = {
      file: null,
      showCheck: false,
      image: null,

      count: 1,
      currentCount: 0,
      targetCount: 3,

      products: [],
      imgUrl: "",
      hasLoaded: false,
      displayedProducts: list,
    };
  }

  componentDidMount = () => {};

  submitData = (e) => {
    e.preventDefault();
    console.log(this.state.productDisplay);
    /* var imgPath = this.state.products[0].imagePath;
    console.log(imgPath);
    var imgStorage = storage.ref(`${imgPath}`);
    imgStorage
      .getDownloadURL()
      .then(function (url) {
        // Insert url into an <img> tag to "download"
        console.log(url);
      })
      .catch(function (error) {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/object-not-found":
            // File doesn't exist
            break;

          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;

          case "storage/canceled":
            // User canceled the upload
            break;

          case "storage/unknown":
            // Unknown error occurred, inspect the server response
            break;
        }
      }); */
    /* let img = this.state.image;
    const uploadImage = storage.ref(`images/${img.name}`).put(img);
    let imgPath = `images/${img.name}`;

    if (this.state.name == "") {
      alert("Give your product a name");
    } else if (this.state.image == null) {
      alert("Please upload an image of the product");
    } else if (this.state.currentCount != this.state.targetCount) {
      alert("Please fill out all the required forms");
    } else {
      db.collection("Users")
        .doc(this.state.name)
        .set({
          name: this.state.name,
          items: this.state.items,
          imagePath: imgPath,
        })
        .then(function (docRef) {
          //console.log("Document written with ID: ", docRef.id);
          uploadImage.on(
            "state_changed",
            (snapshot) => {},
            (error) => {
              console.log(error);
            },
            () => {
              storage
                .ref("images")
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
    } */
  };

  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
    });
    this.setState({ image: event.target.files[0] });
    console.log(event.target.files[0]);

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

  /* checkInputValue = (e) => {
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
  }; */

  /* componentDidMount = () => {
    db.collection("Users")
      .add({
        first: "Alan",
        middle: "Mathison",
        last: "Turing",
        born: 1912,
      })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  }; */

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col md="8" style={{ margin: "auto" }}>
              <Card className="card-user">
                <CardHeader>
                  <CardTitle tag="h5">Add a New Plan</CardTitle>
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
                          <label>Plan Name</label>
                          <Input
                            placeholder="Chutoro Eat and Greet"
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
                            Upload Plan Image (.jpg or .png)
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
                            Add Products
                          </CardTitle>
                        </div>
                      </div>
                    </div>

                    {/*
                    {this.displayForms()} 
                    */}
                    {this.state.displayedProducts}
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
