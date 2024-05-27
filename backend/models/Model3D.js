const mongoose = require('mongoose');

const model3DSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    data: {
      type: Buffer,
      required: true,
    },
  },
  { timestamps: true }
);

const Model3D = mongoose.model("Model3D", model3DSchema);

module.exports = {Model3D,model3DSchema};
