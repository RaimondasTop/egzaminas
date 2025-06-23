const app = require("./app");
const {sql, testConnection} = require("./dbConnection");
require('dotenv').config();

const port = process.env.PORT || 3002;

(async()=>{
try {
    //test db
    await testConnection();

    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });
} catch (error) {
    process.exit(1);
}
})()

process.on('SIGINT',async () => {
    console.log("Closing db connection...");
    await sql.end;
    process.exit(0);
});