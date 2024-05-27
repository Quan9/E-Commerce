const Model3D = require("../models/Model3D");
const Product = require("../models/Product");

const createModel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }
    const file = req.file;

    const fileData = Buffer.from(file.buffer);

    const result = new Model3D({
      filename: req.body.name,
      mimeType: req.body.mimetype,
      data: fileData,
      description: req.body.description,
    });
    let saveFile = result.save();
    if (saveFile) {
      console.log("File Saved");
      const product = await Product.findByIdAndUpdate(
        req.body.id,
        {
          $set: {
            model: saveFile,
          },
        },
        { new: true }
      );
        console.log(product);
      res.status(200).send(saveFile);
    }
  } catch (error) {
    console.error("Failed to save data", error);
    res.status(500).send("Error uploading file" + error);
  }
};

// const updateModel = 
module.exports ={createModel}