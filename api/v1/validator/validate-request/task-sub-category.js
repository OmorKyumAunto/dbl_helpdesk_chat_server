const { z } = require("zod");


const taskSubCategoryCreateSchema = z.object({
  title: z.array(z.string().min(1, "Title cannot be empty")).min(1, "At least one title is required"),
  categories_id: z.number().int().positive(),
});

const taskSubCategoryUpdateSchema = z.object({
  title: z.array(z.string().optional()),
  categories_id: z.number().optional(),
});


module.exports = { 
  taskSubCategoryCreateSchema,
  taskSubCategoryUpdateSchema
};
