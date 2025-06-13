const express = require('express');
const router = express.Router();

router.post('/food',(req,res)=>{
    try {
        // console.log(global.food_items)
        res.send([global.food_items,global.food_category])
    } catch (error) {
        console.error(error.message);
      return res.send("internal server error" );
    }
})

module.exports = router
