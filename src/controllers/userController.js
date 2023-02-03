const bcrypt = require("bcrypt");
const passport = require("passport");

const UserModel = require("../models/userModel");

const loginPage = async (req, res) => {
  try {
    res.render("login", { message: null });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

const signInPage = async (req, res) => {
  try {
    res.render("signIn", {message: null});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  };
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.render("login", { message: "Preencha todos os campos." });

  const user = await UserModel.findOne({ email: email });
  if (!user) return res.render("login", { message: "Email não cadastrado" });

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword)
    return res.status(401).render("login", { message: "Senha incorreta" });

  try {
    passport.authenticate("local",{
      successRedirect:'/',
      failureRedirect:'/login',
  })(req,res,next);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

const logout = async (req, res) => {
  try {
    req.logout();
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

const register = async (req, res) => {
  const { realName, userName, email, password, confirmPassword } = req.body;
  if (!realName || !userName || !email || !password || !confirmPassword)
    return res.status(400).json({ message: "Fields missing" });
  if (password !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  const userExist = await UserModel.findOne({ email });
  if (userExist)
    return res
      .status(422)
      .json({ message: "User already registered, try using another email" });

  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_SECRET)
  );

  try {
    await UserModel.create({
      realName,
      userName,
      email,
      password: hashedPassword,
      reputation: 0,
      avatar: "default.png",
    });
    res.status(201).redirect("/login");
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id, { password: 0 });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    if (users.length === 0)
      return res.status(404).json({ message: "No user found" });
    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { realName, password, confirmPassword } = req.body;
    if (!realName || !password || !confirmPassword)
      return res.status(400).json({ message: "Fields missing" });
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SECRET)
    );

    await UserModel.findByIdAndUpdate(req.params.id, {
      realName,
      password: hashedPassword,
    });

    const userUpdated = await UserModel.findById(req.params.id, {
      password: 0,
    });
    res.status(200).json({ message: "User successfully updated", userUpdated });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }
    
    await UserModel.findByIdAndUpdate(req.params.id, {
      avatar: req.file.filename,
    });
    const user = await UserModel.findById(req.params.id, { password: 0 });
    res.status(200).json({ message: "Avatar successfully updated", user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await UserModel.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "User successfully deleted", user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server side error ocurred" });
  }
};

module.exports = {
  login,
  logout,
  register,
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
  deleteUser,
  loginPage,
  signInPage,
};
