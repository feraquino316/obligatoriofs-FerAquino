const { findUserByUsername, findUserByEmail, saveUser } = require("../repositories/user.repository")
const { isValidPassword } = require("../utils/validatePassword");
const jwt = require('jsonwebtoken');

const postAuthLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await findUserByUsername(username);
        if (!user) {
            return res.status(400).json({ message: "Credenciales inválidas" });
        }

        const isValidPass = await isValidPassword(password, user.password);
        if (!isValidPass) {
            return res.status(400).json({ message: "Credenciales inválidas" });
        }

        const usuario = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            admin: user.admin,
            premium: user.premium
        };

        const token = jwt.sign(usuario, process.env.AUTH_SECRET_KEY, { expiresIn: '1h' });

        // Se devuelve también el usuario para que el frontend no tenga que decodificar el token
        res.json({ token, usuario });
    } catch (error) {
        res.status(500).json({ message: "Ocurrió un error inesperado", error: error.message });
    }
};

const postAuthSignup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (await findUserByUsername(username)) {
            return res.status(400).json({ message: "El nombre de usuario ya está en uso" });
        }
        if (await findUserByEmail(email)) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }

        await saveUser(username, email, password);
        return res.status(201).json({ message: "Usuario creado correctamente" });
    }
    catch (error) {
        res.status(500).json({ message: "Ocurrió un error inesperado", error: error.message });
    }
};

module.exports = {
    postAuthLogin,
    postAuthSignup
};
