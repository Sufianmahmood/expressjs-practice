import express, { request, response } from 'express';
import { query, validationResult, body, matchedData, checkSchema  } from 'express-validator';
import {createUserValidationSchema} from './utils/validationSchemas.mjs' ;
import routes from './routes/index.mjs';
import { mockUsers  } from './utils/constants.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import "./strategies/local-strategy.mjs"


const app  = express();

app.use(express.json())
app.use(cookieParser())
app.use(session({
    secret: 'sufian dev',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 6000 * 60,
    }
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(routes)


app.post("/api/auth", (request, response) => {
    const {
        body: { username, password },
    } = request;
    
    const findUser = mockUsers.find((user) => user.username === username);
    if (!findUser || findUser.password !== password)
       return response.status(401).send({msg: "Unauthorized"})

    request.session.user = findUser;
    return response.status(200).send(findUser);

})

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
 
app.post(
    "/api/auth",
    passport.authenticate("local"),
    (request, response) => {
   response.sendStatus(200)
    }
);

app.get("/api/auth/status", (request, response) => {
    console.log(`Inside /auth/status endpoint`);
    console.log(request.user);
    console.log(request.session);
    
   // if (request.user) return response.send(request.user); return response.sendStatus(401);

    return request.user ? response.send(request.user) : response.sendStatus(401);
});



const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.get("/",  (request, response) => {
    console.log(request.session);
    console.log(request.session.id);
    request.session.visited = true; 
  response.cookie("hello", "world", {maxAge: 10000});
    response.status(201).send({ msg: "hello" })
}
);







app.get("/api/users/:id", (request, response) => {
    console.log(request.params);
    const parsId = parseInt(request.params.id);
    if (isNaN(parsId))
    return response.status(400).send({msg: "Bad request. Invalid ID."})
    const findUser = mockUsers.find((user) => user.id === parsId);
    if (!findUser) return response.sendStatus(404);
    return response.send(findUser);
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


app.get("/api/auth/status" , (request, response) => {
    request.sessionStore.get(request.sessionID, (err, session) => {
        console.log(session);
    });
      return response.session.user
      ? response.send(request.session.user)
      : response.status(401).send({msg: "Unauthorized"});
});

app.post("/api/cart", (request, response) =>{
    if (!request.session.user) return response.sendStatus(401);
    const { body: item } = request;
    const { cart } = request.session;
    if (cart) {
        cart.push(item);
    } else {
        request.session.cart = [item];
    }
    return response.status(201).send(item);
});
app.get("/api/cart", (request, response) => {
 if (!request.session.user) return response.sendStatus(401);
 return response.send(request.session.cart ?? []);
});
