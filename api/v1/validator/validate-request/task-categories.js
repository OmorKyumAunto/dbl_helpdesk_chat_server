const { z } = require("zod");

const timeSchema = () =>
  z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)");

const taskCategoriesCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  set_time: timeSchema(),
});

const taskCategoriesUpdateSchema = z.object({
  title: z.string().optional(),
  set_time: timeSchema().optional(),
});


module.exports = { 
  taskCategoriesCreateSchema,
  taskCategoriesUpdateSchema
};
