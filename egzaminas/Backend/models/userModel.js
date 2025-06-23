const { sql } = require("../dbConnection");


exports.getUserByEmail = async (email) =>{

    const [user] = await sql`
    SELECT * FROM users WHERE users.email = ${email}
    `;
    return user;
};

exports.createUser = async (newUser) =>{
    const [user] = await sql`
    INSERT INTO users  ${sql(newUser, 'username','email','password')}
    RETURNING *
    `;
    return user;
};

exports.getUserById = async (id) => {
    const [user] = await sql`
    SELECT id, username, email, role FROM users WHERE users.id = ${id}
    `;
    return user;
};