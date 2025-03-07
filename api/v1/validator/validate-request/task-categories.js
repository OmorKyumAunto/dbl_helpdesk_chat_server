const { z } = require("zod");


const taskCategoriesCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

const taskCategoriesUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

const taskCategoriesStarredUpdateSchema = z.object({
  starred: z.number(),
});

module.exports = { 
  taskCategoriesCreateSchema,
  taskCategoriesUpdateSchema,
  taskCategoriesStarredUpdateSchema 
};
