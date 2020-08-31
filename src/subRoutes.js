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
    layout: "/chutoro.com/restaurant",
  },
  {
    path: "/completed-orders",
    name: "Completed Orders",

    component: User,
    layout: "/chutoro.com/restaurant",
  },
  {
    path: "/current-meals",
    name: "Current Meals",

    component: User,
    layout: "/chutoro.com/restaurant",
  },
  {
    path: "/add-a-new-product",
    name: "Add a New Product",

    component: User,
    layout: "/chutoro.com/restaurant",
  },
  {
    path: "/add-a-new-plan",
    name: "Add a New Plan",

    component: AddPlan,
    layout: "/chutoro.com/restaurant",
  },
];
export default subRoutes;
