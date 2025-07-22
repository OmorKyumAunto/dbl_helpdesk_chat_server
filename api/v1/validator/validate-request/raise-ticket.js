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



module.exports = { reRaiseTicketCommentSchema };
