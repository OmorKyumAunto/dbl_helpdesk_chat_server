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


const idParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number"),  
});

const buildingIdSchema = z.object({
  building_id: z.array(
    z.number().int().positive("Each ID must be a positive number")
  ).nonempty("At least one building ID is required"),
});



const bodyArrayIdSchema = z.object({
  id: z.array(
    z.number().int().positive("Each ID must be a positive number")
  )
  .nonempty("At least one ID is required")
  .refine((arr) => new Set(arr).size === arr.length, {
    message: "Duplicate IDs are not allowed",
  }),
});




module.exports = { idParamsSchema ,buildingIdSchema,bodyArrayIdSchema};
