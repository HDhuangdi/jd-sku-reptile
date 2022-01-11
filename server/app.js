const express = require("express");
const commentRoute = require("./routes/comment");
const detailsRoute = require("./routes/details");

const app = express();

app.use("/api/comment", commentRoute);
app.use("/api/details", detailsRoute);

app.listen(4000);
