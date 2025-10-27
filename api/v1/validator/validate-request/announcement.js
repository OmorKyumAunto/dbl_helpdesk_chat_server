const { z, number } = require("zod");
const moment = require("moment");

// announcement send schema
const sendAnnouncementSchema = z.object({
  unit_id: z.array(
    z.number().refine((val) => val > 0, {
      message: "Each Unit ID must be a positive number",
    })
  ).optional(),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
 announcement_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Date must be in the format yyyy-mm-dd",
    })
    .refine((val) => {
      const inputDate = moment(val, "YYYY-MM-DD", true);
      const today = moment().startOf("day");
      return inputDate.isSameOrAfter(today);
    }, {
      message: "Announcement date cannot be a previous day",
    }),
  break_time: z.string().optional(),
  priority: z.enum(["high", "medium", "low"], {
    required_error: "Priority is required",
  }),
});



module.exports = { sendAnnouncementSchema };
