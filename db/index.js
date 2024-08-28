var markers = [];
var db = [];
var historya = [];
var saved = [];
const postBtn = document.getElementById('post')
const input = document.getElementById('input')

const url = 'https://map.igt.com.hk/'
console.log(historya)
for (let i = 0; i < localStorage.getItem("historycount"); i++) {
    var key_get_temp = "history" + i
    var gettemp = localStorage.getItem(key_get_temp);

    historya.push(JSON.parse(gettemp));
}
console.log(historya)
for (let i = 0; i < historya.length; i++) {
    const newelement = document.createElement('button');
    newelement.innerHTML = historya[i].name;
    newelement.classList.add('link');
    newelement.addEventListener('click', function () {

        createMarkers3(historya[i]);
        map.flyTo(historya[i].center, 16);
    });
    document.getElementById("history").appendChild(newelement);
    const hrElement = document.createElement('hr');
    document.getElementById("history").appendChild(hrElement);
}
for (let i = 0; i < localStorage.getItem("savedcount"); i++) {
    var key_get_temp = "saved" + i
    var gettemp = localStorage.getItem(key_get_temp);

    saved.push(JSON.parse(gettemp));
}
for (let i = 0; i < saved.length; i++) {
    const newelement = document.createElement('button');

    newelement.innerHTML = saved[i].name;
    newelement.classList.add('link');
    newelement.addEventListener('click', function () {

        createMarkers3(saved[i]);
        map.flyTo(saved[i].center, 16);
    });
    document.getElementById("saved").appendChild(newelement);
    const hrElement = document.createElement('hr');
    document.getElementById("saved").appendChild(hrElement);
}
input.addEventListener('keypress', function (e) {
    if (e.key == "Enter") {
        e.preventDefault();
        postBtn.click();
    }
})
postBtn.addEventListener('click', postinfo)
async function getinfo(e) {


    e.preventDefault();
    const res = await fetch(url + 'db/chris?key=hello',
        {
            method: 'GET'
        }
    )
    console.log(res)
    const data = await res.json()
    db = [];
    for (var i = 0; i < data.length; i++) {
        db.push(data[i]);
    }

    sidebar.open('search_result');
    nofilter_time()

}

async function postinfo(e) {

    e.preventDefault();

    if (input.value == '') { return }
    const res = await fetch(url,

        {
            method: 'POST',
            mode: "cors",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                parcel: input.value
            })
        }
    )
    getinfo(e);
}
var map = L.map('map', {
    zoomControl: false
}).setView([22.3193, 114.1694], 14);
var sky = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'

}).addTo(map);
var Stadia_AlidadeSatellite = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'jpg'
});
var Jawg_Sunny = L.tileLayer('https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
    attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 0,
    maxZoom: 22,
    accessToken: 'grH98LeMswJFIZ3LU4Q29t4tnFcjW54Rrt2K7QHv6ZavJiC74coDF6HbFkFe0r2f'
});
var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
var traffic2 = L.tileLayer('https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?tileSize=512&key=NePNkQgj3yarWgZSAZ0beKJvie7vGG9t');
var basemap = {
    "OpenStreetMap": sky,
    "Satelite": Stadia_AlidadeSatellite,
    "Detailed": Jawg_Sunny,
    "Google map": googleStreets
};
var overlay = {
    "Traffic": traffic2
};

var layercontrol = L.control.layers(basemap, overlay).addTo(map);

