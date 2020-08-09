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
    let parentElem = document.getElementsByClassName("main-panel ps");
    let targetElem = document.getElementsByClassName(
      "navbar-absolute navbar navbar-expand-lg"
    );

    if (typeof parentElem[0] != "undefined") {
      let parentWidth = parentElem[0].getBoundingClientRect().width;
      targetElem[0].style.width = parentWidth + "px";
      this.setState({ parentWidth: parentWidth + "px" });
    }
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
    window.addEventListener("scroll", this.scrollFunction.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.getParentWidth.bind(this));
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
          zIndex: "10",
          margin: "auto",
          position: "fixed",
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
                    class="bi bi-bell"
                    fill="#Ff7197"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2z" />
                    <path
                      fill-rule="evenodd"
                      d="M8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"
                    />
                  </svg>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem tag="a" href="/">
                    Notifications
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
