/*!

This page is at the top of the web tree. This is where all the relevant pages are added to the treee to be displayed.

*/
import React, { Fragment } from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch } from "react-router-dom";

import DemoNavbar from "components/Navbars/DemoNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";
import AddPlan from "views/AddPlan.js";

import routes from "routes.js";
import subRoutes from "subRoutes.js";

import firebase from "firebase.js";
import { storage } from "firebase.js";

import { Product, productConverter } from "components/Classes/ProductClass.js";

import logo from "assets/img/chutoro_fish.png";
import { JsxEmit } from "typescript";

var db = firebase.firestore();

var ps;

var name = "";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "black",
      activeColor: "info",
      products: [],
      productDisplay: [],
      hasLoaded: false,
    };
    this.mainPanel = React.createRef();

    //Function to retrieve all the products of the restaurant
    function init(obj) {
      name = "Mola";

      var docRef = db.collection("Restaurants").doc(`${name}`);

      var productInstances = [];

      //Convert each document in the collection 'Products' into instances of the Product Class. More information can be found in components/Classes/ProductClass.js
      docRef
        .collection("Products")
        .withConverter(productConverter)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            var product = doc.data();
            // doc.data() is never undefined for query doc snapshots
            productInstances.push(product);
          });
        });

      //Due to fetching operation being asynchronous, a Promise is returned where after 2 seconds, the list of all the products is returned.
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(productInstances);
        }, 2000);
      });
    }

    //Get all the images of the corresponding products from the Cloud Storage
    function getImages(currentProducts) {
      var result = {};
      for (let i = 0; i < currentProducts.length; i++) {
        let prod = currentProducts[i];
        let name = prod.name;
        let items = prod.items;
        let src = prod.imagePath;

        var imgStorage = storage.ref(`${src}`);
        (function () {
          imgStorage
            .getDownloadURL()
            .then(function (url) {
              // Insert url into an <img> tag to "download"

              result[name] = { prodItems: items, prodURL: url };
            })
            .catch(function (error) {
              // A full list of error codes is available at
              // https://firebase.google.com/docs/storage/web/handle-errors
              switch (error.code) {
                case "storage/object-not-found":
                  // File doesn't exist
                  break;

                case "storage/unauthorized":
                  // User doesn't have permission to access the object
                  break;

                case "storage/canceled":
                  // User canceled the upload
                  break;

                case "storage/unknown":
                  // Unknown error occurred, inspect the server response
                  break;
              }
            });
        })();
      }

      //Once again, this is an asynchronous function

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(result);
        }, 2000);
      });
    }

    async function getList(obj) {
      //First, wait for the product list to be filled
      let productList = await init(obj);

      //Set state
      obj.setState({ products: productList });

      //Once the images are successfully retrieved, result of that function is passed into the success clause (.then). This is kind of similar to 150 CPS.
      getImages(productList)
        .then((dict) => {
          var result = [];
          let keys = Object.keys(dict);
          let sortedKeys = keys.sort();
          //Make html objects to be displayed for each product and their corresponding items.
          for (let i = 0; i < sortedKeys.length; i++) {
            let name = sortedKeys[i];
            let imgSrc = dict[name]["prodURL"];
            let items = dict[name]["prodItems"];

            var count = 0;
            let displayedContent = items.map((lst) => {
              count += 1;
              return (
                <div className="row justify-content-md-center">{`Item ${count}: ${lst["key"]["name"]},   Quantity: ${lst["key"]["quantity"]} ${lst["key"]["units"]} `}</div>
              );
            });
            result.push(
              <div
                className="row"
                style={{ marginBottom: "20px" }}
                id={name}
                key={name}
              >
                <div className="col-3" style={{ textAlign: "center" }}>
                  <div className="card">
                    <img
                      className="card-img-top"
                      src={imgSrc}
                      style={{ width: "100%", height: "auto" }}
                    ></img>
                    <figcaption>{name}</figcaption>
                  </div>
                </div>
                <div className="col-9">
                  <div className="row justify-content-md-center">
                    <b>Supplemental Items</b>

                    {displayedContent}
                  </div>
                </div>
              </div>
            );
          }
          obj.setState({ productDisplay: result });

          //To confirm that fetching is completed.
          obj.setState({ hasLoaded: true });
        })

        //Error case
        .catch(() => console.log("Error"));

      //let images = await getImages(productList);
      //obj.setState({ productDisplay: images });

      //obj.setState({ hasLoaded: true });
    }

    getList(this);
  }
  componentDidMount() {
    /* if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.mainPanel.current);
    } */
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      document.body.classList.toggle("perfect-scrollbar-on");
    }
  }
  componentDidUpdate(e) {
    if (e.history.action === "PUSH") {
      this.mainPanel.current.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  }
  handleActiveClick = (color) => {
    this.setState({ activeColor: color });
  };
  handleBgClick = (color) => {
    this.setState({ backgroundColor: color });
  };
  render() {
    //If the fetching is completed, initialize all the relevant pages of the web tree.
    if (this.state.hasLoaded == true) {
      return (
        <div className="wrapper">
          {" "}
          <Sidebar
            {...this.props}
            routes={routes}
            bgColor={this.state.backgroundColor}
            activeColor={this.state.activeColor}
          />
          <div className="main-panel" ref={this.mainPanel}>
            <DemoNavbar {...this.props} />
            <Switch>
              {routes.map((prop, key) => {
                return (
                  <Route
                    path={prop.layout + prop.path}
                    component={prop.component}
                    key={key}
                  />
                );
              })}
              {subRoutes.map((prop, key) => {
                if (prop.component == AddPlan) {
                  console.log(this.state.productDisplay);
                  //This passes on the products to the AddPlan page
                  return (
                    <Route
                      path={prop.layout + prop.path}
                      render={() => (
                        <AddPlan products={this.state.productDisplay} />
                      )}
                      key={key}
                    />
                  );
                } else {
                  return (
                    <Route
                      path={prop.layout + prop.path}
                      component={prop.component}
                      key={key}
                    />
                  );
                }
              })}
            </Switch>
            <Footer fluid />
          </div>
        </div>
      );
    }
    //Loading page
    else {
      return (
        <div
          style={{
            position: "absolute",
            top: "40vh",
            left: "50%",
            textAlign: "center",
          }}
        >
          <img src={logo} style={{ width: "125px", height: "auto" }}></img>
          <figcaption style={{ marginTop: "50px" }}>Loading...</figcaption>
        </div>
      );
    }
  }
}

export default Dashboard;
