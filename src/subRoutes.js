/* 
Same concept as routes.js except for subroutes.
*/

import AddPlan from "views/AddPlan.js";
import User from "views/User.js";

var subRoutes = [
  {
    path: "/pending-orders",
    name: "Pending Orders",

    component: User,
    layout: "/admin",
  },
  {
    path: "/completed-orders",
    name: "Completed Orders",

    component: User,
    layout: "/admin",
  },
  {
    path: "/current-meals",
    name: "Current Meals",

    component: User,
    layout: "/admin",
  },
  {
    path: "/add-a-new-product",
    name: "Add a New Product",

    component: User,
    layout: "/admin",
  },
  {
    path: "/add-a-new-plan",
    name: "Add a New Plan",

    component: AddPlan,
    layout: "/admin",
  },
];
export default subRoutes;
