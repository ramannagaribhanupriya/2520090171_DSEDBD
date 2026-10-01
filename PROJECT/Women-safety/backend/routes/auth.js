const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
    const { name, mobile, email, password } = req.body;

    if (!name || !mobile || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (name, mobile, email, password)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [name, mobile, email, hashedPassword],
            (error, result) => {

                if (error) {
                    console.log("Registration error:", error.message);

                    return res.status(500).json({
                        message: "Registration failed"
                    });
                }

                res.json({
                    success: true,
                    message: "Registration successful",
                    userId: result.insertId
                });
            }
        );

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// LOGIN
router.post("/login", async (req, res) => {
    const { emailPhone, password } = req.body;

    if (!emailPhone || !password) {
        return res.status(400).json({
            message: "Email/mobile and password are required"
        });
    }

    const sql = `
        SELECT *
        FROM users
        WHERE email = ? OR mobile = ?
        LIMIT 1
    `;

    db.query(
        sql,
        [emailPhone, emailPhone],
        async (error, results) => {

            if (error) {
                console.log("Login error:", error.message);

                return res.status(500).json({
                    message: "Login failed"
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    message: "Invalid email/mobile or password"
                });
            }

            const user = results[0];

            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Invalid email/mobile or password"
                });
            }

            res.json({
                success: true,
                message: "Login successful",

                user: {
                    id: user.id,
                    name: user.name,
                    mobile: user.mobile,
                    email: user.email
                }
            });
        }
    );
});

module.exports = router;