const { z, number } = require("zod");


// Create schema
const buildingCreateSchema = z
  .object({
    unit_id: z.number().refine((val) => val > 0, {
      message: "Unit ID must be a positive number",
    }),
    name: z.string().min(1, { message: "Building name is required" }),
  });

// Update schema
const buildingUpdateSchema = z
  .object({
    name: z.string().min(1, { message: "Building name is required" }),
  });


module.exports = { buildingCreateSchema,buildingUpdateSchema };
