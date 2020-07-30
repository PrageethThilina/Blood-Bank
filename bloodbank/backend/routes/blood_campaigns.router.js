var express = require('express');
var router = express.Router();
var multer  = require('multer');
var Blood_Campaigns = require('../models/blood_campaigns.model.js');


const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post( "/register-blood-campaigns",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const blood_campaigns = new Blood_Campaigns({
      province: req.body.province,
      district: req.body.district,
      address: req.body.address,
      organiser: req.body.organiser,
      date: req.body.date,
      time: req.body.time,
      contact: req.body.contact,
      email: req.body.email,
      imagePath: url + "/images/" + req.file.filename
    });
    blood_campaigns.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        blood_campaigns: {
          ...createdPost,
          id: createdPost._id
        }
      });
    });
  }
);

router.put("/:id",multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }
    const blood_campaigns = new Blood_Campaigns({
      province: req.body.province,
      district: req.body.district,
      address: req.body.address,
      organiser: req.body.organiser,
      date: req.body.date,
      time: req.body.time,
      contact: req.body.contact,
      email: req.body.email,
      imagePath: imagePath
    });
    console.log(blood_campaigns);
    Blood_Campaigns.updateOne({ _id: req.params.id }, blood_campaigns).then(result => {
      res.status(200).json({ message: "Update successful!" });
    });
  }
);

router.get("/view-blood-campaigns", (req, res, next) => {
  Blood_Campaigns.find().then(documents => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents
    });
  });
});

router.get("/view-blood-campaigns/:id", (req, res, next) => {
  Blood_Campaigns.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

router.delete("/manage-blood-campaigns/:id", (req, res, next) => {
  Blood_Campaigns.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;





// // Save file to server storage
// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, './backend/images');
//     },
//     filename: (req, file, cb) => {
//       console.log(file);
//       var filetype = '';
//       if(file.mimetype === 'image/gif') {
//         filetype = 'gif';
//       }
//       if(file.mimetype === 'image/png') {
//         filetype = 'png';
//       }
//       if(file.mimetype === 'image/jpeg') {
//         filetype = 'jpg';
//       }
//       cb(null, 'image-' + Date.now() + '.' + filetype);
//     }
// });

// var upload = multer({storage: storage});

// // get data
// router.get('/view-blood-campaigns', function(req, res, next) {
//     Blood_Campaigns.find((err, bloodcampaigns) => {
//         if (err) return next(err);
//         res.json(bloodcampaigns);
//     });
// });

  
// // post data
// router.post('/register-blood-campaigns', upload.single('file'), function(req, res, next) {
//     if(!req.file) {
//         return res.status(500).send({ message: 'Upload fail'});
//     } else {
//         req.body.imageUrl = 'http://192.168.0.7:3000/backend/images/' + req.file.filename;
//         Blood_Campaigns.create(req.body, function (err, bloodcampaigns) {
//             if (err) {
//                 console.log(err);
//                 return next(err);
//             }
//             res.json(bloodcampaigns);
//         });
//     }
// });
