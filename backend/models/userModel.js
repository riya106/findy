const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
name: {
type: String,
required: true,
trim: true
},

email: {
type: String,
required: true,
unique: true,
trim: true
},

phone: {
type: String,
required: true
},

password: {
type: String,
required: true
},

role: {
type: String,
enum: ["explorer", "seller","worker"],
default: "explorer"
},

location: {
city: {
type: String
},
state: {
type: String
},
latitude: {
type: Number
},
longitude: {
type: Number
}
}

},
{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);