const mongoose = require('mongoose');

const imageData  = new mongoose.Schema({
Data:{
  type:[
    {
    serialNumber: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  inputImageUrls: {
    type: [String],
    required: true
  },
  outputImageUrls: {
    type: [String]
  }
}]},
  requestID: {
    type: String,
    required: true
  },
  status:{
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  }
});

module.exports = mongoose.model('Product', imageData);
