const { z } = require("zod");


const taskSubCategoryCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  categories_id: z.number(),
});

const taskSubCategoryUpdateSchema = z.object({
  title: z.string().optional(),
  categories_id: z.number().optional(),
});


module.exports = { 
  taskSubCategoryCreateSchema,
  taskSubCategoryUpdateSchema
};
