
const ticketEmail = async (data) => {
    return `
  <div style="font-family: Arial, sans-serif; background-color: #f7f9fc; color: #444444; line-height: 1.6; width: 100%; padding: 20px 0;">

  <!-- Main Container (Table-based for Outlook compatibility) -->
  <table align="center" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 15px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); overflow: hidden;">
    
    <!-- Header -->
    <tr>
      <td style="background-color: #003366; padding: 40px; text-align: center; color: white; border-top-left-radius: 15px; border-top-right-radius: 15px;">
        <h1 style="font-size: 30px; margin: 0; font-weight: 700; letter-spacing: 1px;">New Ticket Notification</h1>
        <p style="font-size: 16px; margin-top: 10px;">A notification for your attention</p>
      </td>
    </tr>

    <!-- Main Content -->
    <tr>
      <td style="padding: 40px; color: #444444; font-size: 16px;">
        <h2 style="font-size: 24px; color: #003366; margin-top: 0;">Hello,</h2>
        <p style="margin-bottom: 20px; font-size: 16px;">You have been assigned a new ticket. Please review the details below:</p>

        <!-- Ticket Details -->
        <div style="background-color: #f4f8fc; border-radius: 10px; border: 1px solid #dde6f2; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); padding: 25px; font-size: 16px;">
          <table style="width: 100%; font-size: 16px; border-spacing: 0; line-height: 1.8;">
            <tr>
              <td style="font-weight: bold; padding: 8px 0; width: 40%; color: #003366;">Ticket ID:</td>
              <td style="padding: 8px 0;">${data.ticket_id}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px 0; color: #003366;">Subject:</td>
              <td style="padding: 8px 0;">${data.subject}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px 0; color: #003366;">Priority:</td>
              <td style="padding: 8px 0; color: ${data.priority === 'High' ? '#d9534f' : data.priority === 'Medium' ? '#f0ad4e' : '#5cb85c'};">
                ${data.priority}
              </td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px 0; color: #003366;">Employee Name:</td>
              <td style="padding: 8px 0;">${data.created_by}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px 0; color: #003366;">Employee ID:</td>
              <td style="padding: 8px 0;">${data.created_employee_id}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px 0; color: #003366;">Ticketing Unit:</td>
              <td style="padding: 8px 0;">${data.unit_name}</td>
            </tr>
          </table>
        </div>

        <p style="margin-top: 30px; font-size: 16px; line-height: 1.8;">
          Please log in to the <a href="https://helpdesk.dbl-group.com/" style="color: #003366; text-decoration: underline;">IT Ticketing System</a> to manage this ticket.
        </p>
        <!-- Closing Section -->
        <p style="margin-top: 40px; font-size: 16px; font-weight: bold;">Regards,</p>
        <p style="font-size: 16px; font-weight: bold; color: #003366;">IT Support Team</p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #003366; padding: 15px; text-align: center; color: white; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px;">
        
        <p style=" font-size: 14px;">This is an automated email, please do not reply.</p>
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


const ticketCcEmail = async (data) => {
    return `

 <div style="font-family: Arial, sans-serif; background-color: #f7f9fc; color: #444444; line-height: 1.6; width: 100%;">

  <!-- Main Container (Table-based for Outlook compatibility) -->
  <table align="center" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 15px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <tr>
      <td style="background-color: #003366; padding: 40px; text-align: center; color: white; border-top-left-radius: 15px; border-top-right-radius: 15px;">
        <h1 style="font-size: 24px; margin: 0;">New Ticket Notification</h1>
        <p style="font-size: 14px; margin-top: 10px;">A notification for your attention</p>
      </td>
    </tr>

    <!-- Main Content -->
    <tr>
      <td style="padding: 40px; color: #444444; font-size: 16px;">
        <h2 style="font-size: 22px; color: #003366;">Hello ${data.supervisor_name},</h2>
        <p style="margin-bottom: 20px;">You have been added as a CC recipient for a new ticket created by ${data.created_by}. Please review the details below:</p>

        <!-- Ticket Details -->
        <div style="background-color: #f4f8fc; border-radius: 10px; border: 1px solid #dde6f2; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); padding: 20px;">
          <table style="width: 100%; font-size: 14px; border-spacing: 0; line-height: 1.8;">
            <tr>
              <td style="font-weight: bold; padding: 5px 0; width: 40%;">Ticket ID:</td>
              <td style="padding: 5px 0;">${data.ticket_id}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 5px 0;">Subject:</td>
              <td style="padding: 5px 0;">${data.subject}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 5px 0;">Priority:</td>
              <td style="padding: 5px 0; color: ${data.priority === 'High' ? '#d9534f' : data.priority === 'Medium' ? '#f0ad4e' : '#5cb85c'};">
                ${data.priority}
              </td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 5px 0;">Employee Name:</td>
              <td style="padding: 5px 0;">${data.created_by}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 5px 0;">Employee ID:</td>
              <td style="padding: 5px 0;">${data.created_employee_id}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 5px 0;">Ticketing Unit:</td>
              <td style="padding: 5px 0;">${data.unit_name}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 5px 0;">Ticket Message:</td>
              <td style="padding: 5px 0;">${data.ticket_message}</td>
            </tr>
          </table>
        </div>

        <p style="margin-top: 30px; line-height: 1.8;">
          Please log in to the <a href="https://helpdesk.dbl-group.com/" style="color: #003366; text-decoration: underline;">IT Ticketing System</a> to manage this ticket.
        </p>
        <!-- Closing Section -->
        <p style="margin-top: 40px;">Regards,</p>
        <p style="font-weight: bold;">IT Support Team</p>
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
    td {
      font-size: 90%;
    }
  }
</style>

    `
}

module.exports = {
    ticketEmail,
    ticketCcEmail
}
