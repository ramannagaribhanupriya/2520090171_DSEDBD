const express = require("express");
const router = express.Router();

const db = require("../db");

router.post("/", (req, res) => {

    const { user_id, latitude, longitude } = req.body;

    if (!user_id || latitude === undefined || longitude === undefined) {
        return res.status(400).json({
            message: "User ID and location are required"
        });
    }

    const locationLink =
        `https://www.google.com/maps?q=${latitude},${longitude}`;

    const message =
        `🚨 EMERGENCY ALERT!\n\n` +
        `I need help. My current location is:\n` +
        `${locationLink}`;

    const sql = `
        SELECT name, mobile
        FROM emergency_contacts
        WHERE user_id = ?
    `;

    db.query(sql, [user_id], (error, contacts) => {

        if (error) {
            console.log("Database error:", error.message);

            return res.status(500).json({
                message: "Failed to get emergency contacts"
            });
        }

        if (contacts.length === 0) {
            return res.status(404).json({
                message: "No emergency contacts found"
            });
        }

        console.log("================================");
        console.log("🚨 SOS ALERT");
        console.log("Location:", locationLink);
        console.log("Message:", message);
        console.log("Contacts:", contacts);
        console.log("================================");

        res.json({
            success: true,
            message: "SOS alert received successfully",
            location: locationLink,
            emergencyMessage: message,
            contacts: contacts
        });
    });
});

module.exports = router;