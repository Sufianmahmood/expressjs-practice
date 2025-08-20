import { Router } from "express";
import { query, validationResult, checkSchema, matchedData } from "express-validator";
import session from "express-session";
import { User } from "../mongoose/schemas/user.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { mockUsers } from "../utils/constants.mjs";
import { hashPassword } from "../utils/helpers.js";  

const router = Router();

// GET users
router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("must be atleast 2 to 3 character"),
  (request, response) => {
    console.log(request.session);
    console.log(request.session.id);

    request.sessionStore.get(request.session.id, (err, sessionData) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(sessionData);
    });

    const result = validationResult(request);
    console.log(result);

    const {
      query: { filter, value },
    } = request;

    if (filter && value)
      return response.send(mockUsers.filter((user) => user[filter].includes(value)));

    return response.send(mockUsers);
  }
);

// POST users → save to MongoDB
router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) return response.status(400).send(result.array());

    // ✅ Use only validated fields
    const data = matchedData(request);
    console.log("📥 Incoming data:", data);

    // ✅ Await the async password hash
    data.password = await hashPassword(data.password);
    console.log("🔐 Hashed password:", data);

    const newUser = new User(data);

    try {
      const savedUser = await newUser.save();
      console.log("✅ User saved:", savedUser);
      return response.status(201).send(savedUser);
    } catch (err) {
      console.error("❌ Error saving user:", err.message);
      return response.status(400).json({ error: err.message });
    }
  }
);

export default router;
