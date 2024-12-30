const bcrypt = require("bcrypt");

async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt); 
        console.log("Hashed Password:", hashedPassword);
    } catch (error) {
        console.error("Error hashing password:", error.message);
    }
}


hashPassword("admin"); 
