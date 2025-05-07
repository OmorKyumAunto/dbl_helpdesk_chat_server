const taskForwardEmailTemplate = async (data) => {
    return `
    <div style="font-family: Arial, sans-serif; background-color: #f7f9fc; color: #444444; line-height: 1.6; width: 100%; padding: 20px 0;">

    <!-- Main Container -->
    <table align="center" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 15px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); overflow: hidden;">
    
    <!-- Header -->
    <tr>
        <td style="background-color: #006666; padding: 40px; text-align: center; color: white; border-top-left-radius: 15px; border-top-right-radius: 15px;">
        <h1 style="font-size: 30px; margin: 0; font-weight: 700; letter-spacing: 1px;">New Task Assigned</h1>
        <p style="font-size: 16px; margin-top: 10px;">A task has been forwarded to you</p>
        </td>
    </tr>

    <!-- Main Content -->
    <tr>
        <td style="padding: 40px; color: #444444; font-size: 16px;">
        <h2 style="font-size: 24px; color: #006666; margin-top: 0;">Hello ${data.user_name},</h2>
        <p style="margin-bottom: 20px; font-size: 16px;">You have received the following task from another user:</p>

        <!-- Task Details -->
        <div style="background-color: #f1f9f9; border-radius: 10px; border: 1px solid #cce7e7; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); padding: 25px; font-size: 16px;">
            <table style="width: 100%; font-size: 16px; border-spacing: 0; line-height: 1.8;">
            <tr>
                <td style="font-weight: bold; padding: 8px 0; width: 40%; color: #006666;">Task Code:</td>
                <td style="padding: 8px 0;">${data.task_code}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; padding: 8px 0; color: #006666;">Category:</td>
                <td style="padding: 8px 0;">${data.category}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; padding: 8px 0; color: #006666;">Quantity:</td>
                <td style="padding: 8px 0;">${data.quantity}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; padding: 8px 0; color: #006666;">Start Date:</td>
                <td style="padding: 8px 0;">${data.start_date}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; padding: 8px 0; color: #006666;">Start Time:</td>
                <td style="padding: 8px 0;">${data.start_time}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; padding: 8px 0; color: #006666;">Forwarded By:</td>
                <td style="padding: 8px 0;">${data.forward_by} (ID: ${data.forward_by_id})</td>
            </tr>
            <tr>
                <td style="font-weight: bold; padding: 8px 0; color: #006666;">Unit:</td>
                <td style="padding: 8px 0;">${data.forward_by_unit}</td>
            </tr>
            </table>
        </div>

        <p style="margin-top: 30px; font-size: 16px;">
            Please log in to the <a href="https://helpdesk.dbl-group.com/" style="color: #006666; text-decoration: underline;">DBL IT Connect</a> to begin working on this task.
        </p>

        <!-- Closing -->
        <p style="margin-top: 40px; font-size: 16px; font-weight: bold;">Thank you,</p>
        <p style="font-size: 16px; font-weight: bold; color: #006666;">Task Management Team</p>
        </td>
    </tr>

    <!-- Footer -->
    <tr>
        <td style="background-color: #006666; padding: 15px; text-align: center; color: white; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px;">
        <p style="font-size: 14px;">This is an automated message. Please do not reply.</p>
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
    h1, h2, p, td {
        font-size: 90% !important;
    }
    }
    </style>
  
    `
}
  
const remainingTaskEmailTemplate = async (data) => {
    return `
 <div style="font-family: Arial, sans-serif; background-color: #f7f9fc; color: #444444; line-height: 1.6; width: 100%; padding: 20px 0;">

<!-- Main Container -->
<table align="center" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 15px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); overflow: hidden;">
  
  <!-- Header -->
  <tr>
    <td style="background-color: #003366; padding: 40px; text-align: center; color: white; border-top-left-radius: 15px; border-top-right-radius: 15px;">
      <h1 style="font-size: 30px; margin: 0; font-weight: 700; letter-spacing: 1px;">Upcoming Task Reminder</h1>
      <p style="font-size: 16px; margin-top: 10px;">Prepare for your scheduled task</p>
    </td>
  </tr>

  <!-- Main Content -->
  <tr>
    <td style="padding: 40px; color: #444444; font-size: 16px;">
      <h2 style="font-size: 24px; color: #003366; margin-top: 0;">Hello ${data.user_name},</h2>
      <p style="margin-bottom: 20px; font-size: 16px;">This is a reminder for your upcoming task. Please find the task details below:</p>

      <!-- Task Details -->
      <div style="background-color: #f4f8fc; border-radius: 10px; border: 1px solid #dde6f2; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); padding: 25px; font-size: 16px;">
        <table style="width: 100%; font-size: 16px; border-spacing: 0; line-height: 1.8;">
          <tr>
            <td style="font-weight: bold; padding: 8px 0; width: 40%; color: #003366;">Task Code:</td>
            <td style="padding: 8px 0;">${data.task_code}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px 0; color: #003366;">Category:</td>
            <td style="padding: 8px 0;">${data.category_title}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px 0; color: #003366;">Quantity:</td>
            <td style="padding: 8px 0;">${data.quantity}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px 0; color: #003366;">Start Date:</td>
            <td style="padding: 8px 0;">${data.start_date}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 8px 0; color: #003366;">Start Time:</td>
            <td style="padding: 8px 0;">${data.start_time}</td>
          </tr>
        </table>
      </div>

      <p style="margin-top: 30px; font-size: 16px;">
        You can view and manage this task in the <a href="https://helpdesk.dbl-group.com/" style="color: #003366; text-decoration: underline;">Task Management System</a>.
      </p>

      <!-- Closing -->
      <p style="margin-top: 40px; font-size: 16px; font-weight: bold;">Best regards,</p>
      <p style="font-size: 16px; font-weight: bold; color: #003366;">DBL IT Connect</p>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background-color: #003366; padding: 15px; text-align: center; color: white; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px;">
      <p style="font-size: 14px;">This is an automated message. Please do not reply.</p>
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
  h1, h2, p, td {
    font-size: 90% !important;
  }
}
</style>
    `
}
  

module.exports = {
 taskForwardEmailTemplate,
 remainingTaskEmailTemplate
}
  