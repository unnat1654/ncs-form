import adminModel from "../models/adminModel.js";
import { hash, compare} from "bcrypt";
import JWT from 'jsonwebtoken';

export const signUpController = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(404).send({
        success: false,
        message: "username or password missing",
      });
    }
    const saltRounds = 10;
    const existingUsers = await adminModel.find({}).select({username:1});
    if (existingUsers.length>10 || existingUsers.some(existingUser => existingUser.username === username)) {
      res.status(409).send({
        success: false,
        message: "Maximum admins reached",
      });
    }

    const hashPassword = await hash(password.trim(), saltRounds);

    const user = new adminModel({ username:username.trim(), password: hashPassword });
    await user.save();
    res.status(201).send({
      success: true,
      message: "user created successfully",
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
      return res.status(404).send({
        success: false,
        message: "username or password missing.",
      });
    }
    const user = await adminModel.findOne({ username:username.trim() });
    if (!user || user.authorization==false) {
      return res.status(403).send({
        success: false,
        message: "Admin does not exist.",
      });
    }

    const matchPassword = await compare(password.trim(),user.password);
    if(!matchPassword){
        res.status(200).send({
            success:false,
            message:"Password does not match."
        });
    }
    const token = JWT.sign({_id:user._id},process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(200).send({
        success:true,
        message:"Admin logged in successfully.",
        admin:{
            username:username.trim(),
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
