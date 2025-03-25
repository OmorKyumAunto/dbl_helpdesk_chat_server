const { z } = require("zod");

// Common function for date validation (YYYY-MM-DD)
const dateSchema = () =>
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)");

// Common function for time validation (HH:MM - 24-hour format)
const timeSchema = () =>
  z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)");

const taskCreateSchema = z
  .object({
    description: z.string().optional(),
    sub_list_selected: z.array(z.number()).optional(), 
    start_date: dateSchema(),
    start_time: timeSchema(),
    is_assign: z.number().optional(),
    user_id: z.number().optional(),
    task_categories_id: z.number().optional(),
  });



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
      category: z
      .union([
        z.string().optional(),
        z.array(z.coerce.number().positive()).optional()
      ])
     .transform(value => {
     if (typeof value === "string") {
      return value.split(",").map(num => Number(num.trim())); 
     }
    return value || []; 
  }),

      assign_to: z.string().optional().refine(value => value === undefined || value > 0, {
        message: 'Assign to must be a positive number.',
      }),
      assign_from_others: z.string().optional().refine(value => value === undefined || value > 0, {
        message: 'Assign from others must be a positive number.',
      }),
      starred :z.string().optional().refine(value => value === undefined || value > 0, {
        message: 'starred must be a positive number.',
      }),
      start_date : dateSchema().optional(),
      end_date : dateSchema().optional(),
      user_id : z.string().optional().refine(value => value === undefined || value > 0, {
        message: 'User id must be a positive number.',
      }),
      task_status : z.enum(['incomplete', 'complete', 'inprogress']).optional(),
      unit_id : z.string().optional().refine(value => value === undefined || value > 0, {
        message: 'Unit id must be a positive number.',
      }),
    });
  
  
  const taskStarredUpdateSchema = z.object({
      starred: z.number(),
  });
    

const taskUpdateSchema = z
  .object({
    description: z.string().optional(),
    sub_list_selected: z.array(z.number()).optional(), 
    start_date: dateSchema().optional(),
    start_time: timeSchema().optional(),
  })
  

module.exports = { taskCreateSchema ,taskListSchema,taskStarredUpdateSchema,taskUpdateSchema};
