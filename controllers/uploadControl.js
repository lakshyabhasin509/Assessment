const Product = require('../models/Product');
const imageService = require('../services/imageCompression.js');
const csv= require('csvtojson')
const ShortUniqueId=require('short-unique-id')
exports.uploadCSV = async (req, res,next) => {
    console.log("start");
 
    if (!req.file) {
      return res.status(400).json({ message: 'CSV file is required' });
    }
    
    // Parse CSV data 
    csv()
    .fromFile(req.file.path)
    .then(async (jsonObj)=>{

      // Validate CSV format 
    const isValid = validateCSVFormat(jsonObj);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid CSV format' });
    }
    console.log(jsonObj)
    var products=[];
    const newProduct = new Product();
        for(var i = 0;i<jsonObj.length;i++){
         
          newProduct.Data.push({
          "serialNumber": jsonObj[i]['Serial Number'],
          "productName": jsonObj[i]['Product Name'],
          "inputImageUrls": jsonObj[i]['Input Image Urls'].split(',').map(url => url.trim()),})
           
          
         
          products.push(newProduct);
          console.log(newProduct);
          
          // Call image processing service
          imageService.processImages(newProduct);

         
          
        }
        const uid = new ShortUniqueId({ length: 10 });
        newProduct.requestID =uid.rnd();
        console.log(newProduct)
        await newProduct.save();

        res.send({"RequestId" : newProduct.requestID})
        }).catch(function(error){
          console.error('Error uploading CSV:', error);
            res.status(500).send({
                message: "failure",
                error
            });
        });
    
  } 

// Mock function to validate CSV format (replace with actual validation logic)
function validateCSVFormat(csvData) {
  // Example: check if each product object has required fields (Serial Number, Product Name, Input Image Urls)
  for (const product of csvData) {
    if (!product['Serial Number'] || !product['Product Name'] || !product['Input Image Urls']) {
      return false;
    }
  }
  return true;
}
