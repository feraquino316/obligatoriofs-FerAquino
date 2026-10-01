const User = require("../models/user.model");
const bcrypt = require("bcryptjs")

const findUserByUsername = async (username) => {
    return await User.findOne({username:username});
}

const upgradeToPremium = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        return null;
    }
    user.premium = true;
    await user.save();
    return user;
}

const saveUser = async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
    });
    const res = await newUser.save();
    return res;
};

module.exports = {
    findUserByUsername,
    saveUser,
    upgradeToPremium
}