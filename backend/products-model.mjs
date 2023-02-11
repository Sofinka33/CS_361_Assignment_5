// Import dependencies.
import mongoose from "mongoose";
import "dotenv/config";

// Connect based on the .env file parameters.
mongoose.connect(process.env.MONGODB_CONNECT_STRING, { useNewUrlParser: true });
const db = mongoose.connection;

// Confirm that the database has connected and print a message in the console.
db.once("open", (err) => {
  if (err) {
    res.status(500).json({ error: "500:Connection to the server failed." });
  } else {
    console.log(
      "Successfully connected to MongoDB Exercise collection using Mongoose."
    );
  }
});

// SCHEMA: Define the collection's schema.
const productSchema = mongoose.Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  link:
  {
      data: Buffer,
      type: String,
      required: true
  },
  date: { type: Date, default: Date.now, required: true },
});

// Compile the model from the schema.
const Product= mongoose.model("Product", productSchema);

///mongoDB

// CREATE model *****************************************
const createProduct = async (type, name, description,link, date) => {
  const product = new Product({
    type: type,
    name: name,
    description: description,
    link: link,
    date: date,
  });
  return product.save();
};

// RETRIEVE models *****************************************
// Retrieve based on a filter and return a promise.
const findProducts = async (filter) => {
  const query = Product.find(filter);
  return query.exec();
};

const findNumberOfProducts = async (filter) => {
  const query = Product.countDocuments(filter);
  return query.exec();
};

// Retrieve based on the ID and return a promise.
const findProductById = async (_id) => {
  const query = Product.findById(_id);
  return query.exec();
};

// DELETE model based on ID  *****************************************
const deleteById = async (_id) => {
  const result = await Product.deleteOne({ _id: _id });
  return result.deletedCount;
};

// REPLACE model *****************************************************
///UPDATE ,Method = PUT

const replaceProduct = async (_id, type, name, description, link, date) => {
  const result = await Product.replaceOne(
    { _id: _id },
    {
      type: type,
      name: name,
      description: description,
      link: link,
      date: date,
    }
  );
  return result.modifiedCount;
};

///function

// Export our variables for use in the controller file.
export {
  createProduct,
  findNumberOfProducts,
  findProducts,
  findProductById,
  replaceProduct,
  deleteById,
};
