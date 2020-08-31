import React, { Component } from "react";

import { Table } from "reactstrap";

class CurrentProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderTable = this.renderTable.bind(this);
  }

  renderTable = () => {
    return (
      <div className="content">
        <div
          className="header"
          style={{ margin: "auto", fontSize: "24px", width: "200px" }}
        >
          Current Plans
        </div>

        <Table style={{ marginTop: "50px" }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Plan Name</th>
              <th>Last Name</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  };
  render() {
    return this.renderTable();
  }
}

export default CurrentProducts;
