const { z, number } = require("zod");

// Notification schema
const notificationInfoSchema = z.object({
  token: z.string().min(1, { message: "Token is required" }), 
  platform: z.enum(["web", "android", "ios"], {
    errorMap: () => ({ message: "Platform must be one of 'web', 'android', or 'ios'" }) 
  }),
  device_id: z.string().min(1, { message: "Device id is required" }),
  device_info: z.string().optional(),
});



module.exports = { notificationInfoSchema };
