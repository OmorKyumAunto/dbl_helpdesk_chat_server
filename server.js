
const express = require("express");
const cors = require("cors");
const app = express();
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS middleware configuration
app.use(
  cors({
    origin: ["http://localhost:3000","http://localhost:3001","http://localhost:3002"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const api_redirect_path = require("./api/api");
const port = 3003;
const api_version = 1.0;
app.use("/api", api_redirect_path);
app.listen(port, async () => {
  console.log(`DBL backend running port ${port}`);
});






