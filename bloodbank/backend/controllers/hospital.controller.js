const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const Hospital = mongoose.model('Hospital');

module.exports.hospital_register = (req, res, next) => {
    var hospital = new Hospital();
    hospital.hospital_name = req.body.hospital_name,
    hospital.address = req.body.address,
    hospital.contact = req.body.contact,
    hospital.email = req.body.email,
    hospital.username = req.body.username,
    hospital.password = req.body.password,
    hospital.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}

module.exports.hospital_login = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, hospital, info) => {       
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (hospital) return res.status(200).json({ "token": hospital.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.hospital_profile = (req, res, next) =>{
    Hospital.findOne({ _id: req._id },
        (err, hospital) => {
            if (!hospital)
                return res.status(404).json({ status: false, message: 'Record not found.' });
            else
                return res.status(200).json({ status: true, hospital : _.pick(hospital,['hospital_name','address','contact','email']) });
        }
    );
}