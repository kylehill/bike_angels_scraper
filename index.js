const request = require("request")
const fs = require("fs")
const env = require("./env")

const url = "https://layer.bicyclesharing.net/map/v1/wdc/map-inventory"

request.get(url, { json: true }, (err, response , body) => {
    const timestamp = Date.now()
    const data = body.features.map(x => {
        return {
            id: x.properties.station.id,
            bikes: x.properties.station.bikes_available,
            docks: x.properties.station.docks_available,
            points: x.properties.bike_angels.score
        }
    })
    const dataObj = {
        timestamp,
        human: new Date(timestamp).toLocaleString(),
        data
    }
    const dataText = JSON.stringify(dataObj)

    const meta =  body.features.map(x => {
        return {
            id: x.properties.station.id,
            name: x.properties.station.name,
            lat: x.geometry.coordinates[0],
            lon: x.geometry.coordinates[1]
        }
    })
    const metaText = JSON.stringify(meta)

    fs.writeFile(env.meta, metaText, (err) => {
        console.log(err || "meta ok")
    })
    fs.writeFile(`${env.data}${timestamp}.json`, dataText, (err) => {
        console.log(err || "data ok")
    })

})