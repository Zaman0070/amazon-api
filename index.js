const express =require("express");
const mongoose = require("mongoose");
const adminRouter = require("./routes/admin");


const authRoter =require("./routes/auth");
const productRouter = require("./routes/product");

const PORT = process.env.PORT || 3000;
const DB = "mongodb+srv://zaman:1234567890@cluster0.absrvai.mongodb.net/?retryWrites=true&w=majority";
const app =express();

app.use(express.json());
app.use(authRoter);
app.use(adminRouter);
app.use(productRouter);


// Connections
mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(PORT, () => {
  console.log(`connected at port ${PORT}`);
});
