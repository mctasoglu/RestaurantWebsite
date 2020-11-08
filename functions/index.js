const functions = require("firebase-functions");

const nodemailer = require("nodemailer");

const admin = require("firebase-admin");

const path = require("path");
const ABSPATH = path.dirname(process.mainModule.filename); // Absolute path to our app director

admin.initializeApp();

require("dotenv").config();

const { SENDER_EMAIL, SENDER_PASSWORD } = process.env;

//Sends email to accepted restaurant partners
exports.sendEmailNotification = functions.firestore
  .document("Signed Restaurants/{docId}")
  .onCreate((snap, ctx) => {
    const data = snap.data();

    let authData = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: SENDER_EMAIL, pass: SENDER_PASSWORD },
    });

    authData
      .sendMail({
        from: "developer@chutoro.app",
        to: `${data.email}`,
        subject: `You are now a partner with Chutoro!`,
        html: `<b style="margin-left:50px">Dear ${data.name}</b>, 
        <br/>
        <p style="margin-left:50px">Welcome to the Chutoro family, where we value the dedication and hardwork you put into your products!</p>
        <p style="margin-left:50px">This email is to inform you that your submission for partnering with Chutoro has been accepted. You may </p>
        <p style="margin-left:50px">now sign up with the email you provided in the restaurant registration page.</p>
        <br/>
        <br/>
        <b style="margin-left:50px">Sincerely,</b>
        <br/>
        <b style="margin-left:50px">The Chutoro Team</b>`,
      })
      .then((res) => console.log("Successfully sent mail"))
      .catch((err) => console.log(err));
  });

exports.setNewUserInfo = functions.https.onCall((data, context) => {
  //Creates a new page for the registered restaurant in Firestore
  return admin
    .firestore()
    .collection("Restaurants")
    .doc(data.name)
    .set({
      name: data.name,
      phoneNumber: data.phoneNumber,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      logoPath: data.logoPath,
    })
    .then(() => console.log(success))
    .catch((err) => console.log(err));
});

exports.removeTempUser = functions.https.onCall((data, context) => {
  //Removes information of the temporary account
  const doc = admin
    .firestore()
    .collection("Signed Restaurants")
    .doc(data.email);
  return doc.delete();
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
