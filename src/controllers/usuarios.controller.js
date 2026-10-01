const jwt = require('jsonwebtoken');
const { upgradeToPremium } = require('../repositories/user.repository');

const upgradeUserToPremium = async (req, res) => {
    const { id, premium } = req.user;

    if (premium) {
        return res.status(400).json({ message: "El usuario ya es premium" });
    }

    try {
        const usuarioActualizado = await upgradeToPremium(id);
        if (!usuarioActualizado) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const token = jwt.sign(
            { id: usuarioActualizado._id, username: usuarioActualizado.username, premium: usuarioActualizado.premium },
            process.env.AUTH_SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({ message: "Usuario actualizado a premium", token });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el usuario" });
    }
};

module.exports = {
    upgradeUserToPremium
};