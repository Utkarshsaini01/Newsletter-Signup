const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: "f2cfd2347da4f371fd171f067556815a-us17",
  server: "us17"
});


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {

  const fname = req.body.fName;
  const lname = req.body.lName;
  const email = req.body.email;


  const listId = "9fbd1df80d";
  const subscribingUser = {
    firstName: fname,
    lastName: lname,
    email: email
  };

  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });

    console.log(`Successfully added and the ID is ${response.id}`);
    res.sendFile(__dirname + "/success.html");
  }

  run().catch(e => res.sendFile(__dirname + "/failure.html"));

});

app.post("/failure", function(req, res) {
  res.redirect("/");
});



app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
})




// api key
// f2cfd2347da4f371fd171f067556815a-us17

// List id
// 9fbd1df80d



// old code



// const data = {
//   members: [
//     {
//       email_address: email,
//       status: "subscribed",
//       merge_fields: {
//         FNAME: fname,
//         LNAME: lname
//       }
//     }
//   ]
// };
//
// const jsonData = JSON.stringify(data);
//
// const url = "https://us17.api.mailchimp.com/3.0.76/lists/9fbd1df80d";
//
// const options = {
//   method: "POST",
//   auth: "utkarsh:f2cfd2347da4f371fd171f067556815a-us17"
// }
//
// const request = https.request(url,options, function(response){
//   response.on("data", function(data){
//     console.log(JSON.parse(data));
//   });
// });
//
// request.write(jsonData);
// request.end();
