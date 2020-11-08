import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

import image from "./../assets/img/Sushi.jpg";

import "./../assets/css/buttons.css";

const cardStyle = {
  borderRadius: "10px",
  backgroundColor: "white",
  color: "white",
  position: "relative",
  marginBottom: "10px",
  boxShadow: "none",
};

class MealPopup extends Component {
  constructor(props) {
    super(props);
    this.state = { captionHeight: "200px", captionText: "Sushi" };

    this.onClose = this.onClose.bind(this);

    this.focusInformation = this.focusInformation.bind(this);
    this.unFocusInformation = this.unFocusInformation.bind(this);
  }

  //This function is to enlarge the caption space for more information about each individual product
  focusInformation = (e) => {
    this.setState({ captionHeight: "500px" });
    this.setState({
      captionText: (
        <table class="table" style={{ color: "white" }}>
          <thead>
            <tr>
              <th scope="col">Item Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Units</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Bubble Tea</td>
              <td>16</td>
              <td>fl oz</td>
            </tr>
            <tr>
              <td>Soy Sauce</td>
              <td>6</td>
              <td>fl oz</td>
            </tr>
          </tbody>
        </table>
      ),
    });
  };

  //Shrink caption space when mouse leaves
  unFocusInformation = (e) => {
    this.setState({ captionHeight: "200px" });
    this.setState({ captionText: "Sushi" });
  };

  onClose = (e) => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body
          style={{
            display: "",
            textAlign: "center",
            width: "800px",
            height: "700px",
            paddingTop: "50px",
          }}
        >
          <div className="" style={cardStyle}>
            <img
              src={image}
              style={{
                width: "531.81px",
                height: "531.81px",
                borderRadius: "10px",
              }}
            ></img>
            <div
              style={{
                position: "absolute",
                width: "531.81px",
                height: this.state.captionHeight,
                left: "118.1px",
                bottom: "0px",
                backgroundColor: "black",
                opacity: "0.6",
                color: "white",

                fontSize: "35px",
                display: "flex",
                fontFamily: "Montserrat",

                borderRadius: "0 0 10px 10px",
              }}
              onMouseEnter={this.focusInformation}
              onMouseLeave={this.unFocusInformation}
            >
              <p style={{ margin: "auto" }}>{this.state.captionText}</p>
            </div>
          </div>

          <div
            className="mealButton"
            style={{ width: "200px", marginTop: "30px" }}
            onClick={this.onClose}
          >
            <p style={{ margin: "auto" }}>Close</p>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default MealPopup;
