const { default: mongoose } = require("mongoose");
const dotenv = require('dotenv');
const app = require("./app");

dotenv.config();

// Connecting to ther database.
const DB = process.env.DATABASE_LOCAL;
const DB_NAME = process.env.DATABASE_NAME;
mongoose.connect(DB, {dbName: DB_NAME}).then(function () {
    console.log('Database has been successfully connected...');
});

// Listening to the app.
const PORT = process.env.PORT
app.listen(PORT, function () {
    console.log(`App is running at PORT:${PORT}...`);
});

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log("Unhandles rejection... shutting down...");
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log("Unhandles rejection... shutting down...");
    server.close(() => {
        process.exit(1);
    });
});