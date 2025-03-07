const { ZodSchema } = require("zod");

/**
 * Middleware for validating request data using Zod.
 * @param {ZodSchema} schema - The Zod schema to validate request body
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const formattedErrors = Object.entries(result.error.format()).reduce(
        (acc, [key, value]) => {
          if (key !== "_errors") {
            acc[key] = value._errors[0]; // Get the first error message
          }
          return acc;
        },
        {}
      );

      // Extract the first validation error message
      const firstErrorMessage = Object.values(formattedErrors)[0] || "Validation error";

      return res.status(400).send({
        success: false,
        status: 400,
        message: firstErrorMessage, // Set the first error message as main response message
      });
    }

    req.body = result.data; // Ensure only validated data is passed forward
    next();
  };
};

module.exports = validateRequest;
