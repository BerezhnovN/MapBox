import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Marker from "../Marker/Marker";
import "./style.css";

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(40.09);
  const [lat, setLat] = useState(47.42);
  const [zoom, setZoom] = useState(15);
  const [flag, setFlag] = useState(false);
  const [markers, setMarkers] = useState(
    JSON.parse(localStorage.getItem("markers")) || []
  );

  const createMarker = () => {
    if (flag === false) {
      setFlag(true);
    }
  };

  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
      pitch: 45,
      bearing: -17.5,
      antialias: true,
    });
  }, []);

  useEffect(() => {
    if (markers.length !== 0) {
      markers.map((el) => {
        new mapboxgl.Marker() 
          .setLngLat([el.longitude, el.latitude])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<h1>${el.title}</h1><p>${el.description}</p>`
            )
          )
          .addTo(map.current);
      });
      localStorage.setItem("markers", JSON.stringify(markers));
    }
  }, [markers]);

  useEffect(() => {
    if (!map.current) return;

    map.current.on("mousedown", (e) => {
      setLng(e.lngLat.lng.toFixed(4));
      setLat(e.lngLat.lat.toFixed(4));
    });

    map.current.on("move", () => {
      setZoom(map.current.getZoom().toFixed(2));
    });

    map.current.on("load", () => {
      const labelLayerId = map.current
        .getStyle()
        .layers.find(
          (layer) => layer.type === "symbol" && layer.layout["text-field"]
        ).id;

      map.current.addLayer(
        {
          id: `${mapContainer.current}`,
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#dda",
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.6,
          },
        },
        labelLayerId
      );
    });
  }, []);

  return (
    <div className="App">
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>

      {flag && (
        <Marker
          markers={markers}
          setFlag={setFlag}
          setMarkers={setMarkers}
          lng={lng}
          lat={lat}
        />
      )}

      <div
        ref={mapContainer}
        className="map-container"
        onClick={() => createMarker()}
      />
    </div>
  );
};

export default Map;
