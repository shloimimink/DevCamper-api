const path = require('path')
const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require("helmet")
const xss = require("xss-clean")
const cors = require("cors")
const rateLimit = require("express-rate-limit")
const hpp = require("hpp")
const morgan = require("morgan");
const errorHandel = require("./middleware/error");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({path: "./config/config.env"});

// Connect to database
connectDB();

// Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users")
const reviews = require("./routes/reviews")


const app = express();

// Body Parser
app.use(express.json());
app.use(cookieParser())

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
// File uploading
app.use(fileupload())

// Sanitize data
app.use(mongoSanitize())

// Set security headers
app.use(helmet({contentSecurityPolicy: false}));

// Prevent XSS attacks
app.use(xss())

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
})
app.use(limiter)

// Prevent http param pollution
app.use(hpp())

// Make api public
app.use(cors())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Mount toutes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users)
app.use("/api/v1/reviews", reviews)

app.use(errorHandel);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
    )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit proccess
    server.close(() => process.exit(1));
});
