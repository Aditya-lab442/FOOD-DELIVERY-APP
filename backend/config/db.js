import mongoose from "mongoose";
export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://aditya:aditya11@cluster0.lwymt9e.mongodb.net/food-del').then(()=>{console.log("DB Connected")})
}