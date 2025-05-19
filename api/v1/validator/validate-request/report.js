const { z, number } = require("zod");

const dateFormat = () =>
      z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
       
    
// asset Report
const assetReport = z
  .object({
    unit: z.string().optional(),
    start_date: dateFormat().optional(),
    end_date: dateFormat().optional(),
    category : z.string().optional(),
    remarks: z
    .enum(['assigned', 'in_stock'], {
      errorMap: () => ({ message: "Remarks must be either 'assigned' or 'in_stock'" })
    })
    .optional(),
    key : z.string().optional(),
  });


// disbursements Report
  const disbursementsReport = z
  .object({
    unit: z.string().optional(),
    start_date: dateFormat().optional(),
    end_date: dateFormat().optional(),
    category : z.string().optional(),
    employee_type: z
    .enum(['management', 'non-management'], {
      errorMap: () => ({ message: "Employee Type must be either 'management' or 'non-management'" })
    })
    .optional(),
    key : z.string().optional(),
  });


// task report
  const taskReport = z
    .object({
      key: z.string().optional().refine(value => value === undefined || value.length > 0, {
        message: 'The search key must be a non-empty string.',
      }),
     
      category: z
      .union([
        z.string().optional(),
        z.array(z.coerce.number().positive()).optional()
      ])
     .transform(value => {
     if (typeof value === "string") {
      return value.split(",").map(num => Number(num.trim())); 
     }
    return value || []; 
  }),

      start_date : dateFormat().optional(),
      end_date : dateFormat().optional(),
      user_id : z.string().optional().refine(value => value === undefined || value > 0, {
        message: 'User id must be a positive number.',
      }),
      task_status : z.enum(['incomplete', 'complete', 'inprogress']).optional(),
      unit_id : z.string().optional().refine(value => value === undefined || value > 0, {
        message: 'Unit id must be a positive number.',
      }),
      overdue : z.string().optional(),
    });


module.exports = { assetReport,disbursementsReport,taskReport };
