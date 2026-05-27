import mongoose, { Schema, Model } from "mongoose";

const leadSchema = new Schema(
  {
    name: String,
    mobile: String,
  },
  {
    timestamps: true,
  }
);

const Lead: Model<any> = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

export default Lead;
