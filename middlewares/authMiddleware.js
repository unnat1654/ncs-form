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
        req.user = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
      }
    } else {
      throw new Error("Invalid token format");
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message:"Error while checking authentication!"
    });
  }
};
export const isAuthorized = async (req, res, next) => {
  try {
    const { _id, role } = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
    if (role != 1)
      return res.status(401).send({
        success: false,
        message: "Unauthorized!"
      });

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while authorizating user!",
    });
  }
};
