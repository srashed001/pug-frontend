import { useCallback, useEffect, useRef, useState } from "react";
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
import { Stack, Box, Button, Alert, AlertTitle } from "@mui/material";
import GameDetails from "./GameDetails";

const api_key = GeoLocationApi.api_key;
const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "100%",
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
  const [location, setLocation] = useState({
    address: "",
    city: "",
    state: "",
  });
  const [game, setGame] = useState();
  const markers = useSelector(selectAllCourts);
  const [mapError, setMapError] = useState(null);

  const mapRef = useRef();

  const handleGetCourts = async () => {
    const getCourts = new Promise(function (resolve, reject) {
      const timeId = setTimeout(() => {
        reject("Error occurred trying to find courts");
      }, 4000);

      let request = {
        location: mapRef.current.center,
        rankBy: window.google.maps.places.RankBy.DISTANCE,
        keyword: "basketball court",
      };

      const service = new window.google.maps.places.PlacesService(
        mapRef.current
      );

      service.nearbySearch(request, (results, status, next_page_token) => {
        clearTimeout(timeId);
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve({ results, next_page_token });
        } else if (
          status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS
        ) {
          setMapError("No courts could be found in your area");
          resolve({ results: [], next_page_token: null });
        } else {
          reject("Error occurred trying to find courts");
        }
      });
    });

    try {
      const results = await getCourts;
      dispatch(updateCourts(results));
    } catch (err) {
      setMapError(err);
    }
  };

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(13);
  }, []);

  const loadInfoWindow = useCallback((request, disabled = false) => {
    const timerId = setTimeout(() => {
      setMapError(`Error occurred while retrieving court details`);
    }, 4000);
    const service = new window.google.maps.places.PlacesService(mapRef.current);
    service.getDetails(request, (place, status) => {
      clearTimeout(timerId);
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        if (!disabled) setSelected(place);
        const location = place.address_components.reduce((accum, curr) => {
          if (curr.types[0] === "street_number")
            return { ...accum, address: curr.long_name };
          if (curr.types[0] === "route")
            return {
              ...accum,
              address: accum.address
                ? accum.address + " " + curr.short_name
                : curr.short_name,
            };
          if (curr.types[0] === "locality")
            return { ...accum, city: curr.long_name };
          if (curr.types[0] === "administrative_area_level_1")
            return { ...accum, state: curr.short_name };
          return accum;
        }, {});

        if (!location.address) location.address = place.name;
        setLocation(location);
      } else if (
        status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS
      ) {
        setMapError("No court information could be found");
      } else {
        setMapError(`Error occurred while retrieving court details`);
      }
    });
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (mapError) setMapError(null);
    }, 7000);

    return () => clearTimeout(timerId);
  }, [mapError]);

  if (loadError) setMapError("Google maps failed to load");

  if (isLoaded)
    return (
      <Stack sx={{ width: "100%", marginBottom: 10 }}>
        {mapError && (
          <Box
            sx={{
              position: "fixed",
              width: "100%",
              top: "5rem",
              zIndex: "tooltip",
            }}
          >
            <Alert severity="error">
              <AlertTitle>{mapError}</AlertTitle>
              Recommendation — <strong>go home and refresh</strong>
            </Alert>
          </Box>
        )}
        <Box
          className="google"
          sx={{ width: "100%", height: { xs: 250, sm: 400 }, marginBottom: 5 }}
        >
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
              {game && (
                <MarkerF
                  position={game}
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
                        className="info"
                        onLoad={() => {
                          mapRef.current.panTo(selected.geometry.location);
                        }}
                        onCloseClick={() => {
                          setSelected(null);
                        }}
                        position={selected.geometry.location}
                      >
                        <CourtInfoWindow
                          selected={selected}
                          location={location}
                        />
                      </InfoWindowF>
                    )}
                  </MarkerF>
                ))}
            </GoogleMap>
          )}
          <Button
            sx={{ color: "rgba(177, 167, 166)" }}
            onClick={handleGetCourts}
          >
            Find courts in area
          </Button>
        </Box>
        <GameDetails panTo={panTo} gameId={gameId} setLocation={setGame} />
      </Stack>
    );
}

export default GameMapAndDetails;
