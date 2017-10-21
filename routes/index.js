var express = require('express');
var router = express.Router();
var path = require('path');

var mongoose = require('mongoose');
var config = require('../config/config');
var ImgurImage = require('../models/ImgurImage');

/* GET home page. */
router.get('/', function(req, res, next) {
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
    // save the image into the database
    image.save(function(err) {
      if (err) throw err;
      console.log('User saved successfully!');
    });
    
    mongoose.connection.close();    
});

module.exports = router;
