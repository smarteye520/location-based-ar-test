
window.onload = () => {
    // const button = document.querySelector('button[data-action="change"]');
    // button.innerText = '﹖';

    let places = staticLoadPlaces();
    renderPlaces(places);
};

function staticLoadPlaces() {
    return [
        {
            name: 'First Place Object',
            location: {
                lat: 41.682387,
                lng: 123.387509,
            },
        },
        {
            name: 'Second Place Object',
            location: {
                lat: 41.682346,
                lng: 123.387483,
            },
        },
        {
            name: 'Third Place Object',
            location: {
                lat: 41.682332,
                lng: 123.387480,
            },
        },
    ];
}

var models = [
    {
        url: './assets/magnemite/scene.gltf',
        scale: '0.1 0.1 0.1',
        info: 'Magnemite',
        rotation: '0 180 0',
    },
    {
        url: './assets/articuno/scene.gltf',
        scale: '0.15 0.15 0.15',
        rotation: '0 180 0',
        info: 'Articuno',
    },
    {
        url: './assets/dragonite/scene.gltf',
        scale: '0.06 0.06 0.06',
        rotation: '0 180 0',
        info: 'Dragonite',
    },
];

var modelIndex = 0;
var setModel = function (model, entity) {
    if (model.scale) {
        entity.setAttribute('scale', model.scale);
    }

    if (model.rotation) {
        entity.setAttribute('rotation', model.rotation);
    }

    if (model.position) {
        entity.setAttribute('position', model.position);
    }

    entity.setAttribute('gltf-model', model.url);

    const div = document.querySelector('.instructions');
    div.innerText = model.info;
};

function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        let latitude = place.location.lat;
        let longitude = place.location.lng;

        // let object = document.createElement('a-entity');
        // object.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
        // setModel(models[0], object);
        // object.setAttribute('name', place.name)      

        // // object.setAttribute('animation-mixer', '');

        // // document.querySelector('button[data-action="change"]').addEventListener('click', function () {
        // //     var entity = document.querySelector('[gps-entity-place]');
        // //     modelIndex++;
        // //     var newIndex = modelIndex % models.length;
        // //     setModel(models[newIndex], entity);
        // // });

        // object.addEventListener('loaded', () => window.dispatchEvent(new CustomEvent('gps-entity-place-loaded')));

        // const clickListener = function (ev) {
        //     ev.stopPropagation();
        //     ev.preventDefault();

        //     const name = ev.target.getAttribute('name');

        //     const el = ev.detail.intersection && ev.detail.intersection.object.el;

        //     if (el && el === ev.target) {
        //         const div = document.querySelector('.instructions');
        //         div.innerText = name;

        //         const label = document.createElement('span');
        //         const container = document.createElement('div');
        //         container.setAttribute('id', 'place-label');
        //         label.innerText = name;
        //         container.appendChild(label);
        //         document.body.appendChild(container);

        //         setTimeout(() => {
        //             container.parentElement.removeChild(container);
        //         }, 6000);
        //     }
        // };

        // object.addEventListener('click', clickListener);

        // scene.appendChild(object);

        const icon = document.createElement('a-image');
        icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
        icon.setAttribute('name', place.name);
        icon.setAttribute('src', './assets/map-marker.png');
        // for debug purposes, just show in a bigger scale, otherwise I have to personally go on places...
        icon.setAttribute('scale', '1 1 1');
        icon.addEventListener('loaded', () => window.dispatchEvent(new CustomEvent('gps-entity-place-loaded')));

        const div = document.querySelector('.instructions');
        div.innerText =  'Debug 2';

        const clickListener = function (ev) {
            ev.stopPropagation();
            ev.preventDefault();

            const name = ev.target.getAttribute('name');

            const el = ev.detail.intersection && ev.detail.intersection.object.el;

            if (el && el === ev.target) {
                const div = document.querySelector('.instructions');
                div.innerText = name;

                // const label = document.createElement('span');
                // const container = document.createElement('div');
                // container.setAttribute('id', 'place-label');
                // label.innerText = name;
                // container.appendChild(label);
                // document.body.appendChild(container);

                // setTimeout(() => {
                //     container.parentElement.removeChild(container);
                // }, 5500);
            }
        };

        icon.addEventListener('click', clickListener);

        scene.appendChild(icon);
    });
}
