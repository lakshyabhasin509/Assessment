const Product = require('../models/Product');

exports.checkStatus = async (req, res) => {
  try {
    console.log(req.params);
    const { reqId } = req.params;
    
    // Query MongoDB to get status based on requestId
    const product = await Product.find({requestId : reqId}).exec();
    if (!product) {
      return res.status(404).json({ message: 'Request ID not found' });
    }
    
    return res.status(200).json({
      status: product.status,
      outputImageUrls: product.outputImageUrls,
    });
  } catch (error) {
    console.error('Error checking status:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
