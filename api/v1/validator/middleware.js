const { ZodSchema } = require("zod");

/**
 * Middleware for validating request data using Zod.
 * @param {ZodSchema} schema - The Zod schema to validate request body
 */
const validateRequest = (schema, dataSource = 'body') => {
  return (req, res, next) => {
    let data;

    // Select the correct data source for validation
    if (dataSource === 'body') {
      data = req.body; // Validate the body data
    } else if (dataSource === 'query') {
      data = req.query; // Validate the query data
    } else if (dataSource === 'params') {
      data = req.params; // Validate the URL params
    } else {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Invalid data source",
      });
    }

    const result = schema.safeParse(data);

    if (!result.success) {
      const formattedErrors = Object.entries(result.error.format()).reduce(
        (acc, [key, value]) => {
          if (key !== "_errors") {
            acc[key] = value._errors[0]; 
          }
          return acc;
        },
        {}
      );

      const firstErrorMessage = Object.values(formattedErrors)[0] || "Validation error";

      return res.status(400).send({
        success: false,
        status: 400,
        message: firstErrorMessage, 
      });
    }

    if (dataSource === 'body') {
      req.body = result.data;
    } else if (dataSource === 'query') {
      req.query = result.data;
    } else if (dataSource === 'params') {
      req.params = result.data;
    }

    next();
  };
};

module.exports = validateRequest;
