const { z } = require("zod");


const taskCategoriesCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  set_time: z.number().int().positive(),
  format: z.enum(["day", "hours", "minutes"]),
}).refine((data) => {
  if (data.format === "hours" && (data.set_time < 1 || data.set_time > 24)) {
    return false;
  }
  if (data.format === "minutes" && (data.set_time < 1 || data.set_time > 60)) {
    return false;
  }
  return true;
}, {
  message: "Invalid time",
  path: ["set_time"], // This ensures the error is attached to `set_time`
});


const taskCategoriesUpdateSchema = z.object({
  title: z.string().optional(),
  set_time: z.number().int().positive().optional(),
  format: z.enum(["day", "hours", "minutes"]).optional(),
}).refine((data) => {
  if (data.format === "hours" && data.set_time !== undefined) {
    return data.set_time >= 1 && data.set_time <= 24;
  }
  if (data.format === "minutes" && data.set_time !== undefined) {
    return data.set_time >= 1 && data.set_time <= 60;
  }
  return true;
}, {
  message: "Invalid time",
  path: ["set_time"],
});

const taskCategoriesList = z.object({
  offset: z.string().optional(),
  limit: z.string().optional(),
  key: z.string().optional(),

})

module.exports = { 
  taskCategoriesCreateSchema,
  taskCategoriesUpdateSchema,
  taskCategoriesList
};
