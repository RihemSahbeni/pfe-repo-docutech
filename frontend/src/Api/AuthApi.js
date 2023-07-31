import axios from "axios";

// Set config defaults when creating the instance
const token = localStorage.getItem("token");
const Auth = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const Createpass = async (newUsercopy) => {
  try {
    const usercopy = await Auth.put("/resetPassword", newUsercopy);
    return usercopy;
  } catch (err) {
    console.log(err);
  }
};

export const register = async (newUser) => {
  try {
    const user = await Auth.post("/user_Register", newUser);
    return user;
  } catch (err) {
    console.log(err);
  }
};
export const login = async (user) => {
  try {
    const response = await Auth.post("/login", user);

    return response;
  } catch (err) {
    console.log(err);
  }
};

export const Codeverif = async (email) => {
  try {
    const response = await Auth.put("/sendVerificationCode", email);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

/*export const Codeverifrecue = async (payload) => {
  try {
    const response = await Auth.post("/verifyCode", payload);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
*/