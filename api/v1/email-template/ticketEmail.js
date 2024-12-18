
const ticketEmail = async(data)=>{
    return`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Ticket Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f7f9fc; color: #333;">

    <!-- Email Wrapper -->
    <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f9fc; padding: 20px;">
        <tr>
            <td>
                <!-- Email Container -->
                <table width="600" cellspacing="0" cellpadding="0" align="center" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header Section -->
                    <tr>
                        <td style="background-color: #003366; padding: 20px; text-align: center;">
                            <img src="https://i.postimg.cc/Df8xNNt0/DBL-Logo.jpg" alt="DBL Logo" style="width: 100px; border-radius: 8px; margin-bottom: 10px;">
                            <h1 style="color: #ffffff; font-size: 22px; margin: 0;">New Ticket Notification</h1>
                        </td>
                    </tr>

                    <!-- Body Section -->
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="font-size: 20px; color: #003366; margin: 0 0 15px;">Hello Admin,</h2>
                            <p style="font-size: 16px; line-height: 1.8; color: #555;">
                                A new ticket has been assigned to you. Below are the details:
                            </p>

                            <!-- Ticket Details -->
                            <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 12px; background-color: #f3f4f7; font-weight: bold; color: #003366; border-radius: 6px 0 0 6px;">Ticket ID:</td>
                                    <td style="padding: 12px; background-color: #f3f4f7; border-radius: 0 6px 6px 0;">${data.ticket_id}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; color: #003366; font-weight: bold;">Subject:</td>
                                    <td style="padding: 12px; color: #555;">${data.subject}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; background-color: #f3f4f7; font-weight: bold; color: #003366; border-radius: 6px 0 0 6px;">Priority:</td>
                                    <td style="padding: 12px; background-color: #f3f4f7; border-radius: 0 6px 6px 0;">${data.priority}</td>
                                </tr>
 <tr>
                                    <td style="padding: 12px; color: #003366; font-weight: bold;">Employee Name:</td>
                                    <td style="padding: 12px; color: #555;">${data.created_by}</td>
                                </tr>
 <tr>
                                    <td style="padding: 12px; color: #003366; font-weight: bold;">Employee ID:</td>
                                    <td style="padding: 12px; color: #555;">${data.created_employee_id}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; color: #003366; font-weight: bold;">Unit Name:</td>
                                    <td style="padding: 12px; color: #555;">${data.unit_name}</td>
                                </tr>
                            </table>

                            <p style="font-size: 16px; line-height: 1.8; color: #555;">
                                Please log in to the <a href="[Your Web App Link]" style="color: #003366; font-weight: bold; text-decoration: none;">Ticketing System</a> to manage this ticket.
                            </p>
                        </td>
                    </tr>

                    <!-- Call to Action -->
                    <tr>
                        <td style="text-align: center; padding: 20px;">
                            <a href="[Your Web App Link]" style="display: inline-block; padding: 12px 30px; background-color: #003366; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">View Ticket</a>
                        </td>
                    </tr>

                    <!-- Footer Section -->
                    <tr>
                        <td style="background-color: #f7f9fc; text-align: center; padding: 20px; font-size: 14px; color: #888;">
                            <p style="margin: 0;">&copy; 2024 DBL Group. All Rights Reserved.</p>
                            <p style="margin: 5px 0;">Need help? Contact <a href="mailto:support@dblgroup.com" style="color: #003366; text-decoration: none;">support@dblgroup.com</a>.</p>
                        </td>
                    </tr>

                </table>
                <!-- End Email Container -->
            </td>
        </tr>
    </table>

</body>
</html>


    `
}


const ticketCcEmail = async(data)=>{   
    return`

    <!DOCTYPE html>
   <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Ticket Notification (Supervisor)</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f7f9fc; color: #333;">

    <!-- Email Wrapper -->
    <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f9fc; padding: 20px;">
        <tr>
            <td>
                <!-- Email Container -->
                <table width="600" cellspacing="0" cellpadding="0" align="center" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header Section -->
                    <tr>
                        <td style="background-color: #003366; padding: 20px; text-align: center;">
                            <img src="https://i.postimg.cc/Df8xNNt0/DBL-Logo.jpg" alt="DBL Logo" style="width: 100px; border-radius: 8px; margin-bottom: 10px;">
                            <h1 style="color: #ffffff; font-size: 22px; margin: 0;">New Ticket Created</h1>
                        </td>
                    </tr>

                    <!-- Body Section -->
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="font-size: 20px; color: #003366; margin: 0 0 15px;">Hello ${data.supervisor_name},</h2>
                            <p style="font-size: 16px; line-height: 1.8; color: #555;">
                                You have been CC'd on a new ticket created by ${data.created_by}. Here are the details:
                            </p>

                            <!-- Ticket Details -->
                            <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 12px; background-color: #f3f4f7; font-weight: bold; color: #003366; border-radius: 6px 0 0 6px;">Ticket ID:</td>
                                    <td style="padding: 12px; background-color: #f3f4f7; border-radius: 0 6px 6px 0;">${data.ticket_id}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; color: #003366; font-weight: bold;">Subject:</td>
                                    <td style="padding: 12px; color: #555;">${data.subject}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; background-color: #f3f4f7; font-weight: bold; color: #003366; border-radius: 6px 0 0 6px;">Priority:</td>
                                    <td style="padding: 12px; background-color: #f3f4f7; border-radius: 0 6px 6px 0;">${data.priority}</td>
                                </tr>
                                                                </tr>
                                <tr>
                                    <td style="padding: 12px; background-color: #f3f4f7; font-weight: bold; color: #003366; border-radius: 6px 0 0 6px;">Created By:</td>
                                    <td style="padding: 12px; background-color: #f3f4f7; border-radius: 0 6px 6px 0;">${data.created_by}</td>
                                </tr>

 <tr>
                                    <td style="padding: 12px; color: #003366; font-weight: bold;">Employee ID:</td>
                                    <td style="padding: 12px; color: #555;">${data.created_employee_id}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; color: #003366; font-weight: bold;">Unit Name:</td>
                                    <td style="padding: 12px; color: #555;">${data.unit_name}</td>

                            </table>

                            <p style="font-size: 16px; line-height: 1.8; color: #555;">
                                Please note that you are CC'd on this ticket. You can view the ticket details and stay informed about its progress.
                            </p>
                        </td>
                    </tr>

                    <!-- Call to Action -->
                    <tr>
                        <td style="text-align: center; padding: 20px;">
                            <a href="[Your Web App Link]" style="display: inline-block; padding: 12px 30px; background-color: #003366; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">View Ticket</a>
                        </td>
                    </tr>

                    <!-- Footer Section -->
                    <tr>
                        <td style="background-color: #f7f9fc; text-align: center; padding: 20px; font-size: 14px; color: #888;">
                            <p style="margin: 0;">&copy; 2024 DBL Group. All Rights Reserved.</p>
                            <p style="margin: 5px 0;">For support, contact <a href="mailto:support@dblgroup.com" style="color: #003366; text-decoration: none;">support@dblgroup.com</a>.</p>
                        </td>
                    </tr>

                </table>
                <!-- End Email Container -->
            </td>
        </tr>
    </table>

</body>
</html>



    `
}

module.exports = {
    ticketEmail,
    ticketCcEmail
}