const { z } = require("zod");

// Common function for date validation (YYYY-MM-DD)
const dateSchema = () =>
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)");

// Common function for time validation (HH:MM - 24-hour format)
const timeSchema = () =>
  z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)");

const taskCreateSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(255, "Title maximum value 255 characters"),
    description: z.string().min(1, "Description is required"),
    start_date: dateSchema(),
    end_date: dateSchema(),
    start_time: timeSchema(),
    end_time: timeSchema(),
    is_assign: z.number().optional(),
    user_id: z.number().optional(),
    task_categories_id: z.number()
  })
  .refine((data) => new Date(data.start_date) <= new Date(data.end_date), {
    message: "Start date cannot be later than end date",
    path: ["start_date"],
  })
  .refine(
    (data) =>
      data.start_date !== data.end_date || data.start_time <= data.end_time,
    {
      message: "Start time cannot be later than end time on the same day",
      path: ["start_time"],
    }
  );


module.exports = { taskCreateSchema };
