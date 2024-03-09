import mongoose from "mongoose";

const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  availableFrom: { type: Date, required: true },
  availableTo: { type: Date, required: true },
  maxSlots: { type: Number, required: true },
  startTime: { type: String, required: true }, // például "09:00"
  endTime: { type: String, required: true }, // például "17:00"
},
{   
  toJSON: { virtuals: true},
  toObject: { virtuals: true}
});


export default mongoose.models.Service ||
  mongoose.model("Service", serviceSchema);
