const express = require("express")
const app = express()
const port = 4000
const fetch = require("node-fetch")
const nodemailer = require("nodemailer")
const nedb = require("nedb")
var myPostlat
var myPostlon

require("dotenv").config()
app.use(express.static('public'))

app.use(express.json({ limit: '1mb' }))

app.listen(port, () => {
    console.log('Listening...')
    
})
app.get('/qoutesline', async (request, response) => {

    const fetchApi = await fetch("https://type.fit/api/quotes")

    const dinoNameResponse = await fetchApi.json();
    response.json(dinoNameResponse)
})
app.post('/myLocation',async (request, response) => {
    myPostlat = request.body.lat
    myPostlon = request.body.lon
})
app.get('/weather', async (request, response) => {
    const apikeys = process.env.SECRET_KEY
    
    if (myPostlat == undefined && myPostlon == undefined) {
        myPostlat = 14.5995
        myPostlon = 120.9842
    }

    const weatherForecast = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${myPostlat}&lon=${myPostlon}&appid=${apikeys}`)
    const weatherResponse = await weatherForecast.json()
    weatherResponse.main.temp_max -= 273.15;

    console.log(`Lat: ${myPostlat} Lon: ${myPostlon}`)
    var fullWeather = {
        loc: weatherResponse.sys.country + ' ' + weatherResponse.name,
        weatherStatusmain: weatherResponse.weather[0].main, 
        weatherStatusdes: weatherResponse.weather[0].description,
        maxTemp: weatherResponse.main.temp_max,
        weatherIcon: weatherResponse.weather[0].icon
    }      

    response.json(fullWeather)
})
const database = new nedb('database.db')
database.loadDatabase()

app.post('/getMessage', (request, response) => {
    
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    })
    let mailOption = {
        from: request.body.sender,
        to: `jpanofuente@gmail.com, ${request.body.sender}`,
        subject: request.body.subject,
        text: request.body.message,
    }
    database.insert(request.body)

    transporter.sendMail(mailOption, function (err, data) {
        if (err) {
            console.log(err)
        }
        else console.log("Email Sent!")
    })
})
app.get('/getData', (request, response) => {
    database.find({}, (error, data) => {
        if (error) {
            console.log(error)
        }
        response.json(data)
    })
})