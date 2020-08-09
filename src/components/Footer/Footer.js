/*!

This is for the footer of the page

*/

import React from "react";
import { Container, Row } from "reactstrap";
// used for making the prop types of this component
import PropTypes from "prop-types";
import Logo from "../../assets/img/chutoro_fish.png";

class Footer extends React.Component {
  render() {
    return (
      <footer
        className={"footer" + (this.props.default ? " footer-default" : "")}
      >
        <Container fluid={this.props.fluid ? true : false}>
          <Row>
            <div className="m-auto">
              <div
                className="copyright"
                style={{ height: "25px", fontSize: "15px" }}
              >
                <img
                  src={Logo}
                  style={{ height: "100%", width: "auto", marginRight: "5px" }}
                ></img>
                &copy; {1900 + new Date().getYear()}, Chutoro, LLC
              </div>
            </div>
          </Row>
        </Container>
      </footer>
    );
  }
}

Footer.propTypes = {
  default: PropTypes.bool,
  fluid: PropTypes.bool,
};

export default Footer;
