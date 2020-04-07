var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");

var userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: /@/,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//hash pw
userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    console.log(this.password);
    this.password = await bcrypt.hash(this.password, 10);
    console.log(this.password);
    next();
  }
  next();
});

//verify pw
userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}


module.exports = mongoose.model("User", userSchema);
