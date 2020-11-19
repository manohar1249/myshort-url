const express = require('express');
const mongoose = require('mongoose');
const shortId = require('shortid');
const bodyparser = require('body-parser');
const dotenv = require('dotenv').config();
const Shorturl = require('./models/Shorturl');
const short = require('./routes/shorturl');
const cors = require('cors');

const app = express();
const db_url = process.env.url+"/urlshortener";

mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true })
app.use(cors());
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: false }))


app.use('/shorturl', short);

//root route
app.get('/', async(req, res) => {
    try {
        let data = await Shorturl.find();
        if (data == null) return res.status(200).json({ message: "data not found" })
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
    }

})


app.get('/:shorturl', async(req, res) => {
    let data = await Shorturl.findOne({ shortURL: req.params.shorturl })
    if (data == null) return res.status(404).json({ message: "URL not found" })
    data.clicks++;
    data.save();
    res.status(200).redirect(data.fullURL);
})

app.listen(process.env.PORT || 5000, () => console.log('server started at 5000!!'));