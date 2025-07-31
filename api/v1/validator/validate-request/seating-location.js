const { z, number } = require("zod");


// Create schema
const seatingLocationCreateSchema = z
  .object({
    building_id: z.number().refine((val) => val > 0, {
      message: "Building ID must be a positive number",
    }),
    name: z.string().min(1, { message: "Seating location is required" }),
  });

// Update schema
const seatingLocationUpdateSchema = z
  .object({
    name: z.string().min(1, { message: "Seating location is required" }),
  });


module.exports = { seatingLocationCreateSchema,seatingLocationUpdateSchema };
