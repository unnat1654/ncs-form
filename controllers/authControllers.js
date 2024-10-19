import axios from "axios";

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).send({
        success: false,
        message: "email or password missing.",
      });
    
    const { data } = await axios.post(`${process.env.MARIO_HOST}/api/auth/emily-admin-login`, { email, password });
    if (!data || !data.success)
      return res.status(404).send({ success: false, message: data.message });

    res.status(200).send({
      success: true,
      message: "Logged in successfully!",
      token: data.token,
      role: data.role
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "error while logging in user"
    });
  }
};
