window.onload = () => {
    // let method = 'dynamic';

    // if you want to statically add places, de-comment following line
    let method = 'static';

    if (method === 'static') {
        let places = staticLoadPlaces();
        renderPlaces(places);
    }

    if (method !== 'static') {

        // first get current user location
        return navigator.geolocation.getCurrentPosition(function (position) {

            // than use it to load from remote APIs some places nearby
            dynamicLoadPlaces(position.coords)
                .then((places) => {
                    renderPlaces(places);
                })
        },
            (err) => console.error('Error in retrieving position', err),
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 27000,
            }
        );
    }
};

function staticLoadPlaces() {
    return [
        {
            name: "AR Object",
            location: {
                lat: 41.682350,
                lng: 123.387492,
            }
        },
    ];
}

// getting places from REST APIs // fsq3WhJBYV0mI4RJe/tXs3u4JOgPdMrRFCzE3nUhfteEGYI=
function dynamicLoadPlaces(position) {
    let params = {
        radius: 500,    // search places not farther than this value (in meters)
        clientId: 'EJX0XFUTFFXGV0CTXTC2UVVU412KMMPWFOS4DWWGMS3L4FXQ',   // add your credentials here
        clientSecret: 'WCJY1LIWNYFKXGNPZ21CRLCRYCFPOOV1V5DCOOZZJA2A2CLC',   // add your credentials here
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };

    // CORS Proxy to avoid CORS problems
    let corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Foursquare API
    let endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=15
        &v=${params.version}`;
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    return resp.response.venues;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};

function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        const latitude = place.location.lat;
        const longitude = place.location.lng;

        // add place icon
        const icon = document.createElement('a-image');
        icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
        icon.setAttribute('name', place.name);
        icon.setAttribute('src', './assets/map-marker.png');
        // for debug purposes, just show in a bigger scale, otherwise I have to personally go on places...
        icon.setAttribute('scale', '1 1 1');
        icon.addEventListener('loaded', () => window.dispatchEvent(new CustomEvent('gps-entity-place-loaded')));

        const clickListener = function (ev) {
            ev.stopPropagation();
            ev.preventDefault();

            const name = ev.target.getAttribute('name');

            const el = ev.detail.intersection && ev.detail.intersection.object.el;

            if (el && el === ev.target) {
                const label = document.createElement('span');
                const container = document.createElement('div');
                container.setAttribute('id', 'place-label');
                label.innerText = name;
                container.appendChild(label);
                document.body.appendChild(container);

                setTimeout(() => {
                    container.parentElement.removeChild(container);
                }, 5500);
            }
        };

        icon.addEventListener('click', clickListener);

        scene.appendChild(icon);

        // const placeText = document.createElement('a-link');
        // placeText.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
        // placeText.setAttribute('title', place.name);
        // placeText.setAttribute('scale', '15 15 15');
        
        // placeText.addEventListener('loaded', () => {
        //     window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        // });

        // scene.appendChild(placeText);      

    });
}
