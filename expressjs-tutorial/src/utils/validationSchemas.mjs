export const createUserValidationSchema = {
    username : {
        isLength : {
            options : {
                min : 5,
                max : 32,
                },
            errorMessage: 
            "Username must be at least 5 characters with a max od 32 character",
            },
            notEmpty : {
                errorMessage: "Username cannot be empty",
            },
            isString: {
                errorMessage: "Username must be a string"
            },  
            
           
        },
        displayName: {
            notEmpty: true,
        }
    };


