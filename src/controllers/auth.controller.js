const { findUserByUsername, saveUser } = require("../repositories/user.repository")
const { isValidPassword } = require("../utils/validatePassword");
const jwt = require('jsonwebtoken');

const postAuthLogin = async (req, res) => {
    const { body } = req;
    const { username, password } = body;
    const user = await findUserByUsername(username);
    if (!user) {
        return res.status(400).json({ message: "Credenciales inválidas" }); 
    }
    const isValidPass = await isValidPassword(password, user.password);

    if (!isValidPass) {
        return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const userId = user._id.toString();

    const token = jwt.sign({id: userId, username: user.username, email: user.email, admin: user.admin, premium: user.premium},
    process.env.AUTH_SECRET_KEY, { expiresIn: '1h' }
);

    res.json({ token: token });
};

const postAuthSignup = async (req, res) => {
    const { body } = req;
    const { username, email, password } = body;

    const user = await findUserByUsername(username);
    
    if(user){
        return res.status(400).json({ message: "El nombre de usuario ya está en uso" });
    }

    try{
        await saveUser(username, email, password);
        return res.status(201).json({ message: "Usuario creado correctamente" });
    }
    catch(error){
        res.status(500).json({message: "Ocurrio un error inesperado", error})
    }

};

module.exports = {
    postAuthLogin,
    postAuthSignup
};