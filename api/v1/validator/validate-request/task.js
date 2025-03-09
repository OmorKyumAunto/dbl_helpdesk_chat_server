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
    task_categories_id: z.number().optional()
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



  const taskListSchema = z
    .object({
      key: z.string().optional().refine(value => value === undefined || value.length > 0, {
        message: 'The search key must be a non-empty string.',
      }),
      limit: z.string().optional().refine(value => value === undefined || value > 0, {
        message: 'Limit must be a positive number.',
      }),
      offset: z.string().optional().refine(value => value === undefined || value >= 0, {
        message: 'Offset must be a non-negative number.',
      }),
      category: z.string().optional().refine(value => value === undefined || value > 0, {
        message: 'Category ID must be a positive number.',
      }),
    });
  
  
  const taskStarredUpdateSchema = z.object({
      starred: z.number(),
  });
    

  const taskUpdateSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    start_date: dateSchema().optional(),
    end_date: dateSchema().optional(),
    start_time: timeSchema().optional(),
    end_time: timeSchema().optional(),
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

module.exports = { taskCreateSchema ,taskListSchema,taskStarredUpdateSchema,taskUpdateSchema};
