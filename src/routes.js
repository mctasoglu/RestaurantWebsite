/*!

Displays relevant information for each page such as component and path to create the routing in Admin.js. Also used to edit the style of the links in the sidebar.
*/
import Dashboard from "views/Dashboard.js";
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Nav, NavLink } from "reactstrap";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
import Typography from "views/Typography.js";
import TableList from "views/Tables.js";
import Maps from "views/Map.js";
import UserPage from "views/User.js";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: (
      <svg
        width="2em"
        height="2em"
        viewBox="0 0 16 16"
        class="bi bi-house"
        fill="#FF7197"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: "inline-block",
          margin: "auto",
          verticalAlign: "middle",
        }}
      >
        <path
          fill-rule="evenodd"
          d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"
        />
        <path
          fill-rule="evenodd"
          d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"
        />
      </svg>
    ),
    component: Dashboard,
    layout: "/admin",
    subList: <ul></ul>,
    hasSublist: false,
  },
  {
    path: "/Orders",
    name: "Orders",
    icon: (
      <svg
        width="2em"
        height="2em"
        viewBox="0 0 16 16"
        class="bi bi-cart"
        fill="#FF7197"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
        />
      </svg>
    ),
    component: Icons,
    layout: "/admin",
    subList: (
      <div>
        <ul className="list-group">
          <li className="m-2">
            <Link
              to="/admin/pending-orders"
              className="nav-link"
              activeClassName="active"
              style={{ color: "white", margin: "0px", padding: "0px" }}
            >
              <p>Pending Orders</p>
            </Link>
          </li>

          <li className="m-2">
            <Link
              to="/admin/completed-orders"
              className="nav-link"
              activeClassName="active"
              style={{ color: "white", margin: "0px", padding: "0px" }}
            >
              <p>Completed Orders</p>
            </Link>
          </li>
        </ul>
      </div>
    ),
    hasSublist: true,
  },

  {
    path: "/maps",
    name: "Products",
    icon: (
      <svg
        width="2em"
        height="2em"
        viewBox="0 0 16 16"
        class="bi bi-clipboard-data"
        fill="#FF7197"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"
        />
        <path
          fill-rule="evenodd"
          d="M9.5 1h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"
        />
        <path d="M4 11a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0v-1zm6-4a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V7zM7 9a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0V9z" />
      </svg>
    ),
    component: Maps,
    layout: "/admin",
    subList: (
      <ul className="list-group">
        <li className="m-2">
          <Link
            to="/admin/current-meals"
            className="nav-link"
            activeClassName="active"
            style={{ color: "white", margin: "0px", padding: "0px" }}
          >
            <p>Current Products</p>
          </Link>
        </li>

        <li className="m-2">
          <Link
            to="/admin/add-a-new-product"
            className="nav-link"
            activeClassName="active"
            style={{ color: "white", margin: "0px", padding: "0px" }}
          >
            <p>Add a New Product</p>
          </Link>
        </li>
        <li className="m-2">
          <Link
            to="/admin/add-a-new-plan"
            className="nav-link"
            activeClassName="active"
            style={{ color: "white", margin: "0px", padding: "0px" }}
          >
            <p>Add a New Plan</p>
          </Link>
        </li>
      </ul>
    ),
    hasSublist: true,
  },
  {
    path: "/Subscriptions",
    name: "Subscriptions",
    icon: (
      <svg
        width="2em"
        height="2em"
        viewBox="0 0 16 16"
        class="bi bi-people-fill"
        fill="#FF7197"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
        />
      </svg>
    ),
    component: Notifications,
    layout: "/admin",
    subList: <ul></ul>,
    hasSublist: false,
  },
  {
    path: "/Notifications",
    name: "Notifications",
    icon: (
      <svg
        width="2em"
        height="2em"
        viewBox="0 0 16 16"
        class="bi bi-exclamation-circle"
        fill="#FF7197"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
        />
        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
      </svg>
    ),
    component: Typography,
    layout: "/admin",
    subList: <ul></ul>,
    hasSublist: false,
  },
  {
    path: "/user-page",
    name: "Restaurant Profile",
    icon: (
      <svg
        width="2em"
        height="2em"
        viewBox="0 0 16 16"
        class="bi bi-shop"
        fill="#FF7197"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M0 15.5a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zM3.12 1.175A.5.5 0 0 1 3.5 1h9a.5.5 0 0 1 .38.175l2.759 3.219A1.5 1.5 0 0 1 16 5.37v.13h-1v-.13a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.13H0v-.13a1.5 1.5 0 0 1 .361-.976l2.76-3.22z"
        />
        <path d="M2.375 6.875c.76 0 1.375-.616 1.375-1.375h1a1.375 1.375 0 0 0 2.75 0h1a1.375 1.375 0 0 0 2.75 0h1a1.375 1.375 0 1 0 2.75 0h1a2.375 2.375 0 0 1-4.25 1.458 2.371 2.371 0 0 1-1.875.917A2.37 2.37 0 0 1 8 6.958a2.37 2.37 0 0 1-1.875.917 2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.5h1c0 .76.616 1.375 1.375 1.375z" />
        <path d="M4.75 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm3.75 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm3.75 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
        <path
          fill-rule="evenodd"
          d="M2 7.846V7H1v.437c.291.207.632.35 1 .409zm-1 .737c.311.14.647.232 1 .271V15H1V8.583zm13 .271a3.354 3.354 0 0 0 1-.27V15h-1V8.854zm1-1.417c-.291.207-.632.35-1 .409V7h1v.437zM3 9.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5V15H7v-5H4v5H3V9.5zm6 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4zm1 .5v3h2v-3h-2z"
        />
      </svg>
    ),
    component: UserPage,
    layout: "/admin",
    subList: <ul></ul>,
    hasSublist: false,
  },
  {
    path: "/tables",
    name: "Log Out",
    icon: (
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
    ),
    component: TableList,
    layout: "/admin",
    subList: <ul></ul>,
    hasSublist: false,
  },
  /*{
    path: "/typography",
    name: "Typography",
    icon: "nc-icon nc-caps-small",
    component: Typography,
    layout: "/admin",
  }, */
];
export default routes;
