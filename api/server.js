const express = require('express');
const cors = require('cors');
const env = require('dotenv').config();
const port = process.env.PORT || 3000;
const mongourl = process.env.MONGO_URL;
const mongoose = require('mongoose');
const UserInfo = require('../db.js');



mongoose.connect(mongourl).then(() => {
    console.log("Connected")
}).catch(e => {
    console.log(e);
})

const app = express();
app.use(express.json());
app.use(cors({
    origin: "https://portal-app-self.vercel.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
}));

app.post('/login', (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body;
    UserInfo.findOne({ email: email })
        .then(e => {
            if (e) {
                if (e.email === email && e.password === password) {
                    res.json(e)
                }
                if (e.email === email && e.password !== password) {
                    res.json("Wrong Password");
                }

            }
            else {

                res.json("Account Does not Exist");

            }

        })
})

app.post('/register', (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;
    UserInfo.findOne({ email: email })
        .then(e => {
            if (e) {
                if (e.email === email) {
                    res.json("Account Exists");
                }

            }
            else {
                UserInfo.create(req.body)
                    .then(e => res.json(e))
                    .catch(error => res.json(error));
            }
        })


})


app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
})

module.exports = app;

