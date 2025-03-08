const { z } = require("zod");


const taskCategoriesCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

const taskCategoriesUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});


module.exports = { 
  taskCategoriesCreateSchema,
  taskCategoriesUpdateSchema
};
