const express = require('express')
const mongoose = require('mongoose')

var fs = require('fs')
var https = require('https')



var option = {
    key: fs.readFileSync("/etc/letsencrypt/live/map.igt.com.hk/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/map.igt.com.hk/fullchain.pem")
}
const app = express()
var query;
mongoose.connect('mongodb://152.104.9.84:27017/map')

const UserSchema = new mongoose.Schema({
    type: String,
    name: String,
    lat: Number,
    lng: Number,
    address: String,
    phone: String,
    closetime: String,
    opentime: String,
    rating: Number
})

const UserModel = mongoose.model("1", UserSchema, 'maps')

app.use(express.static('db'))
app.use(express.json())
app.get("/db/:dynamic", (req, res) => {
    const { dynamic } = req.params
    const { key } = req.query
    UserModel.find({ type: query }).lean().then(function (name) {
        const data = JSON.parse(JSON.stringify(name))
        console.log("DSR")
        res.status(200).send(data)
    }).catch(function (err) {
        console.log(err)
    })
})

app.post("/", (req, res) => {
    const { parcel } = req.body
    console.log(parcel)
    if (!parcel) {
        return res.status(400).send({ status: 'failed' })
    }
    res.status(200).send({ status: 'received' })
    query = parcel;

})

var server = https.createServer(option, app).listen(443, 'map.igt.com.hk', () => {
    console.log('server is running')
})
