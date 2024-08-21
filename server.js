const express = require("express");
const cors = require('cors');
const app = express();




// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());


// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     res.header("Access-Control-Allow-Credentials", "true");
//     if (req.method === "OPTIONS") {
//         return res.status(200).end();
//     }
//     next();
// });

const whitelist = ["http://localhost:3000"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))

const api_redirect_path = require("./api/api");
const port = process.env.PORT || 3003;
const api_version = 1.0;



app.use('/api', api_redirect_path);




app.listen(port, async () => {
    console.log(`DBL backend running port ${port}`);
});







