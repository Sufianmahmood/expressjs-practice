import { Router } from "express";
import { Route } from "react-router-dom";

const router = Router();

router.get("/api/products", (request, response) => {
     response.send([
        {id: 1, name: "chicken", price: 100},
        {id: 2, name: "beef", price: 200},
     ]);
});

export default router;