import express, { request, response } from 'express';
import { query, validationResult, body, matchedData, checkSchema  } from 'express-validator';
import {createUserValidationSchema} from './utils/validationSchemas' 
const app  = express();

app.use(express.json())

const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} - ${request.url}`);
  next();
}
const resolveIndexByUserId = (request, response, next) => {
    const { id } = request.params;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return response.sendStatus(400);

    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if (findUserIndex === -1) return response.sendStatus(404);

    request.findUserIndex = findUserIndex;
    next();
};


const PORT = process.env.PORT || 3000;



const mockUsers = [
        {id: 1, username: "sufian", displayName:"Mahmood" },
        {id: 2, username: "Aseef", Name: "Asif"},
        {id: 3, username: "hasan", Name: "Hassan"}
    ];

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.get("/", 
        (request, response, next) =>  {
        console.log("Base URL1");

        next();
    },
    (request, response, next) => {
    console.log("Base URl2");
    
    next();
    },
    (request, response, next) => {
    console.log("Base URl3");
    
    next();}

);


app.get(
    "/api/users",
    query("filter")
    .isString()
    .notEmpty()
    .withMessage("must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage('must be atleast 2 to 3 character'),
    (request, response) =>  {
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

app.post(
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



app.get("/api/users/:id", (request, response) => {
    console.log(request.params);
    const parsId = parseInt(request.params.id);
    if (isNaN(parsId))
    return response.status(400).send({msg: "Bad request. Invalid ID."})
    const findUser = mockUsers.find((user) => user.id === parsId);
    if (!findUser) return response.sendStatus(404);
    return response.send(findUser);
});

app.get("/api/products", (request, response) => {
     response.send([
        {id: 1, name: "chicken", price: 100},
        {id: 2, name: "beef", price: 200},
     ]);
});

app.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return res.sendStatus(200);
});

app.patch("/api/users/:id", (request, response) => {
    const {
        body, findUserIndex
        } = request;
        mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
        return response.send(mockUsers[findUserIndex]);
        return response.sendStatus(200);
});

app.delete("/api/users/:id", (request, response) => {
    const { findUserIndex } = request;
        mockUsers.splice(findUserIndex, 1);
        return response.sendStatus(200);
});

