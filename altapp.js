const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing"); // you need to add dependency first. See tips.

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

client.setConfig({
  apiKey: "6864d104ee68eb68701465f887f535c9-us20",
  server: "us20",
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.eaddress;
  console.log(firstName, lastName, email);
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  }

  const run = async () => {
     try {
       const response = await client.lists.addListMember("0eb67c9057", {
         email_address: subscribingUser.email,
         status: "subscribed",
         merge_fields: {
           FNAME: subscribingUser.firstName,
           LNAME: subscribingUser.lastName
         }
       });
       console.log(response);
       res.sendFile(__dirname + "/success.html");
     } catch (err) {   //catch error method to see the results of statuscode and directing according to it...
       console.log(err.status);
       res.sendFile(__dirname + "/failure.html");
     }
   };

   run();
 });

 app.post("/failure", function(req, res) {
   res.redirect("/");
 });

 app.listen(3000, function() {
   console.log("Server is running on port 3000.");
 });
