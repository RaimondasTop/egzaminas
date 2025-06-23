const { sql } = require("../dbConnection");


exports.createUser = async (newUser) => {
    const userData = {};
    for (const key of ['username', 'email', 'password', 'role']) {
        if (newUser[key] !== undefined) userData[key] = newUser[key];
    }
    const [user] = await sql`
        INSERT INTO users ${sql(userData, 'username','email','password', 'role')}
        RETURNING *
    `;
    return user;
};

exports.deleteUser = async (id) => {
    const [deletedUser] = await sql`
        DELETE FROM users
        WHERE id = ${id}
        RETURNING *;
    `;

    if (!deletedUser) {
        throw new Error("User not found");
    }

    return deletedUser;
}

exports.getUsers = async () => {
    const users = await sql`
        SELECT id, username, email, role
        FROM users
    `;
    return users;
}

exports.editUser = async (id, updatedUser) => {
    const [user] = await sql`
        UPDATE users
        SET ${sql(updatedUser, 'username', 'email', 'role')}
        WHERE id = ${id}
        RETURNING *;
    `;

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

exports.getUserById = async (id) => {
    const [user] = await sql`
        SELECT id, username, email, role
        FROM users
        WHERE id = ${id}
    `;

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

exports.getUserByEmail = async (email) => {
    const [user] = await sql`
        SELECT id, username, email, password, role
        FROM users
        WHERE LOWER(email) = ${email.toLowerCase()}
    `;
    if (!user) {
        throw new Error("User not found");
    }
    return user;
}