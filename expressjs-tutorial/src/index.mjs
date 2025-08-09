import express, { request, response } from 'express';

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


app.get("/api/users", (request, response) =>  {
    console.log(request.query);
    const {
        query: { filter, value},
    } = request;
 
 if (!filter && !value) return response.send(mockUsers); 
 if (filter && value) 
    return response.send(
mockUsers.filter(user => user[filter].includes(value))
);
 return response.send(mockUsers);
});

app.post("/api/users", (request, response) => {
      const { body} = request;
      const  newUser = { id: mockUsers[mockUsers.length -1].id +1,...body};
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

