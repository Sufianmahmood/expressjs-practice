import bcrypyt from 'bcrypt';

const saltRounds = 10;

export const hashPassword = async (password) => {
     const salt = await bcrypyt.genSalt(saltRounds);
     console.log(salt);
     return bcrypyt.hash(password, salt);
};