const geocoderControl = L.Control.geocoder({
    defaultMarkGeocode: false,
    collapsible: true,
    geocoder: L.Control.Geocoder.photon({
        geocodingQueryParams: {
            'lat': 22.3484019,
            'lon': 114.1320331,
            'limit': 18,
            'location_bias_scale': 0.1

        }
    }),
    position: 'topleft',
    collapsed: false,
}).addTo(map)
    .on('markgeocode', function (results) {
        var latlngtemp = results.geocode.center;
        var markertemp = L.marker(latlngtemp).addTo(map)
        markertemp.bindPopup(results.geocode.name);
        markertemp.openPopup();
        map.fitBounds(results.geocode.bbox);

        historya.unshift(results.geocode);
        clearMarkers()
        var cache = [];
        for (let i = 0; i < historya.length; i++) {
            var keytemp = "history" + i

            localStorage.setItem(keytemp, JSON.stringify(historya[i], function (key, value) {
                if (typeof value === "object" && value !== null) {
                    if (cache.indexOf(value) !== -1) {
                        return;
                    }
                    cache.push(value);
                }
                return value;
            }));
            cache = [];
            localStorage.setItem("historycount", i + 1)

        }
        while (document.getElementById("history").childElementCount > 1) {
            document.getElementById("history").removeChild(document.getElementById("history").lastChild);
        }
        for (let i = 0; i < historya.length; i++) {
            const newelement = document.createElement('button');
            newelement.innerHTML = historya[i].name;
            newelement.classList.add('link');
            newelement.addEventListener('click', function () {

                createMarkers3(historya[i]);

            });
            document.getElementById("history").appendChild(newelement);
            const hrElement = document.createElement('hr');
            document.getElementById("history").appendChild(hrElement);
        }


    })
    .on('finishgeocode', function (results) {

        clearMarkers();

        for (var i = 0; i < results.results.length; i++) {

            var coord = results.results[i];


            createMarkers3(coord);
        }
    })
    .on('startgeocode', function (text) {

        if (text.input == 'tutor' || text.input == 'hospital') {

            input.value = text.input
            postBtn.click();
        }
    });
L.control.zoom({
    position: 'bottomright'
}).addTo(map);
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        geocoderControl.options.geocoder.options.geocodingQueryParams.lat = lat;
        geocoderControl.options.geocoder.options.geocodingQueryParams.lon = long;
        routing.options.plan.options.geocoder.options.geocodingQueryParams = lat;
        routing.options.plan.options.geocoder.options.geocodingQueryParams.lon = long;
        var temp = L.latLng(lat, long)
        map.panTo(temp)
    });
}


L.easyButton({
    states: [{
        stateName: 'default',
        icon: 'fa-crosshairs fa-lg',
        onClick: function (btn) {
            map.locate({ setView: true, enableHighAccuracy: true });
            btn.state('gps');
        }
    }, {
        stateName: 'gps',
        icon: 'fa-crosshairs fa-lg',
        onClick: function (btn) {
            gpsmark.remove();
            gpscircle.remove();
            btn.state('default');
        }
    }],
    position: 'bottomright'
}

).addTo(map);
map.on('locationfound', function (e) {
    gpsmark = L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + e.accuracy + " meters from this point").openPopup();

    gpscircle = L.circle(e.latlng, e.accuracy).addTo(map);
})

function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        map.removeLayer(markers[i]);
    }
    markers = [];
}

function createMarkers(e) {
    var lattemp = e.lat;
    var lngtemp = e.lng;
    var lltemp = L.latLng(lattemp, lngtemp);
    var marker = L.marker(lltemp).addTo(map).bindPopup(e.name);
    marker.openPopup();
    markers.push(marker);
}
function createMarkers2(e) {
    clearMarkers()
    var marker = L.marker(e.geocode.center).addTo(map).bindPopup(e.geocode.name);
    marker.openPopup();
    markers.push(marker);
}
function createMarkers3(e) {

    console.log(e)
    document.getElementById('icon1').innerHTML = "N/A"
    document.getElementById('icon2').innerHTML = "N/A"
    document.getElementById('icon3').innerHTML = "N/A"
    document.getElementById('icon4').innerHTML = "N/A"
    var marker = L.marker(e.center).addTo(map).bindPopup(e.name);

    marker.addEventListener('click', function () {
        var temptxt = document.getElementById('place')
        console.log(e)
        temptxt.innerHTML = e.name;
        var locationbt = document.getElementById('bt3')
        locationbt.addEventListener('click', function () {
            map.flyTo(e.center)
            marker.openPopup();
        })
        var savedbt = document.getElementById('bt1')
        savedbt.addEventListener('click', function () {
            savedx(e);
        }

        )
        var routingbt = document.getElementById('bt2')
        routingbt.addEventListener('click', function () {
            var now = L.latLng(lat, long)
            routing.spliceWaypoints(0, 1, now);
            routing.spliceWaypoints(routing.getWaypoints().length - 1, 1, e.center);
            routing.show()
        })
        if (Object.hasOwn(e, 'rating')) {
            document.getElementById('icon1').innerHTML = e.address
            document.getElementById('icon2').innerHTML = e.phone
            document.getElementById('icon3').innerHTML = e.opentime
            document.getElementById('icon4').innerHTML = e.rating


        }
        sidebar.open('home');
    })
    markers.push(marker);
}

