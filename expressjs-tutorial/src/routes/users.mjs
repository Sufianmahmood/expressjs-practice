import { Router } from 'express';
import { query, validationResult, checkSchema, matchedData } from 'express-validator'; 
import { mockUsers } from '../utils/constants.mjs';
import { createUserValidationSchema } from '../utils/validationSchemas.mjs';
import session from 'express-session';

const router = Router();

router.get(
     "/api/users",
        query("filter")
        .isString()
        .notEmpty()
        .withMessage("must not be empty")
        .isLength({ min: 3, max: 10 })
        .withMessage('must be atleast 2 to 3 character'),
        (request, response) =>  {
          console.log(request.session);
          console.log(request.session.id);
          request.sessionStore.get(request.session.id, (err, sessionData) => {
            if (err) {
              console.log(err);
              throw err;
            }
            console.log(sessionData);
          })
        const result = validationResult(request);
        console.log(result);
        const {
            query: { filter, value},
        } = request;
     
     if (filter && value) 
        return response.send(
    mockUsers.filter(user => user[filter].includes(value))
    );
     return response.send(mockUsers);
    });
    
    router.post(
    
            "/api/users",
            checkSchema(createUserValidationSchema), 
            (request, response) => {
              const result = validationResult(request);
              console.log(result);
               
              if (!result.isEmpty())
                return response.status(400).send({ errors: result.array() });
               
                const data = matchedData(request);
              const  newUser = { id: mockUsers[mockUsers.length -1].id +1,...data};
              mockUsers.push(newUser);
              return response.status(201).send(newUser);
        });
    

    export default router;