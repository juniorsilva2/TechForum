const bcrypt = require("bcrypt");
const passport = require("passport");

const UserModel = require("../models/userModel");
const PostModel = require("../models/postModel");
const CommentModel = require("../models/commentModel");

const loginPage = async (req, res) => {
  try {
    res.render("login", { message: null });
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

const signInPage = async (req, res) => {
  try {
    res.render("signIn", {message: null});
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
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
    res.redirect("/");
  }
};

const logout = async (req, res) => {
  try {
    req.logout(function (err) {
      if (err) return next(err);
      res.redirect("/");
    })
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

const register = async (req, res) => {
  const { realName, userName, email, password, confirmPassword } = req.body;
  if (!realName || !userName || !email || !password || !confirmPassword)
    return res.render("signIn", {message: "Por favor preencha todos os campos"});
  if (password !== confirmPassword)
    return res.render("signIn", {message: "As senhas não conferem"});

  const emailExist = await UserModel.findOne({ email });
  if (emailExist) return res.render("signIn", {message: "Email já cadastrado, por favor utilize outro email."});
  const userNameExist = await UserModel.findOne({ userName });
  if (userNameExist) return res.render("signIn", {message: "Nome de usuário já cadastrado, por favor utilize outro nome."});

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
    res.redirect("/");
  }
};

const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).render("login", { message: "Usuário não encontrado" });
    const posts = await PostModel.find({ user: user.id });
    const comments = await CommentModel.find({ user: user.id });
    res.render("perfil", { user, posts, comments });
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

const updatePage = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    res.render("perfilEdit", { message: null, user });
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

const updateUser = async (req, res) => {
  try {
    const { userName, password, confirmPassword } = req.body;
    const user = await UserModel.findById(req.user.id, { userName: 1, avatar: 1, _id: 1 });
    console.log(user.id);
    if (!userName)
      return res.render("perfilEdit", { message: "Nome de usuário ausente", user });
    const userExist = await UserModel.findOne({ userName: userName }, { userName: 1, _id: 1 });
    if (userExist)
      if (user.id !== userExist.id && user.userName == userExist.userName)
        return res.render("perfilEdit", { message: "Nome de usuário já existe", user });
    if (password !== confirmPassword)
      return res.render("perfilEdit", { message: "Senhas não conferem", user });
    if (userName !== user.userName) {
      await UserModel.findByIdAndUpdate(req.user.id, {userName: userName});
      return res.redirect("/perfil");
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SECRET)
    );

    await UserModel.findByIdAndUpdate(req.user.id, {
      userName,
      password: hashedPassword,
    });

    res.redirect("/perfil");
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

const updateAvatarPage = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id, { userName: 1, avatar: 1 });
    res.render("perfilAvatar", { message: null, user });
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

const updateAvatar = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id, { userName: 1, avatar: 1 });
    if (!req.file) {
      return res.render("perfilAvatar", { message: "Por favor faça o upload de uma imagem .PNG, .JPG ou .JPEG", user });
    }
    
    await UserModel.findByIdAndUpdate(req.user.id, {
      avatar: req.file.filename,
    });
    res.redirect("/perfil");
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

const deletePage = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id, { userName: 1, avatar: 1 });
    res.render("perfilDelete", { message: null, user });
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

const deleteUser = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const user = await UserModel.findById(req.user.id, { userName: 1, avatar: 1 });
    if (!password || !confirmPassword)
      return res.render("perfilDelete", { message: "Por favor preencha todos os campos", user });
    if (password !== confirmPassword)
      return res.render("perfilDelete", { message: "Senhas não conferem", user });
    
    const userWillDelete = await UserModel.findById(req.user.id);
    const passMatch = await bcrypt.compare(password, userWillDelete.password);
    
    if (!passMatch)
      return res.render("perfilDelete", { message: "Senha incorreta", user });
    
    await UserModel.findByIdAndRemove(userWillDelete.id);
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

module.exports = {
  login,
  logout,
  register,
  getUser,
  updateUser,
  updateAvatar,
  deleteUser,
  loginPage,
  signInPage,
  updatePage,
  updateAvatarPage,
  deletePage,
};
