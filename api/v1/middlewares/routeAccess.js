const routeAccessChecker = (routeName) => {
    return (req, res, next) => {
        //console.log(req.decoded);
        if (req.decoded.permissions.includes(routeName) === false) {
            return res.status(401)
                .send({
                    "success": false,
                    "status": 401,
                    "message": "You are not eligible on this route."
                });

        } else next();
    }
}

module.exports = {
    routeAccessChecker
};