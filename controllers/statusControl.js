const Product = require('../models/Product');

exports.checkStatus = async (req, res) => {
  try {
    console.log(req.params);
    const { requestId } = req.params;
    const rid=requestId
    // Query MongoDB to get status based on requestId
    const product = await Product.findOne({requestID : rid}).exec();
    console.log(product);
    if (!product) {
      return res.status(404).json({ message: 'Request ID not found' });
    }
    
    return res.status(200).json({
      status: product.status,
      Data:product.Data
    });
  } catch (error) {
    console.error('Error checking status:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
