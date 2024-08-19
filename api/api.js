const express = require("express");
const router = express.Router();
const api_v1 = require("./v1/v1")


router.use('/v1', api_v1);
router.get('/', (req, res) => {
    return res.status(400)
        .send({
            'status': 400,
            'message': "Please select api version",
            "success": true
        });
});



module.exports = router;