const bcrypt = require("bcrypt");
const User = require("../model/User");

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

    if (name === "" || name === null) {
      return res.status(400).json({ success: false, message: "name is required" });
    } if (email === "" || name === null) {
      return res.status(400).json({ success: false, message: "email is required" });
    } if (password === "" || password === null) {
      return res.status(400).json({ success: false, message: "password is required" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hash });

    return res.json(user);
  },

  // show
  async show(req, res) {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(400).json({ success: false, message: "user not found" });
    }

    return res.json(user);
  },

  // update
  async update(req, res) {
    const { user_id } = req.params;
    const { name, email, password } = req.body;

    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const response = await User.update({ name, email, password }, {
      where: {
        id: user_id,
      },
    });

    if (!response) {
      return res.status(400).json({ message: "something went wrong" });
    }

    return res.json({ message: "user successfully updated" });
  },

  async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ success: false, message: "user not found" });
    }

    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass) {
      return res.status(400).json({ success: false, message: "password is incorrect" });
    }

    return res.json(user);
  },
};
