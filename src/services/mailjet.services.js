const Mailjet = require('node-mailjet');

const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE
);

const sendMail = async (libro, toEmail, toName = "") => {
    const { titulo, autor, año, genero, rating } = libro;
    const estrellas = rating ? "⭐".repeat(rating) + "☆".repeat(5 - rating) : "Sin calificar";

    const fila = (label, value) => value ? `
        <tr>
            <td style="padding:6px 0; font-size:14px; color:#6b7280; width:110px;">${label}</td>
            <td style="padding:6px 0; font-size:14px; color:#111827;">${value}</td>
        </tr>` : "";

    try {
        const response = await mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: "feraquino316@gmail.com",
                        Name: "Feraquino"
                    },
                    To: [
                        {
                            Email: toEmail,
                            Name: toName || toEmail
                        }
                    ],
                    Subject: "Nuevo libro agregado",
                    TextPart: `Se ha agregado un nuevo libro: ${titulo} - ${autor} (${año || "s/f"}) - Género: ${genero || "-"} - Rating: ${rating || "-"}/5`,
                    HTMLPart: `
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding:40px 0; font-family: Arial, Helvetica, sans-serif;">
                            <tr>
                                <td align="center">
                                    <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                                        <tr>
                                            <td style="background-color:#4f46e5; padding:24px 32px;">
                                                <span style="font-size:18px; font-weight:bold; color:#ffffff;">📚 Biblioteca Obligatorio FullStack</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding:32px;">
                                                <p style="margin:0 0 8px 0; font-size:14px; color:#6b7280;">¡Lectura registrada!</p>
                                                <h2 style="margin:0 0 16px 0; font-size:20px; color:#111827;">${titulo}</h2>
                                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb; border-left:4px solid #4f46e5; border-radius:4px; margin-bottom:24px;">
                                                    <tr>
                                                        <td style="padding:12px 16px;">
                                                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                                                ${fila("Autor", autor)}
                                                                ${fila("Año", año)}
                                                                ${fila("Género", genero)}
                                                                ${fila("Rating", estrellas)}
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <p style="margin:0; font-size:14px; color:#6b7280; line-height:1.5;">
                                                    Este es un correo automático generado por el sistema de gestión de libros.
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="background-color:#f9fafb; padding:16px 32px; text-align:center;">
                                                <p style="margin:0; font-size:12px; color:#9ca3af;">Obligatorio FullStack - Fernando Aquino &middot; Notificación automática</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    `
                }
            ]
        });
        return response;
    }
    catch (error) {
        throw new Error(`Error al enviar el correo electrónico: ${error.message}`);
    }
};

module.exports = sendMail;