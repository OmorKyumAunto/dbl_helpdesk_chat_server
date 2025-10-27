const { z, number } = require("zod");

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // Extract YYYY-MM-DD
};

// Date validation schema (must be today or a future date)
const dateSchema = () =>
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .refine(
      (date) => date >= getTodayDate(),
      "Start date must be today or a future date"
    );

const dateFormat = () =>
      z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")


  const numericString = (fieldName) =>
  z.string({
    required_error: `${fieldName} is required`,
    invalid_type_error: `${fieldName} must be a number`
  })
  .regex(/^\d+$/, { message: `${fieldName} must be a number` })
  .transform((val) => Number(val));    
    

// Common function for time validation (HH:MM - 24-hour format)
const timeSchema = () =>
  z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)");


  
const reRaiseTicketCommentSchema = z.object({
  comment: z
    .string()
    .min(1, { message: "Comment cannot be empty." }) 
    .max(500, { message: "Comment must be less than 500 characters." }) 
    .refine(val => !/^\s*$/.test(val), { message: "Comment cannot be just whitespace." })
});


const onBehalfTicketSchema = z.object({
  category_id: numericString("Category ID"),

  priority: z.enum(["high", "low", "medium", "urgent"], {
    required_error: "Priority is required",
    invalid_type_error: "Priority must be one of: high, low, medium, urgent"
  }),

  subject: z.string({
    required_error: "Subject is required",
    invalid_type_error: "Subject must be a string"
  }).min(1, { message: "Subject cannot be empty" }),

  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string"
  }).min(1, { message: "Description cannot be empty" }),

  asset_id: numericString("Asset ID").optional(),

  user_id: numericString("User ID"),

  cc: numericString("CC").optional(),
});




const raiseTicketSchema = z.object({
  category_id: numericString("Category ID"),

  priority: z.enum(["high", "low", "medium", "urgent"], {
    required_error: "Priority is required",
    invalid_type_error: "Priority must be one of: high, low, medium, urgent"
  }),

  subject: z.string({
    required_error: "Subject is required",
    invalid_type_error: "Subject must be a string"
  }).min(1, { message: "Subject cannot be empty" }),

  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string"
  }).min(1, { message: "Description cannot be empty" }),

  asset_id: numericString("Asset ID").optional(),

  cc: numericString("CC").optional()
});



const forwardTicketSchema = z.object({
  admin_id : z.number(),
  category_id: z.number(),
  remarks : z.string().optional(),
});


module.exports = { reRaiseTicketCommentSchema,onBehalfTicketSchema,raiseTicketSchema,forwardTicketSchema };
