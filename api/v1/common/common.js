const crypto = require("crypto");
require('dotenv').config();
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator')
const {ticketEmail} = require('../email-template/ticketEmail')


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




let sentEmailByHtmlFormate = async (receiverEmailAddress, subject,name = "", asset_name = "", type = "", asset_serial_number = "",assign_date = "",assign_by = "",unit_name="") => {
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
            html: await getHTMLBody(name,asset_name, type, asset_serial_number,assign_date,assign_by,unit_name)
        };
    
    
      // send email 
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
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

let sentTicketEmail = async (receiverEmailAddress, subject,data) => {
  console.log("first")
  // set transport
      var transporter = nodemailer.createTransport({
          service:process.env.send_email_service,
          host:process.env.send_email_host,
          port: process.env.send_email_port,
          secure: false,
          auth: {
              user: process.env.send_email_address,
              pass: process.env.send_email_password
          }
      });
  
      var mailOptions = {
          from: process.env.send_email_address,
          to: receiverEmailAddress,
          subject: subject,
          html: await ticketEmail(data)
      };
  
  console.log(" =====????")
    // send email 
      transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
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
  console.log(" ===== enmd ")
      
}

let getHTMLBody = async (name = "", asset_name = "", type = "", asset_serial_number = "",assign_date = "",assign_by = "",unit_name="") => {
    return `<div style="font-family: Arial, sans-serif; background-color: #e9f0f7; color: #444444; padding: 30px; line-height: 1.6; width: 100%;">

  <!-- Main Container (Table-based for Outlook compatibility) -->
  <table align="center" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 15px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);">
    
    <!-- VML Fallback for Outlook Border Radius -->
    <!--[if mso]>
    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="#" style="height: 600px; v-text-anchor:middle; width:600px;" arcsize="15%" strokecolor="#003366" fillcolor="#ffffff">
      <w:anchorlock/>
      <center style="color:#ffffff; font-family:sans-serif; font-size:16px;">Asset Assignment Notification</center>
    </v:roundrect>
    <![endif]-->
    
    <!-- Header -->
    <tr>
      <td style="background-color: #003366; padding: 40px; text-align: center; color: white; border-top-left-radius: 15px; border-top-right-radius: 15px;">
        <img src="https://i.postimg.cc/Df8xNNt0/DBL-Logo.jpg" alt="Company Logo" style="max-width: 100px; border-radius: 10%; margin-bottom: 5px;">
        <h1 style="font-size: 24px; margin: 0;">Asset Disbursement Notification</h1>
      </td>
    </tr>

    <!-- Main Content -->
    <tr>
      <td style="padding: 40px; color: #444444; font-size: 16px;">
        <h2 style="font-size: 22px; color: #003366;">Hello, ${name}</h2>
        <p>We are pleased to inform you that the following asset has been assigned to you:</p>

        <!-- Asset Details -->
        <div style="background-color: #f4f8fc; padding: 20px; border-radius: 10px; border: 1px solid #dde6f2; margin-top: 20px;">
          <p style="margin: 0;"><strong>Asset Name:</strong> ${asset_name}</p>
          <p style="margin: 0;"><strong>Asset Type:</strong> ${type}</p>
          <p style="margin: 0;"><strong>Serial Number:</strong> ${asset_serial_number}</p>
          <p style="margin: 0;"><strong>Assigned Date:</strong> ${assign_date}</p>
          <p style="margin: 0;"><strong>Assigned By:</strong> ${assign_by}</p>
          <p style="margin: 0;"><strong>Buying Unit:</strong> ${unit_name}</p>
        </div>

        <!-- Notes -->
        <p style="margin-top: 30px;">Please note the following guidelines:</p>
        <ul style="padding-left: 20px;">
          <li>Ensure proper usage and maintenance of the asset.</li>
          <li>Report any issues or damages to the IT department.</li>
          <li>Use the asset in accordance with company policies.</li>
        </ul>

        <p>If you have any questions, feel free to contact your IT Department.</p>

        <!-- Closing Section -->
        <p style="margin-top: 30px;">Regards,</p>
        <p><strong>IT Infrastructure and Operation</strong></p>

        <!-- Small Logo After Credentials -->
        <img src="https://i.postimg.cc/Df8xNNt0/DBL-Logo.jpg" alt="Company Logo" style="width: 60px; margin-top: 20px; border-radius: 10%;">
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #003366; padding: 20px; text-align: center; color: white; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px;">
        <p style="margin: 0;">This is an automated email, please do not reply.</p>
      </td>
    </tr>

  </table>
</div>

<!-- Responsive Styling -->
<style>
  @media (max-width: 600px) {
    table {
      width: 100% !important;
    }
    h1, h2, p {
      font-size: 90%;
    }
  }
</style>`
}


const rendomGenerator = ()=>{
 return otpGenerator.generate(6, { upperCaseAlphabets: true, digits: true });
}


module.exports = {
    decodingUsingCrypto,
    hashingUsingCrypto,
    sentEmailByHtmlFormate,
    rendomGenerator,
    sentTicketEmail
   
}