function filter_time() {
    var currenttime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    document.getElementById("dropbtn").innerHTML = 'Open Now';

    clearMarkers()
    while (document.getElementById("search_result").childElementCount > 2) {
        document.getElementById("search_result").removeChild(document.getElementById("search_result").lastChild);

    }
    for (let i = 0; i < db.length; i++) {
        if (currenttime >= db[i].opentime && currenttime < db[i].closetime) {
            const newelement = document.createElement('button');
            newelement.innerHTML = db[i].name + "<br /><br />Address: " + db[i].address + "<br /><br />Phone Number: " + db[i].phone + "<br />Open Hours: " + db[i].opentime + "-" + db[i].closetime + "<br />Ratings: " + db[i].rating + '<br />';
            newelement.classList.add('link');
            createMarkers(db[i]);
            newelement.addEventListener('click', function () {
                var lattemp = db[i].lat;
                var lngtemp = db[i].lng;
                var lltemp = L.latLng(lattemp, lngtemp);
                var e = {
                    center: lltemp,
                    name: db[i].name,
                    address: db[i].address,
                    phone: db[i].phone,
                    opentime: db[i].opentime + " - " + db[i].closetime,
                    rating: db[i].rating
                }

                createMarkers3(e);
                map.flyTo(lltemp, 16);
            });
            document.getElementById("search_result").appendChild(newelement);
            var span = document.createElement('span')
            var ratingstr = '--rating:' + db[i].rating
            span.setAttribute('style', ratingstr)
            document.getElementById('search_result').appendChild(span)
            const hrElement = document.createElement('hr');
            document.getElementById("search_result").appendChild(hrElement);
        }

    }


}


function nofilter_time() {
    document.getElementById("dropbtn").innerHTML = 'No Filter';
    while (document.getElementById("search_result").childElementCount > 2) {
        document.getElementById("search_result").removeChild(document.getElementById("search_result").lastChild);

    }
    clearMarkers()
    for (let i = 0; i < db.length; i++) {
        const newelement = document.createElement('button');
        newelement.innerHTML = db[i].name + "<br /><br />Address: " + db[i].address + "<br /><br />Phone Number: " + db[i].phone + "<br />Open Hours: " + db[i].opentime + "-" + db[i].closetime + "<br />Ratings: " + db[i].rating + '<br />';
        newelement.classList.add('link');
        createMarkers(db[i]);
        newelement.addEventListener('click', function () {
            var lattemp = db[i].lat;
            var lngtemp = db[i].lng;
            var lltemp = L.latLng(lattemp, lngtemp);
            var e = {
                center: lltemp,
                name: db[i].name,
                address: db[i].address,
                phone: db[i].phone,
                opentime: db[i].opentime + " - " + db[i].closetime,
                rating: db[i].rating
            }
            createMarkers3(e);
            map.flyTo(lltemp, 16);
        });
        document.getElementById("search_result").appendChild(newelement);
        var span = document.createElement('span')
        var ratingstr = '--rating:' + db[i].rating
        span.setAttribute('style', ratingstr)
        document.getElementById('search_result').appendChild(span)
        const hrElement = document.createElement('hr');
        document.getElementById("search_result").appendChild(hrElement);
    }
}

