require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const listingRoutes = require("./routes/listingRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const workerRoutes = require("./routes/workerRoutes");
const aroundRoutes = require("./routes/aroundRoutes");

const app = express();

/* Middlewares */
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);

/* Connect Database */
connectDB();

/* Routes */
app.use("/api/user", userRoutes);
app.use("/api/listing", listingRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/around", aroundRoutes);

/* Test Route */
app.get("/", (req, res) => {
  res.send("Findy Backend Running");
});

/* Start Server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});