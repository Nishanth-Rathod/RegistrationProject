// JWT Authentication :Cookies and Authentication
const jwt = require("jsonwebtoken");

const createToken = async () => {
  const token = await jwt.sign(
    { _id: "630873ffcfe64e63ba8320d1" },
    "mynameisramavathnishanthrathosiamgodnfdjdjdcdsocdocvdvdnnfionv",
    {
      expiresIn: "2 seconds",
    }
  );
  console.log(token);
  const userVerification = jwt.verify(
    token,
    "mynameisramavathnishanthrathosiamgodnfdjdjdcdsocdocvdvdnnfionv"
  );
  console.log(userVerification);
};
createToken();
