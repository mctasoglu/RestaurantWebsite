import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

class Popup extends Component {
  constructor(props) {
    super(props);

    this.state = { mealName: this.props.mealInfo };
  }
  render() {
    return (
      <Modal
        {...this.props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body style={{ display: "flex", textAlign: "center" }}>
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Item</th>
                <th scope="col">Quantity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{this.props.time}</td>
                <td>
                  <b>{this.props.meal}</b>
                </td>
                <td>
                  <b>{this.props.quantity}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Popup;
