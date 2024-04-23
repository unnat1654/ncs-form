import adminModel from "../models/adminModel.js";
import bcrypt, { hash } from "bcrypt";

export const signUpController = async (req, res) => {
  try {
    const saltRounds = 10;
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(404).send({
        success: false,
        message: "username or password missing",
      });
    }
    const existingUser = await adminModel.findOne({ username });
    if (existingUser) {
      res.status(403).send({
        success: false,
        message: "User Already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);

    const user = new adminModel({ username, password: hashPassword });
    await user.save();
    res.status(201).send({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while registering user",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(404).send({
        success: false,
        message: "username or password missing.",
      });
    }
    const user = await adminModel.findOne({ username });
    if (!user || user.authorization==false) {
      res.status(404).send({
        success: false,
        message: "Admin does not exist.",
      });
    }

    const matchPassword = await bcrypt.compare(password,user.password);
    if(!matchPassword){
        res.status(200).send({
            success:false,
            message:"Password does not match."
        });
    }
    const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(200).send({
        success:true,
        message:"Admin logged in successfully.",
        admin:{
            username,
            token
        }
    })
  } catch (error) {
    console.error(error);
    res.status(500).send({
       success:false,
       message:"error while logging in user",
       error
    })
  }
};
