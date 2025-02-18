
// check priority validation
export const validatePriority = async (value) => {
    const validPriorities = ['urgent', 'high', 'medium', 'low'];
    return validPriorities.includes(value);
};
