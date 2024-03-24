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
  recurrence: { type: Boolean, default: true, required: true },
  recurrenceDays: [{ type: Number }], // Új mező: a hét napjai (0 = vasárnap, 1 = hétfő, stb.)
  visible: { type: Boolean, default: true, required: true }
}, 

{
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.id; // Eltávolítja az 'id' mezőt a kimenetből
      // Itt további transzformációkat végezhetsz, ha szükséges
      return ret;
    }
  },
  toObject: { virtuals: true }
},

);


export default mongoose.models.Service ||
  mongoose.model("Service", serviceSchema);