function ascending() {
    db.sort(function (a, b) {
        return parseFloat(a.rating) - parseFloat(b.rating);
    })
    if (document.getElementById("dropbtn").innerHTML == 'No Filter') {
        nofilter_time();
    } else {
        filter_time();
    }
}
function descending() {
    db.sort(function (a, b) {
        return parseFloat(b.rating) - parseFloat(a.rating);
    })
    if (document.getElementById("dropbtn").innerHTML == 'No Filter') {
        nofilter_time();
    } else {
        filter_time();
    }
}

var sidebar = L.control.sidebar({
    autopan: false,       // whether to maintain the centered map point when opening the sidebar
    closeButton: true,    // whether t add a close button to the panes
    container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
    position: 'left',     // left or right
}).addTo(map);

function newButton(label, container) {
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}


function savedx(e) {

    if (!(saved.includes(e))) {
        saved.push(e);

        var cache = [];
        for (let i = 0; i < saved.length; i++) {
            var keytemp = "saved" + i

            localStorage.setItem(keytemp, JSON.stringify(saved[i], function (key, value) {
                if (typeof value === "object" && value !== null) {
                    if (cache.indexOf(value) !== -1) {
                        return;
                    }
                    cache.push(value);
                }
                return value;
            }));

            localStorage.setItem("savedcount", i + 1)

        }
        while (document.getElementById("saved").childElementCount > 1) {
            document.getElementById("saved").removeChild(document.getElementById("saved").lastChild);
        }
        for (let i = 0; i < saved.length; i++) {
            const newelement = document.createElement('button');
            newelement.innerHTML = saved[i].name;
            newelement.classList.add('link');
            newelement.addEventListener('click', function () {
                clearMarkers()
                createMarkers3(saved[i]);
                map.flyTo(saved[i].center, 16);
            });
            document.getElementById("saved").appendChild(newelement);
            const hrElement = document.createElement('hr');
            document.getElementById("saved").appendChild(hrElement);
        }
    }
}
var routing = L.Routing.control({
    collapsible: true,
    position: 'topleft',
    show: false,
    plan: new (L.Routing.Plan.extend({
        createGeocoders: function () {
            var container = L.Routing.Plan.prototype.createGeocoders.call(this),
                reverseButton = newButton('<i class="fa-solid fa-arrows-rotate"></i>', container);

            L.DomEvent.on(reverseButton, 'click', function () {
                var waypoints = this.getWaypoints();
                this.setWaypoints(waypoints.reverse());
            }, this);
            var deleteButton = newButton('<i class="fa-solid fa-trash"></i>', container);
            L.DomEvent.on(deleteButton, 'click', function () {
                routing.spliceWaypoints(0, routing.getWaypoints().length);
            });
            return container;
        }
    }))([

    ], {
        geocoder: new L.Control.Geocoder.photon({
            geocodingQueryParams: {
                'lat': 22.3484019,
                'lon': 114.1320331,
                'limit': 18,
                'location_bias_scale': 0.1

            }
        }),
        routeWhileDragging: true
    })
}).addTo(map);

map.on('overlayadd', function (e) {
    if (e.name == 'Traffic') {
        legend.addTo(map);
    }
})
map.on('overlayremove', function (e) {
    if (e.name == 'Traffic') {
        legend.remove();
    }
})
var legend = L.control.Legend({
    position: "bottomright",
    legends: [{
        label: "Low Traffic",
        type: "polyline",
        color: "#2eab30",
        fillcolor: "#2eab30",
        weight: 4,

    }, {
        label: "Moderate",
        type: "polyline",
        color: "#f1bf40",
        fillcolor: "#f1bf40",
        weight: 4,

    }, {
        label: "Heavy Traffic",
        type: "polyline",
        color: "#e70704",
        fillcolor: "#e70704",
        weight: 4,

    }]
})



var streetview = new L.Control.Pegman({
    position: 'bottomright',
    theme: 'leaflet-pegman-v3-small'
});
streetview.addTo(map);
