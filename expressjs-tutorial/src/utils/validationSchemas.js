export const createUserValidationSchema = {
    username: {
        in: ['body'],
        isString: {
            errorMessage: "Username must be a string"
        },
        notEmpty: {
            errorMessage: "Username cannot be empty"
        },
        isLength: {
            options: { min: 5, max: 32 },
            errorMessage: "Username must be between 5 and 32 characters"
        }
    },
    displayName: {
        in: ['body'],
        isString: {
            errorMessage: "Display name must be a string"
        },
        notEmpty: {
            errorMessage: "Display name cannot be empty"
        }
    }
};
