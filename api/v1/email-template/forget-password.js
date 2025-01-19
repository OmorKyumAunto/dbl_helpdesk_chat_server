
const forgetPasswordSendOtpTemplate = async (data) => {
  return `
<div style="font-family: Arial, sans-serif; background-color: #f7f9fc; color: #444444; line-height: 1.6; width: 100%; padding: 20px 0;">

  <!-- Main Container (Table-based for Outlook compatibility) -->
  <table align="center" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 15px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); overflow: hidden;">
    
    <!-- Header -->
    <tr>
      <td style="background-color: #003366; padding: 40px; text-align: center; color: white; border-top-left-radius: 15px; border-top-right-radius: 15px;">
        <h1 style="font-size: 30px; margin: 0; font-weight: 700; letter-spacing: 1px;">DBL IT Helpdesk</h1>
        <p style="font-size: 16px; margin-top: 10px;">Password Reset Request</p>
      </td>
    </tr>

    <!-- Main Content -->
    <tr>
      <td style="padding: 40px; color: #444444; font-size: 16px;">
        <h2 style="font-size: 24px; color: #003366; margin-top: 0;">Hello ${data.name},</h2>
        <p style="margin-bottom: 20px; font-size: 16px;">You recently requested to reset your password. Use the OTP code below to proceed:</p>

        <!-- OTP Code -->
        <div style="background-color: #f4f8fc; border-radius: 10px; border: 1px solid #dde6f2; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); padding: 25px; text-align: center; font-size: 24px; font-weight: bold; color: #003366;">
          ${data.otp}
        </div>

        <p style="margin-top: 30px; font-size: 16px; line-height: 1.8;">
          This code is valid for the next <strong>5 minutes</strong>. If you did not request this, please ignore this email or contact support immediately.
        </p>

        <!-- Closing Section -->
        <p style="margin-top: 40px; font-size: 16px; font-weight: bold;">Thank you,</p>
        <p style="font-size: 16px; font-weight: bold; color: #003366;">IT Support Team</p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #003366; padding: 15px; text-align: center; color: white; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px;">
        <p style="font-size: 14px;">This is an automated email, please do not reply.</p>
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
  td {
    font-size: 90%;
  }
}
</style>



  `
}

const resetPasswordComplete = async (data) => {
  console.log("data",data)
  return `
<div style="font-family: Arial, sans-serif; background-color: #f7f9fc; color: #444444; line-height: 1.6; width: 100%; padding: 20px 0;">

  <!-- Main Container (Table-based for Outlook compatibility) -->
  <table align="center" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 15px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); overflow: hidden;">
    
    <!-- Header -->
    <tr>
      <td style="background-color: #003366; padding: 40px; text-align: center; color: white; border-top-left-radius: 15px; border-top-right-radius: 15px;">
        <h1 style="font-size: 30px; margin: 0; font-weight: 700; letter-spacing: 1px;">DBL IT Helpdesk</h1>
        <p style="font-size: 16px; margin-top: 10px;">Password Reset Completed<br>Your account is secure</p>
      </td>
    </tr>

    <!-- Main Content -->
    <tr>
      <td style="padding: 40px; color: #444444; font-size: 16px;">
        <h2 style="font-size: 24px; color: #003366; margin-top: 0;">Hello ${data},</h2>
        <p style="margin-bottom: 20px; font-size: 16px;">
          Your password has been successfully reset. If you did not make this change, please contact our support team immediately.
        </p>

     

        <p style="margin-top: 30px; font-size: 16px; line-height: 1.8;">
          If you have any concerns or require further assistance, please reach out to our support team via email or visit our <a href="https://helpdesk.dbl-group.com/" style="color: #003366; text-decoration: underline;">IT Helpdesk Portal</a>.
        </p>

        <!-- Closing Section -->
        <p style="margin-top: 40px; font-size: 16px; font-weight: bold;">Thank you,</p>
        <p style="font-size: 16px; font-weight: bold; color: #003366;">IT Support Team</p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #003366; padding: 15px; text-align: center; color: white; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px;">
        <p style="font-size: 14px;">This is an automated email, please do not reply.</p>
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
  td {
    font-size: 90%;
  }
}
</style>

  `
}


module.exports = {
  forgetPasswordSendOtpTemplate,
  resetPasswordComplete
}
