const axios = require('axios');
const Product = require('../models/Product');
const path = require('path')
const ShortUniqueId=require('short-unique-id')

const sharp = require('sharp');
const fs=require('fs')
const port=process.env.PORT;

//ensuring that path for output images exists
const publicImagesDir = 'public/output-images';
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}


exports.processImages = async (product) => {
  try {
    const processedImageUrls = [];
    
    // Simulated image processing: compressing by 50%
    for (const Skus of product.Data) {
      for(const imageUrl of Skus.inputImageUrls){
        const uid = new ShortUniqueId({ length: 10 });
        const outputFile=uid.rnd();
      const outputPath=path.join(publicImagesDir , `${outputFile}.jpg`)
     const compressionSuccess= await compressAndSaveImage(imageUrl,outputPath);
     if(compressionSuccess)
     processedImageUrls.push(`http://localhost:${port}/images/${outputFile}.jpg`);
    }
   Skus.outputImageUrls = processedImageUrls;
  }
    
    // Update product in MongoDB with output image URLs and status
    
    product.status = 'completed';
    console.log(product);
    await product.save();
    
    // // Trigger webhook (you need to implement this part)
    // triggerWebhook(product);
  } catch (error) {
    console.error('Error processing images:', error);
    product.status = 'failed';
    await product.save();
  }
};


async function compressAndSaveImage(imageUrl, outputPath) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    await sharp(response.data) // Resize if needed
      .jpeg({ quality: 50 })  // Compress the image
      .toFile(outputPath);
    return true;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

// function triggerWebhook(product) {
//   // Implement webhook triggering logic (e.g., using Axios to send a POST request to a callback URL)
//   axios.post('https://your-webhook-url.com/callback', {
//     requestId: product._id,
//     status: product.status,
//     outputImageUrls: product.outputImageUrls,
//   });
// }
