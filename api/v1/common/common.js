const crypto = require("crypto");
require('dotenv').config();
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator')
const {ticketEmail,ticketCcEmail,ticketSolvedEmailTemplate,ticketOnBehalf} = require('../email-template/ticketEmail')
const {commentEmployeeToAdmin,commentAdminToEmployee} = require('../email-template/ticket-comment')
const {forgetPasswordSendOtpTemplate,resetPasswordComplete} = require('../email-template/forget-password')
const { taskForwardEmailTemplate,remainingTaskEmailTemplate} = require('../email-template/task-email')
const moment = require("moment-timezone");

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


let hashingUsingCrypto = async (text = "") => {
    const key = Buffer.from(
        "xNRxA48aNYd33PXaODSutRNFyCu4cAe/InKT/Rx+bw0=",
        "base64"
    );

    if (typeof (text) !== "string") text = text.toString();


    const iv = Buffer.from("81dFxOpX7BPG1UpZQPcS6w==", "base64");
    const algorithm = "aes-256-cbc";

    // Creating Cipher with its parameter
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

let sentTicketEmail = async (receiverEmailAddress, subject,data,cc) => {
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


let sentTicketCcEmail = async (receiverEmailAddress, subject, data) => {
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
          html: await ticketCcEmail(data)
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



let forgetPasswordSendOtp = async (receiverEmailAddress, subject, data) => {
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
          html: await forgetPasswordSendOtpTemplate(data)
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

let passwordResetSuccessful = async (receiverEmailAddress, subject, data) => {
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
          html: await resetPasswordComplete(data)
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

// create ticket comment employee to admin
let ticketCommentEmployeeToAdmin = async (receiverEmailAddress, subject, data) => {
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
            html: await commentEmployeeToAdmin(data)
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


let ticketCommentAdminToEmployee = async (receiverEmailAddress, subject, data) => {
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
            html: await commentAdminToEmployee(data)
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


let ticketSolvedEmail = async (receiverEmailAddress, subject, data) => {
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
            html: await ticketSolvedEmailTemplate(data)
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


let taskForwardEmail = async (receiverEmailAddress, subject,data,cc) => {
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
            html: await taskForwardEmailTemplate(data)
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
// task remaining email
let taskRemainingEmail = async (receiverEmailAddress, subject,data,cc) => {
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
            html: await remainingTaskEmailTemplate(data)
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

let sentTicketOnBehalfEmail = async (receiverEmailAddress, subject,data,cc) => {
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
          html: await ticketOnBehalf(data)
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


let getHTMLBody = async (name = "", asset_name = "", type = "", asset_serial_number = "",assign_date = "",assign_by = "",unit_name="") => {
    return ` <div style="font-family: Arial, sans-serif; background-color: #f3f4f6; color: #444444; padding: 20px; width: 100%;">

  <!-- Main Container -->
  <table align="center" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #dddddd;">

    <!-- Header Section -->
    <tr>
      <td style="background-color: #003366; padding: 20px; text-align: center; color: white;">
        <img 
          src="https://www.dropbox.com/scl/fi/92203jo81u7ui9xxdhhye/DBL-Logo.jpg?rlkey=3qu2kkolcqm0otly31d7a0wmo&st=hr3xfp7b&raw=1" 
          alt="Company Logo" 
          width="80" 
          style="display: block; margin: auto; border-radius: 10%;">
        <h1 style="font-size: 20px; margin: 10px 0 0; color: white;">Asset Assignment Notification</h1>
      </td>
    </tr>

    <!-- Main Content Section -->
    <tr>
      <td style="padding: 20px; font-size: 14px; color: #444444;">
        <h2 style="font-size: 18px; color: #003366; margin-top: 0;">Hello ${name},</h2>
        <p>We are pleased to inform you that the following asset has been assigned to you:</p>

        <!-- Asset Details -->
        <div style="background-color: #f4f8fc; padding: 15px; border-radius: 5px; border: 1px solid #dde6f2; margin-top: 20px;">
          <p style="margin: 0;"><strong>Asset Name:</strong> ${asset_name}</p>
          <p style="margin: 0;"><strong>Asset Type:</strong> ${type}</p>
          <p style="margin: 0;"><strong>Serial Number:</strong> ${asset_serial_number}</p>
          <p style="margin: 0;"><strong>Assigned Date:</strong> ${assign_date}</p>
          <p style="margin: 0;"><strong>Assigned By:</strong> ${assign_by}</p>
          <p style="margin: 0;"><strong>Buying Unit:</strong> ${unit_name}</p>
        </div>

        <!-- Notes -->
        <p style="margin-top: 20px;">Please note the following guidelines:</p>
        <ul style="padding-left: 20px;">
          <li>Ensure proper usage and maintenance of the asset.</li>
          <li>Report any issues or damages to the IT department.</li>
          <li>Use the asset in accordance with company policies.</li>
        </ul>

        <p>If you have any questions, feel free to contact your IT Department.</p>
        <p style="font-size: 14px; color: #444444; line-height: 1.6;">
  For more about your IT Asset Info, visit 
  <a href="https://helpdesk.dbl-group.com" target="_blank" style="text-decoration: none; color: #003366; font-weight: bold;">
    DBL Group Asset Management System
  </a>
</p>

        <!-- Closing Section -->
        <p style="margin-top: 10px;">Regards,</p>
        <p><strong>IT Infrastructure and Operation</strong></p>

        <!-- Small Logo -->
        <img 
          src="https://www.dropbox.com/scl/fi/92203jo81u7ui9xxdhhye/DBL-Logo.jpg?rlkey=3qu2kkolcqm0otly31d7a0wmo&st=hr3xfp7b&raw=1" 
          alt="Company Logo" 
          width="60" 
          height="60" 
          style="display: block; margin:2px auto 0; border-radius: 10%;">
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #003366; padding: 10px; text-align: center; color: white;">
        <p style="margin: 0; font-size: 12px;">This is an automated email, please do not reply.</p>
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
</style>


`
}

const randomGenerator = () => {
  return otpGenerator.generate(6, { 
      digits: true, 
      upperCaseAlphabets: false, 
      lowerCaseAlphabets: false, 
      specialChars: false 
  });
};



const convertTimeStringTo12Hour = (timeStr) => {
    const [hour, minute] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  
const convertDateFormat = (dateStr) => {
    const date = new Date(dateStr);
    // Add 6 hours (6 * 60 * 60 * 1000 milliseconds)
    date.setHours(date.getHours() + 6);
  
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
  
    // Function to add 'st', 'nd', 'rd', 'th'
    const getOrdinal = (n) => {
      if (n > 3 && n < 21) return 'th';
      switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
  
    return `${day}${getOrdinal(day)} ${month} ${year}`;
  };

const  checkEmailFormat = (email) => {
    return email.endsWith('@gmail.com') || email.endsWith('@yahoo.com');
}

const convertFormatDate = (inputDate) => {
    const formattedDate = moment(inputDate, 'DD MMM YYYY').format('YYYY-MM-DD');
    return formattedDate;
}

module.exports = {
    decodingUsingCrypto,
    hashingUsingCrypto,
    sentEmailByHtmlFormate,
    randomGenerator,
    sentTicketEmail,
    sentTicketCcEmail,
    forgetPasswordSendOtp,
    passwordResetSuccessful,
    ticketCommentEmployeeToAdmin,
    ticketCommentAdminToEmployee,
    ticketSolvedEmail,
    taskForwardEmail,
    convertTimeStringTo12Hour,
    convertDateFormat,
    taskRemainingEmail,
    checkEmailFormat,
    sentTicketOnBehalfEmail,
    convertFormatDate
}