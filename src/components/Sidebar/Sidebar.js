/*!

Sidebar

*/
import React from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "reactstrap";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import BannerLogo from "../../assets/img/logo_word.png";

var ps;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.activeRoute.bind(this);
    this.sidebar = React.createRef();
    this.state = { Orders: false, Products: false };
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }

  showMenu = (e) => {
    let currClass = e.target;
    let currClassList = e.target.classList;
    var parentClass = "";

    if (currClassList[0] == "nav-link") {
      parentClass = currClass.parentNode;
    } else {
      let tempClass = currClass.parentNode;

      parentClass = tempClass.parentNode;
    }

    let subDiv = parentClass.childNodes[1];

    //To control when to display the sublists found under some links in the sidebar

    if (subDiv.id != "none") {
      if (subDiv.id == "Orders") {
        this.setState({ Orders: true });
        this.setState({ Products: false });
      } else if (subDiv.id == "Products") {
        this.setState({ Products: true });
        this.setState({ Orders: false });
      }
    } else {
      this.setState({ Orders: false });
      this.setState({ Products: false });
    }
  };

  render() {
    return (
      <div
        className="sidebar"
        data-color={this.props.bgColor}
        data-active-color={this.props.activeColor}
      >
        <div className="logo" style={{ marginLeft: "10px" }}>
          <span>
            <a href="#">
              <img
                src={BannerLogo}
                style={{
                  width: "65%",
                  height: "auto",

                  marginTop: "20px",
                }}
              ></img>
            </a>
          </span>
        </div>
        <div className="sidebar-wrapper" ref={this.sidebar}>
          <Nav>
            {this.props.routes.map((prop, key) => {
              return (
                <li
                  className={
                    this.activeRoute(prop.path) +
                    (prop.pro ? " active-pro" : "")
                  }
                  key={key}
                >
                  <NavLink
                    to={prop.layout + prop.path}
                    className="nav-link"
                    activeClassName="active"
                    style={{ color: "white", fontFamily: "Montserrat" }}
                    onClick={this.showMenu}
                  >
                    {prop.icon}
                    <b
                      style={{
                        display: "inline-block",
                        marginLeft: "10px",
                        fontSize: "14px",
                        verticalAlign: "middle",
                      }}
                    >
                      {prop.name}
                    </b>
                  </NavLink>

                  <div
                    style={{
                      color: "pink",
                      textAlign: "center",
                    }}
                    id={prop.hasSublist ? prop.name : "none"}
                  >
                    <div
                      className="subList"
                      style={{
                        display: this.state[prop.name] ? "block" : "none",
                      }}
                    >
                      {prop.subList}
                    </div>
                  </div>
                </li>
              );
            })}
          </Nav>
        </div>
      </div>
    );
  }
}

export default Sidebar;
