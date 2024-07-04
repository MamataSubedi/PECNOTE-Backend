const mongoose=require("mongoose")
require("dotenv").config();
const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber:{
      type: Number,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default:0
    },
    tokens:[{
      token:
      {
        type:String,
        required:true,
      }
    }],
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
   
}, 
  

{timestamps:true}
);


//Password Hash//
userSchema.pre('save',async function(next){
const user=this;
if(!user.isModified("password"))
{
next();
}
try{
  
const saltRound= await bcrypt.genSalt(10);
 const hashPassword=await bcrypt.hash(user.password,saltRound);
 user.password=hashPassword

}catch(e)
{
  next(e);
}
})

//web Token//

userSchema.methods.generateToken = async function () {
  console.log("I am token");
  try {
    const token = jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        isAdmin: this.isAdmin,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
    this.tokens=this.tokens.concat({token:token});
    await this.save();
    console.log(token);
    
    return token;
  } catch (error) {
    console.error("Token Error: ", error);
  }
};



const User = mongoose.model('Users',userSchema);

module.exports = User;