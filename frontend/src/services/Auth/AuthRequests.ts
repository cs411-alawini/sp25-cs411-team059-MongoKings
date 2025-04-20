import apiEndpoints from "../../data/environment";
import LoginInput from "../../types/Authentication/LoginInput";
import RegisterInput from "../../types/Authentication/RegisterInput";
import User from "../../types/Authentication/User";

async function registerRequest(
  registerDetails: RegisterInput
): Promise<string> {
  const response = await fetch(apiEndpoints.register, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerDetails),
  });
  console.log(response);
  if (response.ok) {
    const message = response.text();
    console.log("Register success");
    console.log(message);
    return message;
  }
  console.log("Register failed");
  return Promise.reject("Register failed");
}


async function loginRequest(loginDetails: LoginInput): Promise<User> {
  console.log(loginDetails)
  if (localStorage.getItem("user")) {
    const data: User = JSON.parse(localStorage.getItem("user") || "{}");
    return data;
  }
  console.log(loginDetails);
  console.log(apiEndpoints.login);
  const response = await fetch(apiEndpoints.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginDetails),
  });
  console.log("done")
  if (response.ok) {
    const data: User = await response.json();
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  }
  return Promise.reject(response.statusText);
}

async function logoutRequest(user: User): Promise<string> {
  localStorage.removeItem("user");
  return Promise.resolve("Logged out successfully");
}

export {  loginRequest, logoutRequest, registerRequest };
