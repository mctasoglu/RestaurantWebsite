/*!

Used to create the calendar

*/
import React from "react";

import Popup from "views/foodPopup.js";

import Sushi from "../assets/img/Sushi.jpg";

import {
  format,
  compareAsc,
  subMonths,
  getMonth,
  addMonths,
  addDays,
  startOfWeek,
  getDay,
  addWeeks,
  subWeeks,
} from "date-fns";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    const getDaysDict = () => {
      var daysDict = {};
      let initDay = startOfWeek(new Date());
      for (let i = 0; i < 5; i++) {
        let currDay = addDays(initDay, i);
        daysDict[currDay] = {
          "2 PM": ["Sushi", 4, false],
          "4 PM": ["Sandwich", 3, false],
        };
      }
      return daysDict;
    };
    this.state = {
      selectedDate: startOfWeek(new Date()),
      weekNum: 0,
      daysArray: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      weekMeals: getDaysDict(),
      count: 0,
    };
  }

  componentDidMount = () => {};

  //CSS style for circles
  circleStyle = {
    height: "25px",
    width: "25px",
    top: "-8px",
    left: "-8px",
    backgroundColor: "red",
    borderRadius: "100%",
    display: "inline-block",
    position: "absolute",
    color: "white",
  };

  //CSS style for cards
  cardStyle = {
    borderRadius: "10px",
    backgroundColor: "white",
    color: "white",
    position: "relative",
    marginBottom: "50px",

    boxShadow: "4px 4px 12px 2px rgba(0, 0, 0, 0.4)",
  };

  renderHeader() {
    const dateFormat = "MMMM yyyy";

    return (
      <div className="container-fluid" style={{ textAlign: "center" }}>
        <div className="header row flex-middle">
          <div
            className="col"
            style={{ display: "inline-block", margin: "auto" }}
          >
            <button
              className="websiteButton"
              onClick={() => {
                this.setState({
                  selectedDate: subWeeks(this.state.selectedDate, 1),
                  weekNum: this.state.weekNum - 1,
                });
              }}
              style={{
                backgroundColor: "transparent",
                outline: "none",
              }}
            >
              <svg
                width="2em"
                height="2em"
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
              fontSize: "25px",
            }}
          >
            <div className="col" style={{ marginBottom: "20px" }}>
              <span>{format(this.state.selectedDate, dateFormat)}</span>
            </div>
            <div className="col">
              <span
                className="badge"
                style={{ backgroundColor: "#777", color: "white" }}
              >
                Week {this.state.weekNum}
              </span>
            </div>
          </div>
          <div
            className="col"
            style={{ display: "inline-block", margin: "auto" }}
          >
            <button
              className="websiteButton"
              onClick={(e) => {
                this.setState({
                  selectedDate: addWeeks(this.state.selectedDate, 1),
                  weekNum: this.state.weekNum + 1,
                });
              }}
              style={{
                backgroundColor: "transparent",
                outline: "none",
              }}
            >
              <svg
                width="2em"
                height="2em"
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
      </div>
    );
  }

  showShadow = (id) => {
    let target = document.getElementById(id);

    target.style.boxShadow =
      "10px 10px 0px 0px rgba(0, 0, 0, 0.2), 0 10px 10px 0 rgba(0, 0, 0, 0.19)";
  };

  disappearShadow = (id) => {
    let target = document.getElementById(id);

    target.style.boxShadow = "";
  };

  //Create a card structure for each meal item available in the week
  renderDailyMeals(key) {
    let value = this.state.weekMeals[key];
    let newMeals = this.state.weekMeals;
    var dailyMeals = [];

    let formattedDate = format(key, "MM/dd/yyyy");

    for (const time in value) {
      let mealList = value[time];
      let food = mealList[0];
      let quant = mealList[1];
      let id = formattedDate + " " + time;

      dailyMeals.push(
        <div
          key={id}
          id={id}
          className=""
          style={this.cardStyle}
          onMouseEnter={(e) => this.disappearShadow(id, e)}
          onMouseLeave={(e) => this.showShadow(id, e)}
        >
          <img
            id="mealImage"
            src={Sushi}
            style={{ borderRadius: "10px" }}
          ></img>
          <span className="notification-circle" style={this.circleStyle}>
            {quant}
          </span>
          <div
            style={{
              top: "100px",
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
            {food}
          </div>
          <div
            className="card-img-overlay btn"
            type="button"
            style={{ opacity: "0", margin: "0", padding: "0" }}
            onClick={() => {
              newMeals[key][time][2] = true;
              this.setState({ weekMeals: newMeals });
              document.getElementById(id).style.boxShadow =
                "10px 10px 0px 0px rgba(0, 0, 0, 0.2), 0 10px 10px 0 rgba(0, 0, 0, 0.19)";
            }}
          ></div>
          <Popup
            show={this.state.weekMeals[key][time][2]}
            meal={food}
            quantity={quant}
            time={time}
            onHide={() => {
              newMeals[key][time][2] = false;
              this.setState({ weekMeals: newMeals });
            }}
          />
        </div>
      );
    }

    return (
      <div
        style={{
          margin: "auto",
          display: "block",
        }}
      >
        {dailyMeals}
      </div>
    );
  }

  renderDays() {
    const dateFormat = "dd";
    let weeklyMeals = this.state.weekMeals;

    var currDay = "";
    const days = [];
    let startDate = this.state.selectedDate;
    for (let i = 0; i < 7; i++) {
      currDay = addDays(startDate, i);
      var rightBorder = "";
      var dailyMeals = "";
      if (i < 6) {
        rightBorder = "1px solid #eee";
      }

      if (currDay in weeklyMeals) {
        dailyMeals = this.renderDailyMeals(currDay);
      }

      days.push(
        <div
          className="col col-center"
          key={currDay}
          style={{
            fontSize: "15px",
            borderRight: rightBorder,
            height: "1000px",
          }}
        >
          <div>{this.state.daysArray[getDay(currDay)]}</div>
          <br />
          <div>{format(currDay, dateFormat)}</div>
          <div
            className="container"
            style={{
              //display: "flex",
              paddingTop: "50px",
              height: "934.37px",
              paddingRight: "0px",
              paddingLeft: "0px",
            }}
          >
            {dailyMeals}
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="days row">{days}</div>
      </div>
    );
  }

  render() {
    return (
      <>
        <div className="content">
          <div className="calendar">
            {this.renderHeader()}
            {this.renderDays()}
          </div>
        </div>
      </>
    );
  }
}

export default Dashboard;
