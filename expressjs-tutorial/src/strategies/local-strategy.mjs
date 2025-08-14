import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";

// ===== Original serializeUser =====
// passport.serializeUser((user, done) => {
//     console.log("Inside Serialize User");
//     console.log(user);
//     done(null, user.id);
// });

// ===== FIX: Serialize user =====
passport.serializeUser((user, done) => {
    console.log("Inside Serialize User");
    console.log(user);
    done(null, user.id);
});

// ===== Original deserializeUser =====
// passport.deserializeUser((id, done) => {
//     console.log("Inside Deserialize User");
//     console.log(`Deserialize User ID: ${id}`);
//     try {
//         const user = mockUsers.find((u) => u.id === id);
//         if (!user) {
//             return done(new Error("User not found"), null);
//         }
//         done(null, user);
//     } catch (err) {
//         done(err, null);
//     }
// });

// ===== FIX: Deserialize user =====
passport.deserializeUser((id, done) => {
    console.log("Inside Deserialize User");
    console.log(`Deserialize User ID: ${id}`);
    try {
        const findUser = mockUsers.find((user) => user.id === id);
        if (!findUser) throw new Error("User Not Found");
        done(null, findUser);
    } catch (err) {
        done(err, null);
    }
});

// ===== Original Strategy =====
// export default passport.use(
//     new Strategy((username, password, done) => {
//         console.log(`username : ${username}`);
//         console.log(`password : ${password}`);
//         try {
//             const findUser = mockUsers.find((user) => user.username === username);
//             if (!findUser) throw new Error("User not found");
//             done(null, findUser);
//         } catch (err) {
//             done(err, null);
//         }
//     })
// );

// ===== FIX: Strategy with password check =====
export default passport.use(
    new Strategy((username, password, done) => {
        console.log(`username : ${username}`);
        console.log(`password : ${password}`);
        try {
            const findUser = mockUsers.find((user) => user.username === username);
            if (!findUser) throw new Error("User not found");
            if (findUser.password !== password) throw new Error("Invalid password");
            done(null, findUser);
        } catch (err) {
            done(err, null);
        }
    })
);

