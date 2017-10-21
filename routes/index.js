var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var config = require('../config/config');
var ImgurImage = require('../models/ImgurImage');
var fs = require("fs");


var contents = fs.readFileSync(__dirname + "/images.json");
// Define to JSON type
var jsonContent = JSON.parse(contents);
/* GET home page. */
router.get('/', function(req, res, next) {
    var init = { 
      images:[] 
    };
    fs.writeFile(__dirname + "/images.json", init, (err) => {
        if (err) {
            console.error(err);
            return;
        };
        console.log("File has been created");
    });
     res.sendFile(path.join(__dirname, '..', 'index.html'));
});

router.post('/image', function(req,res,next){
    
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
    jsonContent['images'].push(image.imgurLink);
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

module.exports = router;
