import express, { request, response } from 'express';

const app  = express();

const PORT = process.env.PORT || 3000;

const mockUsers = [
        {id: 1, username: "sufian", displayName:"Mahmood" },
        {id: 2, username: "Aseef", Name: "Asif"},
        {id: 3, username: "hasan", Name: "Hassan"}
    ];

app.get("/", (request, response) =>  {
    response.status(201).send({ msg: "hello"})
});

app.get("/api/users", (request, response) =>  {
    response.send(mockUsers)
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

