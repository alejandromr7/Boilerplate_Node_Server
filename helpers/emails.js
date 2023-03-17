const nodemailer = require("nodemailer");

const emailRegistro = async (datos) => {
    const { nombre, email, token } = datos;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        secure: true, // true for 465, false for other ports
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    });

    // Informacion del email

    let info = await transporter.sendMail({
        from: '" UpTask - Administrador de Proyectos" <alejandro.proyectos00@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "UpTask - Confirma tú cuenta ✔", // Subject line
        text: "Comprueba tú Cuenta en UpTask ", // plain text body
        html: ` <p>Hola ${nombre} Comprueba  tú Cuenta en UpTask</p>
        <p>Tú cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:</p>
        
        <a href="${process.env.FRONTED_URL}/confirmar/${token}">Confirmar Cuenta</a>
    `,
    });
}


const emailOlvidePassword = async (datos) => {
    const { nombre, email, token } = datos;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        secure: true, // true for 465, false for other ports
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    });

    // Informacion del email

    let info = await transporter.sendMail({
        from: '" UpTask - Reestablece tú contraseña" <alejandro.proyectos00@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "UpTask - Reestablece tú contraseña ✔", // Subject line
        text: "Reestablece tú contraseña en UpTask ", // plain text body
        html: ` <p>Hola ${nombre} Reestablece tú contraseña en UpTask</p>
        <p>Reestablece tú contraseña en el siguiente enlace: </p>
        
        <a href="${process.env.FRONTED_URL}/olvide-password/${token}">Reestablece tú contraseña</a>
    `,
    });
}

module.exports = { emailRegistro, emailOlvidePassword };