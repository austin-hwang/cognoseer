var mongoose = require('mongoose');

var ImgurImageSchema = new mongoose.Schema({
  imgurId: String,
  imgurLink: String,
}, {collection: 'imgur-images'});

module.exports = mongoose.model('ImgurImage', ImgurImageSchema);