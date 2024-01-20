import nodeMailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";

interface ISendEmailOptions {
    email: string;
    subject: string;
    template: string;
    data: { [key: string]: any };
}

export const sendEmail = async (options: ISendEmailOptions): Promise<void> => {
    const transporter: Transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.NODE_ENV === "production" ? 465 : 587,
        secure: process.env.NODE_ENV === "production" ? true : false,
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const { email, subject, template, data } = options;

    // get the path to the email template file
    const emailTemplate = path.join(__dirname, `../templates/${template}.ejs`);

    // render the email template using EJS with the data
    const html: string = await ejs.renderFile(emailTemplate, data);

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        html,
    };

    await transporter.sendMail(mailOptions);
};
