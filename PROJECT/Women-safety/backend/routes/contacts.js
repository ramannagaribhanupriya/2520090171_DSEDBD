const express = require("express");
const router = express.Router();

const db = require("../db");

router.post("/", (req, res) => {

    const { user_id, name, mobile } = req.body;

    if (!user_id || !name || !mobile) {
        return res.status(400).json({
            message: "User ID, name and mobile number are required"
        });
    }

    const sql = `
        INSERT INTO emergency_contacts (user_id, name, mobile)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [user_id, name, mobile], (error, result) => {

        if (error) {
            console.log("Database error:", error.message);

            return res.status(500).json({
                message: "Failed to save emergency contact"
            });
        }

        res.json({
            success: true,
            message: "Emergency contact saved successfully",
            contactId: result.insertId
        });
    });
});

module.exports = router;