//middle-ware
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

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


var app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

app.use('/api', rtsAdmin);
app.use('/api', rtsDonee);
app.use('/api', rtsDonor);
app.use('/api', rtsHospital);
app.use('/api', rtsBlood_Inventory);


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

// start server
app.listen(process.env.PORT, () => console.log(`Server started at port : ${process.env.PORT}`));