const { z, number } = require("zod");

const dateFormat = () =>
      z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
       
    

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
  });


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
  });




module.exports = { assetReport,disbursementsReport };
