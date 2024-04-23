import JWT from "jsonwebtoken";
export const isLoggedIn = (req, res, next) => {
  try {
    const decodedToken = JWT.decode(req.headers.authorization, {
      complete: true,
    });
    if (decodedToken && decodedToken.payload.exp) {
      const expirationTime = decodedToken.payload.exp;
      const currentTime = Math.floor(Date.now() / 1000);

      if (currentTime > expirationTime) {
        return res.status(401).send({
          success: false,
          message: "Token expired. Please login again",
        });
      } else {
        decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode;
      }
    } else {
      throw new Error("Invalid token format");
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      authToken: req.headers.authorization,
    });
  }
};
export const isAuthorized = async (req, res, next) => {
  try {
    const user = await adminModel.findById(req.user._id);
    if (user && user.authorization == true) {
      return res.status(401).send({
        success: false,
        message: "Not authorized to perform this operation",
        user_access: user.authorization,
      });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success:false,
      message:"Error while authorizating user",
      error
    });
  }
};
