getLocation()

getWeather()

document.querySelector("#btnLoad").addEventListener('click', () => {
    getQoutes()
})

var button = document.querySelector("#btnLoad");

setInterval(function () {
    button.click()
}, 5000)

async function getQoutes() {
    const response = await fetch('/qoutesline')
    const data = await response.json()
    let min = Math.ceil(1);
    let max = Math.floor(1500);
    let nextQoutes = Math.floor(Math.random() * (max - min + 1) + min)
    let qoutesline = data[nextQoutes].text
    let qoutesVerse = data[nextQoutes].author

    document.querySelector("#titleQoutes").innerHTML = qoutesVerse;
    document.querySelector('#textQoutes').innerHTML = qoutesline;
    
}

async function getWeather() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    const today = new Date();
    
    const response = await fetch('/weather')
    const data = await response.json()

    let date = "Date: " +today.getDate() +' '+monthNames[(today.getMonth())]+' '+today.getFullYear();
    const location = data.loc
    const weatherStatusmain = data.weatherStatusmain + ': ' + data.weatherStatusdes
    const maxTemp = "Temperature: " + data.maxTemp.toFixed(2) + "°C"
    const weatherIcon = `http://openweathermap.org/img/w/${data.weatherIcon}.png`

    document.querySelector("#date").innerHTML = date;
    document.querySelector("#location").innerHTML = location;
    document.querySelector("#weatherStatusmain").innerHTML = weatherStatusmain;
    document.querySelector("#maxTemp").innerHTML = maxTemp;
    document.querySelector("#weatherIcon").src = weatherIcon;

}
async function getLocation() {
if('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition( position => {
    
        const data = { lat: position.coords.latitude, lon: position.coords.longitude }
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        fetch('/myLocation', options)
    })
} else {
    console.log("Failed")
}
}
function getMessage() {
    const timestamp = Date.now()
    const yourEmail = document.querySelector("#yourEmail").value
    const subject = document.querySelector("#subject").value
    const bodyMessage = document.querySelector("#bodyMessage").value
    const subButton = document.querySelector("#submitMessage");
    console.log(subject)
    if (subButton.click) {
        if (subject == "" || yourEmail == "" || bodyMessage == "") {
            alert("Inputs needed")
            document.getElementById("formBody").reset();
        }
        else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(yourEmail) ) {
            console.log("asd")

            try {
                const data = { sender: yourEmail, subject: subject, message: bodyMessage, timestamp: timestamp }
                const option = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                    }
                    fetch('/getMessage', option)
                    alert("Thankyou for emailing me. Have a great day!")
                    document.getElementById("formBody").reset();
            } catch (error) {
                console.log(error)
            }
        }
    }
}
