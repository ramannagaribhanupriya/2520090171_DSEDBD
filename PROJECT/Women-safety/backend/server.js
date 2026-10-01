const express = require("express");
const cors = require("cors");

const contactsRoutes = require("./routes/contacts");
const sosRoutes = require("./routes/sos");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

// Test backend
app.get("/", (req, res) => {
    res.json({
        message: "Women Safety Backend is running!"
    });
});

// Emergency contacts
app.use("/api/contacts", contactsRoutes);

// SOS
app.use("/api/sos", sosRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});