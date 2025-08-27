const { z, number } = require("zod");
const { search } = require("../../middlewares/verifyToken");


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




const assignSeatingLocation = z.object({
  seating_location: z
    .array(z.number().positive({ message: "Seating location ID must be a positive number" }))
    .min(1, { message: "At least one seating location is required" }),
});


const employeeSeatingLocationUpdateSchema = z.object({
  seating_location: z
    .number({ invalid_type_error: "Seating location must be a number", required_error: "Seating location is required" })
});


module.exports = { seatingLocationCreateSchema,seatingLocationUpdateSchema,assignSeatingLocation,employeeSeatingLocationUpdateSchema };
