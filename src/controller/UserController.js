const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

// create token
const createUserToken = (userId) => jwt.sign({ id: userId }, "jsonwebtoken", {
  algorithm: "HS256",
  expiresIn: "10m",
});

module.exports = {

  // index
  async index(req, res) {
    const users = await User.findAll();

    if (users.length <= 0) {
      return res.status(400).json({ success: false, message: "no users found" });
    }

    return res.json(users);
  },

  // store
  async store(req, res) {
    const { name, email, password } = req.body;

    // validating fields
    if (name === "" || name === null) {
      return res.status(400).json({ success: false, message: "name is required" });
    } if (email === "" || name === null) {
      return res.status(400).json({ success: false, message: "email is required" });
    } if (password === "" || password === null) {
      return res.status(400).json({ success: false, message: "password is required" });
    }

    // generating a password hash
    const hash = await bcrypt.hash(password, 10);

    // return a new user with new token
    const user = await User.create({ name, email, password: hash });

    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token: createUserToken(user.id),
    });
  },

  // show
  async show(req, res) {
    const { user_id } = req.params;

    const authId = await res.locals.auth_data.id;

    if (user_id !== authId) {
      return res.status(400).json({ success: false, message: "user_id is invalid" });
    }

    const user = await User.findByPk(user_id, { attributes: { exclude: "password" } });

    if (!user) {
      return res.status(400).json({ success: false, message: "user not found" });
    }

    return res.json(user);
  },

  // update
  async update(req, res) {
    const { user_id } = req.params;
    const { name, email } = req.body;

    // validating fields
    if (name === "" || name === null) {
      return res.status(400).json({ success: false, message: "name is required" });
    }
    if (email === "" || email === null) {
      return res.status(400).json({ success: false, message: "email is required" });
    }

    // checking if user exists
    const user = await User.findByPk(user_id);

    // return error
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    // updating user
    const response = await User.update({ name, email }, {
      where: {
        id: user_id,
      },
    });

    // return error
    if (!response) {
      return res.status(400).json({ message: "something went wrong" });
    }

    // return success message
    return res.json({ message: "user successfully updated" });
  },

  async login(req, res) {
    const { email, password } = req.body;

    // checking if the email exists
    const user = await User.findOne({ where: { email }, attributes: ["id", "email", "name", "password"] });

    // return error
    if (!user) {
      return res.status(400).json({ success: false, message: "user not found" });
    }

    // validating password
    const validPass = await bcrypt.compare(password, user.password);

    // return error
    if (!validPass) {
      return res.status(400).json({ success: false, message: "password is incorrect" });
    }

    // return user with new token
    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token: createUserToken(user.id),
    });
  },
};
