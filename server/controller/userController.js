const User = require("../models/userModel");
const generateToken = require("../config/generateTokeb")

const register = async (req, res) => {
  const { email } = req.body;
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    pic: req?.file?.filename
  }

  if (!data) {
    res.status(400).json({ status: "error", msg: "Please Enter all the Feilds" });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ status: "error", msg: "User already exists" });
  }

  const user = await User.create(data);

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token : generateToken(user._id)
    });
  } else {
    res.status(400).json({ status: "error", msg: "User not found" });
  }
};

const authUser = async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
  
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ status: "error", msg: "Invalid Email or Password" });
    }
  };

  const alluser = async(req,res) => {

    const keyword = req.query.search ? {
      $or : [
        {name : { $regex:req.query.search , $options: "i"}},
        {email : { $regex:req.query.search , $options: "i"}}
      ]
    } : {}
    const user = await User.find(keyword).find({_id : {$ne : req.user._id}})
    res.send(user)
  }

module.exports = { register , authUser ,alluser };