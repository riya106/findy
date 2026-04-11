const jwt = require("jsonwebtoken")

const checkUserAuth = (req, res, next) => {

    let token

    const { authorization } = req.headers

    if (authorization) {

        try {

            token = authorization.split(" ")[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = decoded

            next()

        } catch (error) {

            return res.send({
                status: 0,
                message: "Invalid Token"
            })

        }

    } else {

        return res.send({
            status: 0,
            message: "Token required"
        })

    }

}

module.exports = checkUserAuth