/*
    This page is to display the active products the restaurant has 
*/

import React, { Component, Fragment } from "react";

import MealPopup from "./MealPopup.js";

import { Table } from "reactstrap";
import { JsxEmit } from "typescript";

import '../assets/css/scrollClass.css';
import { sub } from "date-fns";

const exDays = ["M", "W", "F"];

var scrollPos = 0;



class CurrentProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exDict: {
        "Taste of Japan": {
          Sushi: { shouldShow: false },
          "Teriyaki Salmon": { shouldShow: false },
          "Fish and Rice": { shouldShow: false },
          "Adana Kebab": { shouldShow: false },
        },
      },
      parentWidth: '',
      isHovering: false,
      scrollThumbHeight: 0,
      scrollTopPos: 0,
    };
    this.renderTable = this.renderTable.bind(this);
    this.renderAvailDays = this.renderAvailDays.bind(this);
    this.renderAvailProds = this.renderAvailProds.bind(this);
    this.showPopUp = this.showPopUp.bind(this);
    this.renderTableHeaders = this.renderTableHeaders.bind(this);
    this.getScrollDiff = this.getScrollDiff.bind(this);
  }

  //This is to toggle whether to show a meal products popup for more information
  showPopUp = (plan, product) => {
    let dict = this.state.exDict;
    dict[plan][product]["shouldShow"] = !dict[plan][product]["shouldShow"];
    this.setState({ exDict: dict });
  };

  //This function is to make a table header with appropriate widhs for each title
  renderTableHeaders = () => {
    let titles = ['Plan Name', 'Start Date', 'End Date', '# Weeks', 'Days', 'Products', 'Price', 'Delete?'];
    var columns = [];
    for (let i = 0; i < titles.length; i++) {
      switch (titles[i]) {
        case 'Plan Name':
          var divElem = <div className='title' style={{ width: '150px', display: 'flex' }}><p style={{ color: '#73667D', margin: 'auto', fontSize: '18px', font: 'Montserrat', fontWeight: 'bold' }}>{titles[i]}</p></div>
          columns.push(divElem);
          break;

        case 'Start Date':
          var divElem = <div className='title' style={{ width: '125px', display: 'flex' }}><p style={{ color: '#73667D', fontSize: '18px', margin: 'auto', font: 'Montserrat', fontWeight: 'bold' }}>{titles[i]}</p></div>
          columns.push(divElem);
          break;

        case 'End Date':
          var divElem = <div className='title' style={{ width: '125px', display: 'flex' }}><p style={{ color: '#73667D', fontSize: '18px', margin: 'auto', font: 'Montserrat', fontWeight: 'bold' }}>{titles[i]}</p></div>
          columns.push(divElem);
          break;

        case '# Weeks':

          var divElem = <div className='title' style={{ width: '125px', display: 'flex' }}><p style={{ color: '#73667D', fontSize: '18px', margin: 'auto', font: 'Montserrat', fontWeight: 'bold' }}>{titles[i]}</p></div>
          columns.push(divElem);
          break;

        case 'Days':

          var divElem = <div className='title' style={{ width: '300px', display: 'flex' }}><p style={{ color: '#73667D', fontSize: '18px', margin: 'auto', font: 'Montserrat', fontWeight: 'bold' }}>{titles[i]}</p></div>
          columns.push(divElem);
          break;

        case 'Products':

          var divElem = <div className='title' style={{ width: '200px', display: 'flex' }}><p style={{ color: '#73667D', fontSize: '18px', margin: 'auto', font: 'Montserrat', fontWeight: 'bold' }}>{titles[i]}</p></div>
          columns.push(divElem);
          break;

        case 'Price':

          var divElem = <div className='title' style={{ width: '100px', display: 'flex' }}><p style={{ color: '#73667D', fontSize: '18px', margin: 'auto', font: 'Montserrat', fontWeight: 'bold' }}>{titles[i]}</p></div>
          columns.push(divElem);
          break;
        case 'Delete?':

          var divElem = <div className='title' style={{ width: '100px', display: 'flex' }}><p style={{ color: '#73667D', fontSize: '18px', margin: 'auto', font: 'Montserrat', fontWeight: 'bold' }}>{titles[i]}</p></div>
          columns.push(divElem);
          break;
        default:
          continue;



      }
    }
    return columns;

  }



  //Set the width of the table to fit the scroll bar on the left
  getParentWidth = () => {
    let sideWidth = document
      .getElementsByClassName("sidebar")[0]
      .getBoundingClientRect().width;


    let newWidth = window.innerWidth - sideWidth - 50;

    this.setState({ parentWidth: newWidth });
  };


  //Determine the scroll position
  getScrollDiff = (e) => {
    
    let numRows = document.getElementsByClassName('row product').length;
    let rowHeight = document.getElementsByClassName('row product')[0].getBoundingClientRect().height;
    let clientHeight = document.getElementsByClassName('currentProductsChart')[0].getBoundingClientRect().height;
    let scrollHeight = rowHeight * numRows + 50;
    var newScrollPos = e.target.scrollTop;
    this.setState({scrollTopPos: (newScrollPos/scrollHeight) * clientHeight});
    scrollPos = newScrollPos;

  }

  componentDidMount() {
    window.addEventListener("resize", this.getParentWidth.bind(this));

    let sideWidth = document
      .getElementsByClassName("sidebar")[0]
      .getBoundingClientRect().width;

    let newWidth = window.innerWidth - sideWidth - 50;



    this.setState({ parentWidth: newWidth });

    let wrapper = document.getElementsByClassName('wrapper')[0];
    wrapper.style['min-width'] = '1318.75px';

    let numRows = document.getElementsByClassName('row product').length;
    let rowHeight = document.getElementsByClassName('row product')[0].getBoundingClientRect().height;
    let scrollHeight = rowHeight * numRows + 50;
    let subWindow = document.getElementsByClassName('currentProductsChart')[0];
    let clientHeight = document.getElementsByClassName('currentProductsChart')[0].getBoundingClientRect().height;
    let scrollThumbHeight = (clientHeight/scrollHeight) * clientHeight;

    this.setState({scrollThumbHeight: scrollThumbHeight});
    subWindow.addEventListener('scroll', e => this.getScrollDiff(e));



  }

  
  //Simply remove any event listeners
  componentWillUnmount = () => {
    let wrapper = document.getElementsByClassName('wrapper')[0];
    wrapper.style['min-width'] = '';
    let subWindow = document.getElementsByClassName('currentProductsChart')[0];
    subWindow.removeEventListener('scroll',  e => this.getScrollDiff(e));
    window.removeEventListener('resize', this.getParentWidth)
  }

  //Render the constitutive products of each meal plan
  renderAvailProds = () => {
    var rows = [];
    var meals = ["Sushi", "Teriyaki Salmon", "Fish and Rice", "Adana Kebab"];
    for (let i = 0; i < meals.length; i++) {
      var currRow = (
        <div
          className="row"
          style={{
            margin: "auto",
            display: "flex",
            textAlign: "center",


            marginBottom: "10px",
          }}
        >
          <div
            className="mealButton"
            onClick={(e) => this.showPopUp("Taste of Japan", meals[i], e)}
          >
            <p style={{ margin: "auto", fontFamily: 'Montserrat', fontWeight: 'bold' }}>{meals[i]}</p>
          </div>
          <MealPopup
            show={this.state.exDict["Taste of Japan"][meals[i]]["shouldShow"]}
            onClose={(e) => this.showPopUp("Taste of Japan", meals[i], e)}
          />
        </div>
      );
      rows.push(currRow);
    }
    return rows;
  };

  //Highlight the days in which the meal plan is delivered with pink
  renderAvailDays = () => {
    var cols = [];
    let days = ["S", "M", "T", "W", "Th", "F", "Sa"];
    for (let i = 0; i < days.length; i++) {
      let day = days[i];
      var dayCol;
      if (exDays.includes(day)) {
        dayCol = (
          <div
            className="col"
            style={{
              color: "#Ff7197",
              backgroundColor: "transparent",
              width: "10px",
              padding: "0",
              fontWeight: "bold",
            }}
          >
            <b>{day}</b>
          </div>
        );
      }
      if (!exDays.includes(day)) {
        dayCol = (
          <div
            className="col"
            style={{
              color: "#d3d3d3",
              backgroundColor: "transparent",
              width: "30px",
              padding: "0",
              fontWeight: "bold",
            }}
          >
            <b>{day}</b>
          </div>
        );
      }

      cols.push(dayCol);
    }

    return <div className="row">{cols}</div>;
  };

  //Main table to display all the current meal plans of the restaurant
  renderTable = () => {
    return (
      <div className="content" style={{}}>


        <div className='row' style={{ backgroundColor: 'white', height: '100px', borderRadius: '50px', minWidth: '1250px', boxShadow: '2px 2px 7px 0 rgba(0,0,0,0.3)' }}>
          {this.renderTableHeaders()}
        </div>

        <div style={{ display: 'flex', marginTop: '25px', position: 'relative' }}>

          <div className='currentProductsChart' 
            onMouseEnter={() => this.setState({ isHovering: true })}
            onMouseLeave={() => this.setState({ isHovering: false })}>



            <div className='row product' style={{}}>
              <div style={{ margin: "auto", textAlign: "center", width: '195px' }}>
                Taste of Japan
              </div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>9/1/2020</div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>10/1/2020</div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>4</div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>
                {this.renderAvailDays()}
              </div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>
                {this.renderAvailProds()}
              </div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>$100.00</div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>Yes</div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>{""}</div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>{""}</div>
            </div>
            <div className='row product' style={{}}>
              <div style={{ margin: "auto", textAlign: "center", width: '195px' }}>
                Taste of Japan
              </div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>9/1/2020</div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>10/1/2020</div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>4</div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>
                {this.renderAvailDays()}
              </div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>
                {this.renderAvailProds()}
              </div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>$100.00</div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>Yes</div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>{""}</div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>{""}</div>
            </div>
            <div className='row product' style={{}}>
              <div style={{ margin: "auto", textAlign: "center", width: '195px' }}>
                Taste of Japan
              </div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>9/1/2020</div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>10/1/2020</div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>4</div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>
                {this.renderAvailDays()}
              </div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>
                {this.renderAvailProds()}
              </div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>$100.00</div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>Yes</div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>{""}</div>
              <div className='' style={{ margin: "auto", textAlign: "center", width: '195px' }}>{""}</div>
            </div>





          </div>
          <div className='scroll-bar'
            onMouseEnter={() => this.setState({ isHovering: true })}
            onMouseLeave={() => this.setState({ isHovering: false })}
            onMouseDown={(e) => {e.preventDefault(); e.stopPropagation();this.setState({scrollTopPos: e.clientY})}}

            style={{ opacity: this.state.isHovering ? 1 : 0 }}>
            <div
              className="thumb"
              style={{ height: this.state.scrollThumbHeight, top: this.state.scrollTopPos}}
            />
          </div>
        </div>
      </div>
    );
  };
  render() {
    return this.renderTable();
  }
}

export default CurrentProducts;
