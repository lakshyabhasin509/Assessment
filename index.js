const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const multer = require('multer');
const cors = require('cors');
const fs=require('fs');
const bodyParser = require('body-parser');

const uploadRoutes = require('./routes/upload.js');
const statusRoutes = require('./routes/status.js');
const { swaggerJsDoc, swaggerUi, swaggerSpec } = require("./services/swagger");
const port=process.env.PORT || 5000;

const dbUrl = process.env.LOCAL_DB_CONNECT;
const mongoOpts = { useNewUrlParser: true };


const publicImagesDir = 'public/output-images';
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

var upload = multer({ dest: 'uploads/' });

var dumbledoresArmyModel = require('./models/Product.js');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// connect to DB
mongoose.connect(dbUrl, mongoOpts, (err) => {
    if (err) console.log(err);
    else console.log("mongdb is connected");
});

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJsDoc(swaggerSpec))
);

app.use('/api/upload', upload.single('csvFile'), uploadRoutes);
app.use('/api/status', statusRoutes);
app.use('/images', express.static(publicImagesDir));

app.get("/",(req,res)=>{
    res.send({stutus:"ok"})
})
app.listen(port, () => console.log("server is running on port 3000"));
