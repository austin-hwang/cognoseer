var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var config = require('../config/config');
var ImgurImage = require('../models/ImgurImage');
var fs = require("fs");

/* GET home page. */
router.get('/', function(req, res, next) {
    var init = { 
      images:[] 
    };
    fs.writeFile(__dirname + "/images.json", JSON.stringify(init, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        };
        console.log("File has been created");
    });
     res.sendFile(path.join(__dirname, '..', 'index.html'));
});

router.post('/image', function(req,res,next){   

    var contents = fs.readFileSync(__dirname + "/images.json");
    // Define to JSON type
    var jsonContent = JSON.parse(contents);
    // connect to MongoDB
    mongoose.Promise = global.Promise;

    mongoose.connect(config.database.connectionString)
      .then(() =>  console.log('connection successful'))
      .catch((err) => console.error(err));

    var image = new ImgurImage({
        imgurId : req.body.id,
        imgurLink : req.body.link
    });
    console.log("Image URL: " + image.imgurLink);
    if (image.imgurLink)
    {
      jsonContent['images'].push(image.imgurLink);
    }
    fs.writeFile(__dirname + "/images.json", JSON.stringify(jsonContent, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        };
        console.log("File has been created");
    });
    // save the image into the database
    image.save(function(err) {
      if (err) throw err;
      console.log('User saved successfully!');
    });
    res.send(jsonContent);
    console.log(jsonContent.images);
    mongoose.connection.close();    
});

var happiness, sadness, anger, neutral, fear, disgust, contempt, surprise = 0;
var age = 0;
var male, female = 0;
router.post('/send-data'), function(req, res, next){
  for(var i = 0; i < req.body.length; i++){

  }
}

module.exports = router;
