const { z } = require("zod");

const dateFormat = () =>
      z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")   
    
// asset Report
const assetReport = z
  .object({
    unit: z.string().optional(),
    start_date: dateFormat().optional(),
    end_date: dateFormat().optional(),
    start_purchase_date : dateFormat().optional(),
    end_purchase_date : dateFormat().optional(),
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
      key: z.string().optional(),
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


// ticket report
const ticketReport = z
.object({
limit: z
    .string()  // query param theke string ashe, pore parseInt korte paren
    .transform((val) => parseInt(val) || 50) // default 50
    .optional(),
  offset: z
    .string()
    .transform((val) => parseInt(val) || 0) // default 0
    .optional(),
  key: z.string().optional(),
  start_date : dateFormat().optional(),
  end_date : dateFormat().optional(),
  category: z.string().optional(),
  priority : z.enum(['low', 'high', 'medium','urgent']).optional(),
  unit : z.string().optional(),
  status : z.enum(['solved', 'unsolved', 'forward','inprogress']).optional(),
  user_id : z.string().optional(),
  overdue : z.string().optional(),
});


// combine report
const combineReport = z
.object({
  start_date : dateFormat().optional(),
  end_date : dateFormat().optional(),
  unit : z.string().optional(),
  user_id : z.string().optional(),
});


module.exports = { assetReport,disbursementsReport,taskReport, ticketReport,combineReport};
