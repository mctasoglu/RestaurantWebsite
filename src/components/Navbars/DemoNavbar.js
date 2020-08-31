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
import { Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input,
} from "reactstrap";

import routes from "routes.js";
import subRoutes from "subRoutes";

import firebase from "firebase.js";

var lastScroll = 0;

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      dropdownOpen: false,
      color: "transparent",
      parentWidth: "",
    };
    this.toggle = this.toggle.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.sidebarToggle = React.createRef();
  }
  toggle() {
    if (this.state.isOpen) {
      this.setState({
        color: "transparent",
      });
    } else {
      this.setState({
        color: "dark",
      });
    }
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  dropdownToggle(e) {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  getParentWidth = () => {
    let sideWidth = document
      .getElementsByClassName("sidebar")[0]
      .getBoundingClientRect().width;
    let sideBar = document.getElementsByClassName("sidebar")[0];

    let newWidth = window.innerWidth - sideWidth;

    this.setState({ parentWidth: newWidth });
  };

  scrollFunction = () => {
    let nav = document.getElementsByClassName(
      "navbar-absolute navbar navbar-expand-lg"
    )[0];
    var st = window.pageYOffset || document.documentElement.scrollTop;

    if (st > 200) {
      nav.style.opacity = "0";
    }
    if (st < lastScroll) {
      nav.style.opacity = "1";
    }
    lastScroll = st <= 0 ? 0 : st;
  };

  getBrand() {
    let brandName = "Default Brand";
    routes.map((prop, key) => {
      if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
        brandName = prop.name;
      }
      return null;
    });
    subRoutes.map((prop, key) => {
      if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
        brandName = prop.name;
      }

      return null;
    });

    return brandName;
  }
  openSidebar() {
    document.documentElement.classList.toggle("nav-open");
    this.sidebarToggle.current.classList.toggle("toggled");
  }

  componentDidMount() {
    window.addEventListener("resize", this.getParentWidth.bind(this));

    let sideWidth = document
      .getElementsByClassName("sidebar")[0]
      .getBoundingClientRect().width;

    let newWidth = window.innerWidth - sideWidth;

    this.setState({ parentWidth: newWidth });

    window.addEventListener("scroll", this.scrollFunction.bind(this));
  }

  componentWillUnmount() {
    //window.removeEventListener("resize", this.getParentWidth.bind(this));
    window.removeEventListener("scroll", this.scrollFunction.bind(this));
  }
  componentDidUpdate(e) {
    if (
      window.innerWidth < 993 &&
      e.history.location.pathname !== e.location.pathname &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      this.sidebarToggle.current.classList.toggle("toggled");
    }
  }
  render() {
    return (
      // add or remove classes depending if we are on full-screen-maps page or not
      <Navbar
        expand="lg"
        className={
          this.props.location.pathname.indexOf("full-screen-maps") !== -1
            ? "navbar-absolute"
            : "navbar-absolute"
        }
        style={{
          backgroundColor: "#f4f3ef",
          //zIndex: "10",
          position: "fixed",
          margin: "auto",
          width: this.state.parentWidth,

          borderBottom: "1px solid #ddd",
        }}
      >
        <Container fluid>
          <div className="navbar-wrapper">
            <NavbarBrand href="/" style={{ color: "#Ff7197" }}>
              {this.getBrand()}
            </NavbarBrand>
          </div>

          <Collapse
            isOpen={this.state.isOpen}
            navbar
            className="justify-content-end"
          >
            <div
              className="navbar-wrapper m-auto"
              style={{
                display: this.getBrand() == "Dashboard" ? "block" : "none",
              }}
            >
              <NavbarBrand style={{ color: "#Ff7197", fontSize: "30px" }}>
                Welcome Mola!
              </NavbarBrand>
            </div>
            <Nav navbar>
              <Dropdown
                nav
                isOpen={this.state.dropdownOpen}
                toggle={(e) => this.dropdownToggle(e)}
              >
                <DropdownToggle caret nav style={{ color: "#Ff7197" }}>
                  <svg
                    width="2em"
                    height="2em"
                    viewBox="0 0 16 16"
                    class="bi bi-power"
                    fill="#FF7197"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.578 4.437a5 5 0 1 0 4.922.044l.5-.866a6 6 0 1 1-5.908-.053l.486.875z"
                    />
                    <path fill-rule="evenodd" d="M7.5 8V1h1v7h-1z" />
                  </svg>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem
                    tag="a"
                    href="/"
                    onClick={(e) => {
                      firebase
                        .auth()
                        .signOut()
                        .then(function () {
                          // Sign-out successful.
                        })
                        .catch(function (error) {
                          // An error happened.
                        });
                    }}
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default Header;
