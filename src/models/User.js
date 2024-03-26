import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "A name is required"],
    },
    email: {
      type: String,
      required: [true, "An email is required"],
      unique: true, // Ez garantálja, hogy az email cím egyedi legyen az adatbázisban
    },
    phone: {
      type: String,
      required: false, // Opcionális
    },
    password: {
      type: String,
      required: true,
    },
     businessName: {
       type: String,
       required: true,
       unique: true,
     },
    role: {
      type: String,
      default: "user",
      required: true,
    },
    // További mezők hozzáadhatók szükség esetén
  },
  { timestamps: true },
); // Ez adja hozzá a createdAt és updatedAt mezőket automatikusan

export default mongoose.models.User || mongoose.model("User", userSchema);
