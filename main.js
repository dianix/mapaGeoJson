let map;
// let estados = {
//     type: "FeatureCollection",
//     metadatos: {
//         CRS: "EPSG:6365",
//         Fuente_informacion_vectorial:
//             "INEGI. Marco Geoestadístico, diciembre de 2021",
//         Fuente_informacion_estadistica:
//             "INEGI. Censo de Población y Vivienda, 2020",
//     },
//     features: [],
// };
let botonera=document.getElementById('estadosBtns');
let encendido=false;
let idActivo = undefined;
let estadosLista;

function inicializa() {
    const latI = 23.84;
    const lngI = -102.18;
    const myOptions = {
        center: new google.maps.LatLng(latI, lngI),
        zoom: 6,
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    obtenerEstados();
}
function obtenerEstados() {
    let botones='';
    let boton='<p class="check-estado" data_id="__id1__" >__nombre__</input></p>'
    fetch('https://gaia.inegi.org.mx/wscatgeo/geo/mgee/')
        .then(response => response.json())
        .then(json => {
            // console.log(json)
            document.getElementById('btn-mapa').removeAttribute('disabled')
            map.data.addGeoJson(json);
            map.data.setStyle({
                fillColor: "seagreen",
                strokeColor: "seagreen",
                fillOpacity:0.1,
                strokeOpacity:0.5,
                visible:false
            });
            for(let i=0;i<json.features.length;i++){
                botones += boton
                .replace("__id1__", json.features[i].properties.cvegeo)
                .replace("__id__", json.features[i].properties.cvegeo)
                .replace("__nombre__", json.features[i].properties.nom_agee);
                botonera.innerHTML=botones;
            }
            map.data.addListener('mouseover', function(event) {
                let index = estadosLista.findIndex((el) => el.attributes[1].value === event.feature.h.cvegeo);
                estadosLista[index].classList.add('activo')
                map.data.revertStyle();
                map.data.overrideStyle(event.feature, {
                    fillColor: "orange",
                    strokeColor: "orange",
                    strokeWeight:2,
                    fillOpacity:0.6,
                    strokeOpacity:1,
                });
            });
            map.data.addListener('mouseout', function(event) {
                let index = estadosLista.findIndex((el) => el.attributes[1].value === event.feature.h.cvegeo);
                estadosLista[index].classList.remove('activo')
                map.data.revertStyle();
            });
            estadosLista=[...document.getElementsByClassName('check-estado')];
        })
        .catch(err => console.log('Solicitud fallida', err));

}
function resaltarEstado() {
    let id = event.target.attributes[1].value
    let index = Object.values(map.data.g.g).findIndex((el) => el.h.cvegeo === id);
    let feature = map.data.g.g[Object.keys(map.data.g.g)[index]];
    if (idActivo === id) {
        map.data.revertStyle(feature);
        idActivo = undefined;
    } else {
        map.data.revertStyle(feature)
        map.data.overrideStyle(feature, {
            fillColor: "orange",
                    strokeColor: "orange",
                    strokeWeight:2,
                    fillOpacity:0.6,
                    strokeOpacity:1,
        });
        idActivo = id;
    }
}
function mostrarOcultarEstados() {
    encendido = !encendido
    if (!encendido) {
        estadosLista.forEach(el=>{
            el.removeEventListener("mouseover",resaltarEstado)
            el.removeEventListener("mouseout",resaltarEstado)
            el.classList.remove("habilitado");
        })
        idActivo=undefined
        document.getElementById('btn-mapa').innerHTML='MOSTRAR ESTADOS'
        map.data.revertStyle();
        map.data.setStyle({
            visible:false
        });
    } else {;
        // estadosLista.forEach(el=>el.removeAttribute("disabled"))
        estadosLista.forEach(el=>{
            el.addEventListener("mouseover",resaltarEstado,)
            el.addEventListener("mouseout",resaltarEstado)
            el.classList.add("habilitado");
        })
        document.getElementById('btn-mapa').innerHTML='OCULTAR ESTADOS'
        map.data.revertStyle()
        map.data.setStyle({
            fillColor: "seagreen",
            strokeColor: "seagreen",
            fillOpacity:0.1,
            strokeOpacity:0.5,
        });
    }
}

