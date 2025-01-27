//middle-ware
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
var path = require('path');
var nodemailer = require('nodemailer');

//imports
require('././backend/config/config');
require('././backend/models/db');

require('././backend/config/adminpassportConfig');
require('././backend/config/doneepassportConfig');
require('././backend/config/donorpassportConfig');
require('././backend/config/hospitalpassportConfig');

const rtsAdmin= require('././backend/routes/admin.router');
const rtsDonee = require('././backend/routes/donee.router');
const rtsDonor = require('././backend/routes/donor.router');
const rtsHospital = require('././backend/routes/hospital.router');
const rtsBlood_Inventory = require('././backend/routes/blood_inventory.router');
const rtsAppointment = require('././backend/routes/appointment.router');
const rtsHospitalBloodRequest = require('././backend/routes/hospital_blood_request.router');
const rtsDoneeBloodRequest = require('././backend/routes/donee_blood_request.router');
const rtsBloodCampaigns = require('././backend/routes/blood_campaigns.router');


var app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));
app.use(passport.initialize());

app.use('/api', rtsAdmin);
app.use('/api', rtsDonee);
app.use('/api', rtsDonor);
app.use('/api', rtsHospital);
app.use('/api', rtsBlood_Inventory);
app.use('/api', rtsAppointment);
app.use('/api', rtsDoneeBloodRequest);
app.use('/api', rtsHospitalBloodRequest);
app.use('/api', rtsBloodCampaigns);


// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    else{
        console.log(err);
    }
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// start server
app.listen(process.env.PORT, () => console.log(`Server started at port : ${process.env.PORT}`));