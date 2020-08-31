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

import { MealPlan, planConverter } from "components/Classes/ProductClass.js";
import { Meal, mealConverter } from "components/Classes/MealClass.js";

import moment from "moment";

import logo from "assets/img/chutoro_fish.png";

var db = firebase.firestore();

var productArr = [];

let foodRegExp = /^[A-Z]((([(\S)]))+((\s)(([(\S)]))+)?)+$/;

let descriptionRegExp = /^[\w( )\.\!&$:;]+$/;

let priceRegExp = /^(\d{1,}(\.)\d{2})$/;

let quantRegExp = /^([0-9])+((\.)([0-9]+))?$/;

let numRegExp = /^[1-9]([0-9])*$/;

var name = "";

let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

//CSS style for circles
const circleStyle = {
  height: "35px",
  width: "35px",
  top: "-8px",
  left: "-8px",
  backgroundColor: "red",
  borderRadius: "100%",
  display: "flex",
  position: "absolute",
  color: "white",
};

const delStyle = {
  height: "35px",
  width: "35px",
  top: "-8px",
  right: "-8px",
  backgroundColor: "red",
  borderRadius: "100%",

  display: "flex",
  position: "absolute",
  color: "white",
};

var daysList = [];

class User extends React.Component {
  constructor(props) {
    super(props);

    var attrs = {};

    this.state = {
      products: [],
      productDict: {},

      planName: "", //Keep track of plan's name
      planDescription: "",
      planPrice: "",
      planNameAlert: false, //Keep track of when to display alerts
      planDescriptionAlert: false,
      planPriceAlert: false,
      begDateAlert: false,
      endDateAlert: false,
      tierAlert: false,
      recurrenceAlert: false,
      file: null,
      showCheck: false,
      image: null,
      tier: "",

      weeksList: [], //Keeps track of all picked products
      weeksAlert: {},
      numPopped: 0,
      currRow: -1,

      numWeeks: 0,
      weeklyOptions: {},
      count: 1,
      currentCount: 0,
      targetCount: 3,

      optionList: [<option selected>Select below...</option>],
      products: [],
      imgUrl: "",
      hasLoaded: false,
      displayedProducts: [],
      attributes: [],

      //dateObject: moment(),
      firstDay: moment().startOf("month"),
      showCalendar: false,
      clickBeg: false,
      clickEnd: false,
      begDate: "",
      endDate: "",
      insideDateTabs: false,
      insideCalendar: false,
      dateTabs: [
        {
          name: "Beginning Date",
          func: this.showCalendarFromBeg,
        },
        {
          name: "End Date",
          func: this.showCalendarFromEnd,
        },
      ],
    };

    function init(obj) {
      name = "Mola";

      var docRef = db.collection("Restaurants").doc(`${name}`);

      var productInstances = [];

      //Convert each document in the collection 'Products' into instances of the Product Class. More information can be found in components/Classes/ProductClass.js
      docRef
        .collection("Products")
        .withConverter(mealConverter)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            var product = doc.data();
            // doc.data() is never undefined for query doc snapshots
            productInstances.push(product);
          });
        });

      //Due to fetching operation being asynchronous, a Promise is returned where after 2 seconds, the list of all the products is returned.
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(productInstances);
        }, 1000);
      });
    }

    //Get all the images of the corresponding products from the Cloud Storage
    function getImages(currentProducts) {
      var result = {};

      for (let i = 0; i < currentProducts.length; i++) {
        let prod = currentProducts[i];

        let name = prod.name;

        let src = prod.imagePath;

        var imgStorage = storage.ref(`${src}`);
        (function () {
          imgStorage
            .getDownloadURL()
            .then(function (url) {
              // Insert url into an <img> tag to "download"
              prod.url = url;

              result[name] = prod;
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
            });
        })();
      }

      //Once again, this is an asynchronous function

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(result);
        }, 1000);
      });
    }

    async function getList(obj) {
      //First, wait for the product list to be filled
      let productList = await init(obj);

      //Set state
      obj.setState({ products: productList });

      //Once the images are successfully retrieved, result of that function is passed into the success clause (.then). This is kind of similar to 150 CPS.
      getImages(productList)
        .then((dict) => {
          obj.setState({ prodDict: dict });

          let names = Object.keys(dict);
          for (let j = 0; j < names.length; j++) {
            let name = names[j];
            attrs[name] = [false, 0];
          }

          obj.setState({ attributes: attrs });

          //To confirm that fetching is completed.
          obj.setState({ hasLoaded: true });
        })

        //Error case
        .catch(() => console.log("Error"));

      //let images = await getImages(productList);
      //obj.setState({ productDisplay: images });

      //obj.setState({ hasLoaded: true });
    }

    //window.addEventListener("resize", this.handleResize);
    this.submitData = this.submitData.bind(this);

    window.addEventListener("submit", this.submitData);

    window.addEventListener("click", (e) => {
      //This is to hide calendar when clicked outside
      if (
        this.state.insideCalendar == false &&
        this.state.insideDateTabs == false
      ) {
        this.setState({ showCalendar: false });
      }
    });
    this.displayProducts = this.displayProducts.bind(this);
    this.passDate = this.passDate.bind(this);
    this.showCalendarFromBeg = this.showCalendarFromBeg.bind(this);
    this.showCalendarFromEnd = this.showCalendarFromEnd.bind(this);

    this.getWeek = this.getWeek.bind(this);

    this.renderWeeklyOptions = this.renderWeeklyOptions.bind(this);

    getList(this);
  }

  weekdays = moment.weekdaysShort();

  onChange = () => {
    return;
  };

  getWeek = (row, e) => {
    let weekTarget = e.target.value;
    var dict = this.state.weeksAlert;
    let dList = this.state.weeksList;

    if (row == this.state.currRow && this.state.numPopped == 0) {
      dList.pop();
      this.setState({ numPopped: 1 });
    }
    //let idx = dList.indexOf(weekTarget);
    if (weekTarget == "Select below...") {
      dict[row] = true;
      this.setState({ weeksAlert: dict });
    } else {
      dict[row] = false;

      dList.push(weekTarget);
      this.setState({ currRow: row });
      this.setState({ numPopped: 0 });

      this.setState({ weeksList: dList });
      this.setState({ weeksAlert: dict });
    }
  };

  renderAttributes = () => {};

  //This is to display both date tabs
  renderDateTabs = () => {
    let dateElements = this.state.dateTabs.map((c) => {
      var shouldShow = false;
      var alert = this.state.endDateAlert;
      if (c.name == "Beginning Date") {
        shouldShow = true;
        alert = this.state.begDateAlert;
      }
      return (
        <Col className="pr-1" md="5" style={{ marginRight: "10px" }}>
          <FormGroup>
            <label>{c.name}</label>
            <div
              class="input-group mb-3"
              style={{ cursor: "pointer" }}
              onClick={c.func}
              onMouseEnter={(e) => {
                this.setState({ insideDateTabs: shouldShow });
              }}
              onMouseLeave={(e) => {
                this.setState({ insideDateTabs: false });
              }}
            >
              <div className="input-group-prepend">
                <span
                  className="input-group-text"
                  id="basic-addon1"
                  style={{
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    borderRight: "1px solid #DDDDDD",
                  }}
                >
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 16 16"
                    class="bi bi-calendar-event"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1zm1-3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M3.5 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5zm9 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5z"
                    />
                    <rect width="2" height="2" x="11" y="6" rx=".5" />
                  </svg>
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="MM/DD/YYYY"
                value={
                  c.name == "Beginning Date"
                    ? this.state.begDate
                    : this.state.endDate
                }
                onBlur={(e) => {
                  if (!foodRegExp.test(e.target.value)) {
                  } else {
                    this.setState({ name: e.target.value });
                  }
                }}
              />
            </div>

            <div
              id={`${c.name}-alert`}
              style={{
                textAlign: "center",
                color: "red",
                fontSize: "12px",
                display: alert ? "block" : "none",
              }}
            >
              Please enter a valid Date
            </div>
          </FormGroup>
        </Col>
      );
    });
    return dateElements;
  };

  //Add month to calendar
  addMonth = (e) => {
    let currFirstDay = this.state.firstDay;
    let nextFirstDay = moment(currFirstDay).add(1, "month");
    this.setState({ firstDay: nextFirstDay });
  };

  //Subtract month
  subMonth = (e) => {
    let currFirstDay = this.state.firstDay;
    let nextFirstDay = moment(currFirstDay).subtract(1, "month");
    this.setState({ firstDay: nextFirstDay });
  };

  //Display the date after clicking on the calendar
  passDate = (num) => {
    let date = moment(this.state.firstDay).add(num - 1, "days");
    let dateSel = date.format("MM/DD/YYYY");
    let endDate = date.add(this.state.numWeeks, "weeks").format("MM/DD/YYYY");

    if (
      moment(dateSel).isBefore(moment()) ||
      moment(dateSel).isSame(moment())
    ) {
      this.setState({ begDateAlert: true });
    } else {
      this.setState({ begDate: dateSel });
      this.setState({ begDateAlert: false });

      this.setState({ endDate: endDate });
    }
  };

  //To keep track which button was clicked when passing date
  showCalendarFromBeg = (e) => {
    this.setState({
      showCalendar: true,
    });
  };

  showCalendarFromEnd = (e) => {};

  //Create the calendar to display
  renderTopCalHeader = () => {
    let month = months[moment(this.state.firstDay).month()];
    let year = moment(this.state.firstDay).year();

    return (
      <div
        className="row"
        style={{
          display: "flex",
          height: "40px",
        }}
      >
        <div
          className="col"
          style={{ display: "inline-block", margin: "auto" }}
        >
          <button
            className="websiteButton subtract-month"
            onClick={this.subMonth}
            style={{
              backgroundColor: "transparent",
              outline: "none",
            }}
          >
            <svg
              width="1.5em"
              height="1.5em"
              viewBox="0 0 16 16"
              class="bi bi-caret-left-fill"
              fill="#Ff7197"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3.86 8.753l5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
            </svg>
          </button>
        </div>

        <div
          className="col"
          style={{
            display: "inline-block",
            height: "100%",
            margin: "auto",
            fontSize: "20px",
          }}
        >
          <span>
            <b>{`${month} ${year}`}</b>
          </span>
        </div>
        <div
          className="col"
          style={{ display: "inline-block", margin: "auto" }}
        >
          <button
            className="websiteButton add-button"
            onClick={this.addMonth}
            style={{
              backgroundColor: "transparent",
              outline: "none",
            }}
          >
            <svg
              width="1.5em"
              height="1.5em"
              viewBox="0 0 16 16"
              class="bi bi-caret-right-fill"
              fill="#Ff7197"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  renderDaysHeader = () => {
    var blanks = [];
    var days = [];
    let daysHeader = this.weekdays.map((day, idx) => {
      if (idx == 0) {
        return (
          <div
            key={day}
            id={day}
            className=""
            style={{
              backgroundColor: "#Ff7197",
              color: "white",
              width: "60.03px",
            }}
          >
            <b>{day}</b>
          </div>
        );
      } else if (idx == 6) {
        return (
          <div
            key={day}
            id={day}
            className=""
            style={{
              backgroundColor: "#Ff7197",
              color: "white",
              width: "60.03px",
            }}
          >
            <b>{day}</b>
          </div>
        );
      }
      return (
        <div
          key={day}
          id={day}
          className=""
          style={{
            backgroundColor: "#Ff7197",
            color: "white",
            width: "60.03px",
          }}
        >
          <b>{day}</b>
        </div>
      );
    });
    //let dateObject = this.state.dateObject;
    let firstDay = this.state.firstDay;

    let firstDayNum = firstDay.format("d");
    for (let i = 0; i < firstDayNum; i++) {
      blanks.push(
        <div
          className="inline-block"
          style={{ width: "60.03px", height: "60.03px" }}
        >
          {""}
        </div>
      );
    }

    for (let j = 1; j < firstDay.daysInMonth() + 1; j++) {
      days.push(
        <div
          key={j}
          className="dateButton"
          style={{ width: "60.03px", height: "60.03px", display: "flex" }}
          onClick={(e) => this.passDate(j, e)}
        >
          <p style={{ margin: "auto" }}>
            <b>{j}</b>
          </p>
        </div>
      );
    }
    var totalSlots = [...blanks, ...days];
    let rows = [];
    let cells = [];
    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row); // if index not equal 7 that means not go to next week
      } else {
        rows.push(cells); // when reach next week we contain all td in last week to rows
        cells = []; // empty container
        cells.push(row); // in current loop we still push current row to new container
      }
      if (i === totalSlots.length - 1) {
        // when end loop we add remain date
        rows.push(cells);
      }
    });
    let daysinmonth = rows.map((d, i) => {
      return (
        <div className="row" style={{ display: "flex" }}>
          {d}
        </div>
      );
    });
    return (
      <div
        className="calendar-day"
        style={{
          border: "2px solid black",
          display: this.state.showCalendar ? "" : "none",
        }}
        onMouseEnter={(e) => {
          {
            this.setState({ insideCalendar: true });
          }
        }}
        onMouseLeave={(e) => {
          {
            this.setState({ insideCalendar: false });
          }
        }}
      >
        {this.renderTopCalHeader()}
        <div className="row" style={{ display: "flex" }}>
          {daysHeader}
        </div>
        {daysinmonth}
      </div>
    );
  };

  componentDidMount = () => {};

  removeShadow = (name) => {
    let shadows = this.state.attributes;
    let lst = shadows[name];
    lst[0] = true;
    shadows[name] = lst;
    this.setState({ attributes: shadows });
  };

  addShadow = (name) => {
    let shadows = this.state.attributes;
    let lst = shadows[name];
    lst[0] = false;
    shadows[name] = lst;
    this.setState({ attributes: shadows });
  };

  addQuant = (name, e) => {
    //let productOptions = this.state.weeklyOptions;
    let options = this.state.optionList;
    let quant = this.state.attributes;
    let lst = quant[name];
    options.push(<option>{name}</option>);
    /* if (typeof productOptions[name] != "undefined") {
      productOptions[name].push(<option>{name}</option>);
    } else {
      productOptions[name] = [<option>{name}</option>];
    } */

    lst[1] = lst[1] + 1;
    quant[name] = lst;
    this.setState({ attributes: quant });
    //this.setState({ weeklyOptions: productOptions });
    this.setState({ optionList: options });
  };

  delQuant = (name, e) => {
    //let productOptions = this.state.weeklyOptions;
    let options = this.state.optionList;
    if (typeof (options.indexOf(<option>{name}</option>) != undefined)) {
      let idx = options.indexOf(<option>{name}</option>);
      options.splice(idx, 1);
    }
    let quant = this.state.attributes;
    let lst = quant[name];
    /* if (typeof productOptions[name] != "undefined" && lst[1] > 0) {
      productOptions[name].pop();
    } */
    lst[1] = Math.max(0, lst[1] - 1);

    quant[name] = lst;
    this.setState({ attributes: quant });
    //this.setState({ weeklyOptions: productOptions });
    this.setState({ optionList: options });
  };

  displayProducts = () => {
    let dict = this.state.prodDict;

    var result = [];
    let keys = Object.keys(dict);
    let sortedKeys = keys.sort();
    var cardStyle = {};
    //let planDays = this.state.daysList;

    //Make html objects to be displayed for each product and their corresponding items.
    for (let i = 0; i < sortedKeys.length; i++) {
      let name = sortedKeys[i];
      let imgSrc = dict[name].url;
      let items = dict[name].items;

      let days = dict[name].days;
      var dispDays = [];
      var time = dict[name].time;
      var descript = dict[name].description;
      var isFav = dict[name].isFav ? "Yes" : "No";

      dispDays = days.reduce((string, day, idx, array) => {
        if (idx == array.length - 1) {
          return string + day;
        }
        return string + day + ", ";
      }, "");

      var timeRow = (
        <div className="row justify-content-md-center">{`Time: ${time}`}</div>
      );
      var isFavRow = (
        <div className="row justify-content-md-center">{`Favorite Meal? ${isFav}`}</div>
      );
      var descriptRow = (
        <div className="row justify-content-md-center">{`${descript}`}</div>
      );

      var count = 0;
      let displayedContent = items.map((lst) => {
        count += 1;
        return (
          <div
            className="row justify-content-md-center"
            style={{ marginBottom: "5px" }}
          >{`Item ${count}: ${lst["key"]["name"]},   Quantity: ${lst["key"]["quantity"]} ${lst["key"]["units"]} `}</div>
        );
      });

      if (this.state.attributes[name][0]) {
        cardStyle = {
          borderRadius: "10px",
          backgroundColor: "white",
          color: "white",
          position: "relative",
          marginBottom: "10px",
          boxShadow: "none",
        };
      } else {
        cardStyle = {
          borderRadius: "10px",
          backgroundColor: "white",
          color: "white",
          position: "relative",
          marginBottom: "10px",
          boxShadow: "3px 3px 12px 1px rgba(128, 128, 128, 0.8)",
        };
      }

      result.push(
        <div className="row" id={i} key={name} style={{ marginBottom: "50px" }}>
          <div className="col-4" style={{ textAlign: "center" }}>
            <div
              className=""
              id={name}
              onMouseEnter={(e) => {
                this.removeShadow(name, e);
              }}
              onMouseLeave={(e) => {
                this.addShadow(name, e);
              }}
              onClick={(e) => {
                this.addQuant(name, e);
              }}
              style={cardStyle}
            >
              <img
                id={imgSrc}
                src={imgSrc}
                style={{
                  width: "100%",
                  height: "175px",
                  borderRadius: "10px",
                }}
              ></img>
              <span className="notification-circle" style={circleStyle}>
                <p style={{ display: "inline-block", margin: "auto" }}>
                  {this.state.attributes[name][1]}
                </p>
              </span>

              <div
                style={{
                  top: "120px",
                  bottom: "0px",
                  position: "absolute",
                  backgroundColor: "black",
                  opacity: "0.6",
                  color: "white",
                  width: "100%",
                  padding: "10px",
                  borderRadius: "0 0 10px 10px",
                }}
              >
                {name}
              </div>
            </div>
            <button
              type="button"
              class="websiteButton"
              onClick={(e) => this.delQuant(name, e)}
              style={{
                fontSize: "12px",
                backgroundColor: "red",
                color: "white",
              }}
            >
              Delete Quantity
            </button>
          </div>
          <div className="col-8" style={{ display: "flex" }}>
            <div style={{ display: "inline-block", margin: "auto" }}>
              <div className="row justify-content-md-center">
                {displayedContent}
              </div>
              <div className="row justify-content-md-center">{`Days: ${dispDays}`}</div>
              {timeRow}
              {isFavRow}
              {descriptRow}
            </div>
          </div>
        </div>
      );
    }
    return result;
  };

  submitData = (e) => {
    e.preventDefault();

    let dict = this.state.prodDict;
    let lst = this.state.weeksList;
    var meals = [];
    var daysList = [];

    if (!foodRegExp.test(this.state.planName)) {
      alert("Give your plan a name");
    } else if (!descriptionRegExp.test(this.state.planDescription)) {
      alert("Give your product a description");
    } else if (
      !priceRegExp.test(this.state.planPrice) ||
      this.state.planPrice == ""
    ) {
      alert("Give a price for your plan");
    } else if (this.state.recurrenceAlert == true || this.state.numWeeks == 0) {
      alert("Give a valid answer for the number of weeks to sell your plan");
    } else if (this.state.begDate === "" || this.state.begDateAlert === true) {
      alert(`Give a valid beginning date for your plan's selling period`);
    } else if (this.state.numWeeks != this.state.weeksList.length) {
      alert("Assign all selected meals with a week");
    } else {
      for (let i = 0; i < lst.length; i++) {
        let mealName = lst[i];

        let meal = dict[mealName];

        meals.push(meal);
        let mealDays = meal.days;
        daysList.push(mealDays);
      }

      let flatList = daysList.flat();
      let finalDaysList = [...new Set(flatList)];

      let mealPlan = new MealPlan(
        this.state.planName,
        "Mola",
        this.state.planPrice,
        this.state.planDescription,
        finalDaysList,
        this.state.numWeeks,
        this.state.begDate,
        this.state.endDate,
        meals
      );

      let newMeals = mealPlan.meals.map((q) => mealConverter.toFirestore(q));
      mealPlan.meals = newMeals;

      //Convert the dictionary items into a list sorted by key

      db.collection("Restaurants")
        .doc("Mola")
        .collection("Plans")
        .doc(this.state.planName)
        .withConverter(planConverter)
        .set(mealPlan)
        .then(() => {
          window.location.reload(false);
        })

        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    }
  };

  handleChange(event) {}

  renderWeeklyOptions = () => {
    let count = this.state.numWeeks;
    var result = [];
    var options = [];

    for (let i = 0; i < count; i++) {
      let week = i + 1;

      result.push(
        <Row id={i}>
          <div class="form-group col-md-4">
            <label for="inputState">{`Week ${week}`}</label>
            <select
              id="inputState"
              class="form-control"
              onBlur={(e) => {
                this.getWeek(i, e);
              }}
            >
              {this.state.optionList}
            </select>
            <div
              id="product-alert"
              style={{
                textAlign: "center",
                color: "red",
                fontSize: "12px",
                display: this.state.weeksAlert[i] ? "block" : "none",
              }}
            >
              Please select a meal
            </div>
          </div>
        </Row>
      );
    }
    return result;
  };

  render() {
    if (this.state.hasLoaded == true) {
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
                                if (!foodRegExp.test(e.target.value)) {
                                  this.setState({ planNameAlert: true });
                                } else {
                                  this.setState({ planName: e.target.value });
                                  this.setState({ planNameAlert: false });
                                }
                              }}
                            />
                            <div
                              id="plan-name-alert"
                              style={{
                                textAlign: "center",
                                color: "red",
                                fontSize: "12px",
                                display: this.state.planNameAlert
                                  ? "block"
                                  : "none",
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
                            <label>Plan Description</label>
                            <Input
                              placeholder="An immersion into authentic Pittsburgh cuisine"
                              type="text"
                              onBlur={(e) => {
                                if (!descriptionRegExp.test(e.target.value)) {
                                  this.setState({ planDescriptionAlert: true });
                                } else {
                                  this.setState({
                                    planDescriptionAlert: false,
                                  });
                                  this.setState({
                                    planDescription: e.target.value,
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
                                display: this.state.planDescriptionAlert
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
                        <Col
                          className="pr-1"
                          md="5"
                          style={{ marginRight: "10px" }}
                        >
                          <FormGroup>
                            <label>Price</label>
                            <Input
                              placeholder="59.99"
                              type="text"
                              onBlur={(e) => {
                                if (!priceRegExp.test(e.target.value)) {
                                  this.setState({ planPriceAlert: true });
                                } else {
                                  this.setState({ planPriceAlert: false });
                                  this.setState({ planPrice: e.target.value });
                                }
                              }}
                            />
                            <div
                              id="price-alert"
                              style={{
                                textAlign: "center",
                                color: "red",
                                fontSize: "12px",
                                display: this.state.planPriceAlert
                                  ? "block"
                                  : "none",
                              }}
                            >
                              Please enter a valid price
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="10" style={{ display: "flex" }}>
                          <FormGroup>
                            <label>
                              How long (in weeks) will this plan be featured?
                            </label>
                            <Input
                              type="number"
                              step="1"
                              onBlur={(e) => {
                                if (!numRegExp.test(e.target.value)) {
                                  this.setState({ recurrenceAlert: true });
                                } else {
                                  this.setState({ recurrenceAlert: false });
                                  this.setState({
                                    numWeeks: e.target.value,
                                  });
                                }
                              }}
                            />
                            <div
                              id="recurrence-alert"
                              style={{
                                textAlign: "center",
                                color: "red",
                                fontSize: "12px",
                                display: this.state.recurrenceAlert
                                  ? "block"
                                  : "none",
                              }}
                            >
                              Please enter a number greater than zero
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>{this.renderDateTabs()}</Row>
                      <Row
                        style={{
                          textAlign: "center",
                          marginTop: "50px",
                          marginBottom: "50px",
                          display: "flex",
                        }}
                      >
                        <div
                          style={{ display: "inline-block", margin: "auto" }}
                        >
                          {this.renderDaysHeader()}
                        </div>
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

                      <div className="row" style={{ marginBottom: "50px" }}>
                        <div className="col-4" style={{ textAlign: "center" }}>
                          <b>Products</b>
                        </div>
                        <div className="col-8" style={{ textAlign: "center" }}>
                          <b>Supplemental Items</b>
                        </div>
                      </div>
                      <hr />
                      {this.displayProducts()}
                      <hr />
                      {this.renderWeeklyOptions()}
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
    } else {
      return (
        <div
          style={{
            position: "absolute",
            top: "40vh",
            left: "50%",
            textAlign: "center",
          }}
        >
          <img src={logo} style={{ width: "125px", height: "auto" }}></img>
          <figcaption style={{ marginTop: "50px" }}>Loading...</figcaption>
        </div>
      );
    }
  }
}

export default User;
