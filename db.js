require('dotenv').config();

const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to gofood db successfully");

        const fetchedData = mongoose.connection.db.collection("fooditems");
        const data = await fetchedData.find({}).toArray();
        
        const foodCategoryCollection = mongoose.connection.db.collection("foodcategories");
        const catData = await foodCategoryCollection.find({}).toArray();
        
        global.food_items = data;
        global.food_category = catData;
    

    } catch (err) {
        console.error("Error connecting to the database", err);
    }
};

module.exports = connectToMongo;
