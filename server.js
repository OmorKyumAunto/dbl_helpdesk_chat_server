const express = require("express");
const cors = require('cors');
const app = express();




// // middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());




const api_redirect_path = require("./api/api");
const port = process.env.PORT || 3003;
const api_version = 1.0;



app.use('/api', api_redirect_path);
app.listen(port, async () => {
    console.log(`DBL backend running port ${port}`);
});
