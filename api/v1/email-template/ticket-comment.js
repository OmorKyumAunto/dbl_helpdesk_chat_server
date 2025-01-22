
const commentEmployeeToAdmin = async (data) => {
  return `
<div style="font-family: Arial, sans-serif; background-color: #f7f9fc; color: #444444; line-height: 1.6; width: 100%; padding: 20px 0;">
  <table align="center" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 15px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); overflow: hidden;">

    <!-- Header -->
    <tr>
      <td style="background-color: #003366; padding: 40px; text-align: center; color: white; border-top-left-radius: 15px; border-top-right-radius: 15px;">
        <h1 style="font-size: 30px; margin: 0; font-weight: 700; letter-spacing: 1px;">DBL IT Connect</h1>
        <p style="font-size: 16px; margin-top: 10px;">Comment from ${data.employee_name}</p>
      </td>
    </tr>

    <!-- Main Content -->
    <tr>
      <td style="padding: 40px; color: #444444; font-size: 16px;">
        <h2 style="font-size: 24px; color: #003366; margin-top: 0;">Hello Admin,</h2>
        <p style="margin-bottom: 20px; font-size: 16px;">A user has posted a comment on a ticket:</p>

       

        <!-- Ticket Details -->
        <div style="background-color: #f4f8fc; margin-bottom: 20px; border-radius: 10px; border: 1px solid #dde6f2; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); padding: 20px; font-size: 16px;">
          <table style="width: 100%; font-size: 16px; border-spacing: 0; line-height: 1.8;">
            <tr>
                <td style="font-weight: bold; padding: 8px 0; color: #003366;">User:</td>
              <td style="padding: 8px 0;">${data.employee_name}</td>
            </tr>
              <td style="font-weight: bold; padding: 8px 0; width: 40%; color: #003366;">Ticket ID:</td>
              <td style="padding: 8px 0;">${data.ticket_id}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px 0; color: #003366;">Subject:</td>
              <td style="padding: 8px 0;">${data.subject}</td>
            </tr>
            <tr>
              
          </table>
        </div>
         <!-- Comment Section -->
        <div style="background-color: #f4f8fc; border-radius: 10px; border: 1px solid #dde6f2; padding: 20px; margin-bottom: 20px;">
          <p style="font-size: 16px; color: #003366; font-weight: bold;">Comment:</p>
          <p style="font-size: 16px;">"${data.comment}"</p>
        </div>

        <p style="margin-top: 30px; font-size: 16px; line-height: 1.8;">
          Please log in to the <a href="https://helpdesk.dbl-group.com/" style="color: #003366; text-decoration: underline;">IT Ticketing System</a> to view and respond to the comment.
        </p>
        <p style="margin-top: 40px; font-size: 16px; font-weight: bold;">Regards,</p>
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



  `
}


const commentAdminToEmployee = async (data) => {
  return `
<div style="font-family: Arial, sans-serif; background-color: #f7f9fc; color: #444444; line-height: 1.6; width: 100%; padding: 20px 0;">
  <table align="center" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 15px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); overflow: hidden;">

    <!-- Header -->
    <tr>
      <td style="background-color: #003366; padding: 40px; text-align: center; color: white; border-top-left-radius: 15px; border-top-right-radius: 15px;">
        <h1 style="font-size: 30px; margin: 0; font-weight: 700; letter-spacing: 1px;">DBL IT Connect</h1>
        <p style="font-size: 16px; margin-top: 10px;">A message from the IT Support Team</p>
      </td>
    </tr>

    <!-- Main Content -->
    <tr>
      <td style="padding: 40px; color: #444444; font-size: 16px;">
        <h2 style="font-size: 24px; color: #003366; margin-top: 0;">Hello ${data.employee_name_name},</h2>
        <p style="margin-bottom: 20px; font-size: 16px;">An admin has posted a comment on your ticket:</p>

        

        <!-- Ticket Details -->
        <div style="background-color: #f4f8fc; border-radius: 10px; border: 1px solid #dde6f2; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);margin-bottom: 20px; padding: 20px; font-size: 16px;">
          <table style="width: 100%; font-size: 16px; border-spacing: 0; line-height: 1.8;">
            <tr>
              <td style="font-weight: bold; padding: 8px 0; width: 40%; color: #003366;">Ticket ID:</td>
              <td style="padding: 8px 0;">${data.ticket_id}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px 0; color: #003366;">Subject:</td>
              <td style="padding: 8px 0;">${data.subject}</td>
            </tr>
          </table>
        </div>
        
        <!-- Comment Section -->
        <div style="background-color: #f4f8fc; border-radius: 10px; border: 1px solid #dde6f2; padding: 20px; ">
          <p style="font-size: 16px; color: #003366; font-weight: bold;">Comment:</p>
          <p style="font-size: 16px;">"${data.comment}"</p>
        </div>

        <p style="margin-top: 30px; font-size: 16px; line-height: 1.8;">
          Please log in to the <a href="https://helpdesk.dbl-group.com/" style="color: #003366; text-decoration: underline;">IT Ticketing System</a> to view and respond to the comment.
        </p>
        <p style="margin-top: 40px; font-size: 16px; font-weight: bold;">Regards,</p>
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


  `
}


module.exports = {
  commentEmployeeToAdmin,
  commentAdminToEmployee
}
