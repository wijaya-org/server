const express = require('express')
const { User } = require('./models')
const bcrypt = requiere('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()

app.use(express.json())

app.post("/login", async (req, res) => {

    try {
        // logic u/ login
        const { email, password } = req.body

        if (!email) {
            res.status(400).json({
                message: "Email is required"
            })
        }

        if (!password) {
            res.status(400).json({
                message: "Password is required"
            })
        }

        // 

        const user = await User.findOne({ where: { email } })
        if (!user) {
            res.status(401).json({
                message: "Email or password invalid"
            })
        }

        const isValidPassword = bcrypt.compareSync(password, user.password)
        if (!isValidPassword) {
            res.status(401).json({
                message: "Email or password invalid"
            })
        }

        const access_token = jwt.sign({ id: user.id }, 'SECRET_KEY')

        res.status(200).json({
            access_token
        })

    } catch (error) {
        if (error.name === "SequelizeValidationError" || "SequelizeUniqueConstraintError") {
            res.status(400).json({
                message: error.errors[0].message
            })
        } else {
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }
})

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000")
})