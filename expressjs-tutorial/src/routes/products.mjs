import { Router } from "express";

const router = Router();

router.get("/api/products", (request, response) => {
  console.log(request.headers.cookie);
  console.log(request.cookies); 
  if(request.cookies.hello && request.cookies.hello === "world")
     return response.send([
        {id: 1, name: "chicken", price: 100},
        {id: 2, name: "beef", price: 200}
  ]);
 
     return response.send(
      { msg: "Sorry, you need the correct cookie"}
     )
});

export default router;