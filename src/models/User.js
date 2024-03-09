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
      match: [/.+\@.+\..+/, "Please fill a valid email address"], // Egyszerű regex az email formátumának ellenőrzésére
    },
    phone: {
      type: String,
      required: false, // Opcionális
      match: [/^\+?[1-9]\d{1,14}$/, "Please fill a valid phone number"], // Egyszerű regex a telefon formátumának ellenőrzésére
    },
    // További mezők hozzáadhatók szükség esetén
  },
  { timestamps: true },
); // Ez adja hozzá a createdAt és updatedAt mezőket automatikusan

export default mongoose.models.User || mongoose.model("User", userSchema);
