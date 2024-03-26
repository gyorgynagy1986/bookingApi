import mongoose from "mongoose";

const Schema = mongoose.Schema;

const editSchema = new Schema(
  {
    maxSlot: {
      type: Number,
      required: true,
    },
    idRelatedToService:{
        type: String,
        required: true,
        unique: true
      },
    
  },
  { timestamps: true },
);

export default mongoose.models.EditModel ||
  mongoose.model("EditModel", editSchema);
