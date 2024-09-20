const crypto = require("crypto");
require('dotenv').config();
const nodemailer = require('nodemailer');

let decodingUsingCrypto = async (text = "") => {
    const key = Buffer.from(
        "xNRxA48aNYd33PXaODSutRNFyCu4cAe/InKT/Rx+bw0=",
        "base64"
    );
    const iv = Buffer.from("81dFxOpX7BPG1UpZQPcS6w==", "base64");
    const algorithm = "aes-256-cbc";

    let encryptedText = Buffer.from(text, "hex");
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);

    let decrypted = decipher.update(encryptedText);


    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
};


const jwksClient = require('jwks-rsa');



let hashingUsingCrypto = async (text = "") => {
    const key = Buffer.from(
        "xNRxA48aNYd33PXaODSutRNFyCu4cAe/InKT/Rx+bw0=",
        "base64"
    );

    if (typeof (text) !== "string") text = text.toString();


    const iv = Buffer.from("81dFxOpX7BPG1UpZQPcS6w==", "base64");
    const algorithm = "aes-256-cbc";

    // Creating Cipheriv with its parameter
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);

    // Updating text
    let encrypted = cipher.update(text);

    // Using concatenation
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString("hex");
};






let sentEmailByHtmlFormate = async (receiverEmailAddress, subject,name = "", asset_name = "", type = "", asset_serial_number = "",created_at="",unit="") => {
    // set transport
        var transporter = nodemailer.createTransport({
            service:process.env.send_email_service,
            host:process.env.send_email_host,
            port: process.env.send_email_port,
            secure: true,
            auth: {
                user: process.env.send_email_address,
                pass: process.env.send_email_password
            }
        });
    
        
        var mailOptions = {
            from: process.env.send_email_address,
            to: receiverEmailAddress,
            subject: subject,
            html: await getHTMLBody(asset_name, type, asset_serial_number,created_at,unit)
        };
    
    
      // send email 
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                // console.log(error);
                return {
                    success: false,
                    message: "Email send fail"
                }
            } else {
                return {
                    success: true,
                    message: "Email send successfully done"
                }
            }
        });
        
    }
let getHTMLBody = async (name = "",asset_name = "",type = "", asset_serial_number = "", created_at = "",unit="") => {
    return `<div style="font-family: 'Roboto', sans-serif; background-color: #f0f4f8; color: #4a4a4a; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1); overflow: hidden;">
        
        <!-- Header Section -->
        <div style="background: linear-gradient(135deg, #003366, #0055aa); padding: 30px; text-align: center; color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <img src="[LOGO_URL]" alt="Company Logo" style="max-width: 100px; margin-bottom: 15px;">
            <h1 style="font-size: 24px; font-weight: 700; margin: 0;">Asset Disbursement Notification</h1>
        </div>

        <!-- Content Section -->
        <div style="padding: 30px;">
            <h2 style="color: #003366; font-size: 20px; font-weight: 600;">Hello, <strong>${name}</strong>,</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #666;">We are excited to inform you that the following asset has been assigned to you:</p>

            <!-- Asset Details Section -->
            <div style="background-color: #f9f9f9; border-radius: 12px; margin: 20px 0; padding: 20px; border: 1px solid #e0e0e0; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);">
                <h3 style="font-size: 18px; color: #003366; margin-bottom: 10px; font-weight: 500;">Asset Details</h3>
                <p style="margin: 5px 0; font-size: 16px; color: #444;"><strong>Asset Name:</strong> ${asset_name}</p>
                <p style="margin: 5px 0; font-size: 16px; color: #444;"><strong>Asset Type:</strong> ${type}</p>
                <p style="margin: 5px 0; font-size: 16px; color: #444;"><strong>Serial Number:</strong> ${asset_serial_number}</p>
                <p style="margin: 5px 0; font-size: 16px; color: #444;"><strong>Assigned Date:</strong> ${created_at}</p>
                <p style="margin: 5px 0; font-size: 16px; color: #444;"><strong>Assigned By:</strong> [Admin/SuperAdmin Name]</p>
                <p style="margin: 5px 0; font-size: 16px; color: #444;"><strong>Buying Unit:</strong> ${unit}</p>
            </div>

            <!-- Guidelines Section -->
            <div style="margin-top: 30px;">
                <p style="font-size: 15px; color: #555;">Please take note of the following guidelines regarding your assigned asset:</p>
                <ul style="padding-left: 20px; font-size: 15px; color: #555;">
                    <li style="margin-bottom: 10px;">Ensure proper and safe usage of the asset.</li>
                    <li style="margin-bottom: 10px;">Report any issues or damages to the IT department promptly.</li>
                    <li style="margin-bottom: 10px;">Ensure the asset remains within company premises unless authorized for remote use.</li>
                </ul>
            </div>

            <p style="font-size: 16px; color: #666;">If you have any questions or need assistance, feel free to reach out to your IT department.</p>

            <!-- Credentials Section -->
            <div style="margin-top: 30px; font-size: 16px; color: #333;">
                <p style="margin: 0; padding: 5px 0;">Regards,</p>
                <p style="margin: 0; padding: 5px 0;"><strong>IT Infrastructure and Operation</strong></p>
                

                <!-- Company Logo after Credentials -->
                <div style="margin-top: 15px; text-align: left;">
                    <img src="[LOGO_URL]" alt="Company Logo" style="max-width: 60px; display: block; margin-top: 10px;">
                </div>
            </div>
        </div>

        <!-- Footer Section -->
        <div style="background-color: #003366; color: white; text-align: center; padding: 20px;">
            <p style="font-size: 14px; margin: 0;">This is an automated email. Please do not reply to this message.</p>
        </div>
    </div>
</div>

<!-- Add responsive styling -->
<style>
    @media (max-width: 600px) {
        div[style*="max-width: 600px"] {
            max-width: 100%;
            padding: 20px;
            box-sizing: border-box;
        }
        .header img {
            max-width: 80px;
        }
        .content h2 {
            font-size: 18px;
        }
        .asset-details h3 {
            font-size: 16px;
        }
        .footer p {
            font-size: 13px;
        }
        .credentials p {
            font-size: 14px;
        }
    }
</style>`
}




module.exports = {
    decodingUsingCrypto,
    hashingUsingCrypto,
    sentEmailByHtmlFormate
   
}