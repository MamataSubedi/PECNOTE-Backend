const userModel = require("../Models/userModel");
const softCopyModel = require("../Models/softcopyModel");

const bcrypt = require("bcryptjs");
require("dotenv").config();

const home = async (req, res) => {
  try {
    res
      .status(200)
      .send("I m from home");
  } catch (e) {
    console.log(e);
  }
}

const register = async (req, res) => {
  try {

    const { fullName, email, phoneNumber, password } = req.body;
    const userExist = await userModel.findOne({ email })
    if (userExist) {
      return res.json("exist");
    }
    const userCreated = await userModel.create({ fullName, email, phoneNumber, password });
    console.log(req.body)
    console.log(userCreated);

    res.status(201).json({
      status: true,
      msg: "Registration Successful",
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });

    ////const token= await userCreated.generateToken(),
    // const userId= await userCreated._id.toString(),
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Inter server error" });
  }
}
const getUser = async (req, res) => 
  {
    try {
      const user = await userModel.find({});
      if (user) {
        res.json(user);
      } else {
        res.json({ status: false })
      }

    } catch (e) {
      console.log(e);
    }
  }

const login = async (req, res) => {

  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email });
    if (!user) {
      res.json("notexist");

    }
    else {
      const role = user.role;
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid && role === 0) {
        res.status(200).json({
          status: "userexist",
          message: " User Login Successful",
          user: {
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            following:user.following,
            followers:user.followers,
          },
          token: await user.generateToken(),
          userId: user._id.toString(),
        })

        //const user = await userModel.findById(req.user._id);

      }
      else if (isPasswordValid && role === 1) {
        res.status(200).json({
          status: "adminexist",
          user: {
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            following:user.id,
            followers:user._id,
          },
          message: " Admin Login Successful",
          token: await user.generateToken(),
          userId: user._id.toString(),
        })
      }
      else if (!isPasswordValid) {
        res.json({
          status: "pw_wrong",
        })
      }
      else {
        res.json({ status: false });
      }
    }
  } catch (e) {
    console.log(e);
  }
}

const getAllUsers = async (req, res) => {
  try {
    let users = await userModel.find();
    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};


const user_auth = async (req, res) => {
  try {
    res.status(200).send({ ok: true });
  } catch (error) {

  }
}

//follow
const followUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  console.log(id, _id);

  if (_id == id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const followUser = await userModel.findById(id);
      const followingUser = await userModel.findById(_id);

      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("User followed!");
      } else {
        res.status(403).json("You are already following this user.");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
};


module.exports = {
  home, register, login, getUser, user_auth
  , getAllUsers
  ,followUser
};