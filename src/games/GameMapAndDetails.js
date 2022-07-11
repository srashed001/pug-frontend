import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";

import GeoLocationApi from "../api/GeoLocationApi";
import mapStyles from "../courts/mapStyles";
import "../courts/mapStyles.css";
import { selectAllCourts, updateCourts } from "../store/courts/courtsSlice";
import CourtInfoWindow from "../courts/CourtInfoWindow";
import { Stack, Box, Button } from "@mui/material";
import GameDetails from "./GameDetails";

const api_key = GeoLocationApi.api_key;
const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 37.768009,
  lng: -122.387787,
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

function GameMapAndDetails() {
  const { gameId } = useParams();
  const dispatch = useDispatch();
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: api_key,
    libraries,
  });
  const [selected, setSelected] = useState(null);
  const [location, setLocation] = useState();
  const markers = useSelector(selectAllCourts);

  const mapRef = useRef();

  const getCourts = useCallback(() => {
    let request = {
      location: mapRef.current.center,
      rankBy: window.google.maps.places.RankBy.DISTANCE,
      keyword: "basketball courts",
    };

    const service = new window.google.maps.places.PlacesService(mapRef.current);
    service.nearbySearch(request, (results, status, next_page_token) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        dispatch(updateCourts({ results, next_page_token }));
      }
    });
  }, [dispatch]);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(13);
  }, []);

  const loadInfoWindow = useCallback((request, disabled = false) => {
    const service = new window.google.maps.places.PlacesService(mapRef.current);
    service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        if (!disabled) setSelected(place);
      }
    });
  }, []);

  if (isLoaded)
    return (
      <Stack sx={{ width: "100%" , marginBottom: 10}}>
        <Box className="google">
          {isLoaded && (
            <GoogleMap
              id="map"
              mapContainerStyle={mapContainerStyle}
              zoom={13}
              center={center}
              options={options}
              onLoad={onMapLoad}
              onClick={() => setSelected(null)}
            >
              {location && (
                <MarkerF
                  position={location}
                  visible={true}
                  title={`Game Location`}
                  icon={{
                    url: `/gameIcon.svg`,
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(15, 15),
                    scaledSize: new window.google.maps.Size(50, 50),
                  }}
                ></MarkerF>
              )}

              {markers &&
                markers.map((marker) => (
                  <MarkerF
                    key={marker.place_id}
                    position={marker.geometry.location}
                    visible={true}
                    onClick={() => {
                      loadInfoWindow({ placeId: marker.place_id });
                    }}
                  >
                    {selected && selected.place_id === marker.place_id && (
                      <InfoWindowF
                        onCloseClick={() => {
                          setSelected(null);
                        }}
                      >
                        <CourtInfoWindow selected={selected} />
                      </InfoWindowF>
                    )}
                  </MarkerF>
                ))}
            </GoogleMap>
          )}
          <Button sx={{color: 'rgba(177, 167, 166)'}} onClick={getCourts}>Find courts in area</Button>
        </Box>
        <GameDetails panTo={panTo} gameId={gameId} setLocation={setLocation} />
      </Stack>
    );
}

export default GameMapAndDetails;
