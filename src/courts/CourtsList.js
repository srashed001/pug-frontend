import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

import Autocomplete from "@mui/material/Autocomplete";
import { useErrorHandler } from "react-error-boundary";

import TextField from "@mui/material/TextField";
import GeoLocationApi from "../api/GeoLocationApi";
import mapStyles from "./mapStyles";
import "./mapStyles.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllCourts, updateCourts } from "../store/courts/courtsSlice";
import CourtInfoWindow from "./CourtInfoWindow";
import CourtsListDrawer from "./CourtListDrawer";
import { Box } from "@mui/system";
import { Alert, AlertTitle, Button, Stack } from "@mui/material";

import MyLocationIcon from "@mui/icons-material/MyLocation";
import CourtListCreateGame from "./CourtListCreateGame";

const api_key = GeoLocationApi.api_key;
const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
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

function CourtsList() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: api_key,
    libraries,
  });
  const [open, setOpen] = useState(false);
  const [mapError, setMapError] = useState(null);
  const handleError = useErrorHandler();
  const [selected, setSelected] = useState(null);
  const [location, setLocation] = useState({
    address: "",
    city: "",
    state: "",
  });
  const markers = useSelector(selectAllCourts);
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const mapRef = useRef();

  const getCourts = useCallback((location) => {
    let request = {
      location,
      rankBy: window.google.maps.places.RankBy.DISTANCE,
      keyword: "basketball courts",
    };

    const timerId = setTimeout(() => {
      setMapError("Error occurred trying to find courts");
    }, 4000);

    const service = new window.google.maps.places.PlacesService(mapRef.current);
    service.nearbySearch(request, (results, status, next_page_token) => {
      clearTimeout(timerId);
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        dispatch(updateCourts({ results, next_page_token }));
      } else if (
        status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS
      ) {
        setMapError("No courts could be found in your area");
        dispatch(updateCourts({ results: [], next_page_token: null }));
      } else {
        setMapError("Error occurred trying to find courts");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMapLoad = useCallback(
    (map) => {
      try {
        mapRef.current = map;
        getCourts(map.center);
      } catch (err) {
        handleError({ message: "Error loading Google Map" });
      }
    },
    [getCourts, handleError]
  );

  const panTo = useCallback(
    ({ lat, lng }) => {
      try {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(13);
        getCourts({ lat, lng });
      } catch (err) {
        setMapError("Error occurred trying to pan map");
      }
    },
    [getCourts]
  );

  const loadInfoWindow = useCallback((request, disabled = false) => {
    const timerId = setTimeout(() => {
      setMapError("Error occurred getting court detauls");
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


  if (loadError) return handleError({ message: `Error loading google maps` });
  if (!isLoaded) return "Loading maps";

  return (
    <Stack className="google">
      <CourtListCreateGame
        open={open}
        handleClose={handleClose}
        location={location}
      />
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
      <h1>pug</h1>
      <Search
        panTo={panTo}
        loadInfoWindow={loadInfoWindow}
        location={location}
        handleClickOpen={handleClickOpen}
      />
      <Box mt={10}>
        <GoogleMap
          id="map"
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={center}
          options={options}
          onLoad={onMapLoad}
          onClick={() => setSelected(null)}
        >
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
                      handleClickOpen={handleClickOpen}
                      location={location}
                    />
                  </InfoWindowF>
                )}
              </MarkerF>
            ))}
        </GoogleMap>
      </Box>
    </Stack>
  );
}

function Locate({ panTo, setValue }) {
  return (
    <Button
      startIcon={<MyLocationIcon />}
      onClick={async () => {
        const res = await GeoLocationApi.get();
        panTo(res.location);
        setValue("");
      }}
      sx={{ color: "#ffffff", fontSize: "10px", fontFamily: "Roboto" }}
    >
      current location
    </Button>
  );
}

function Search({ panTo, loadInfoWindow, location, handleClickOpen }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 43.653225, lng: () => -79.383186 },
      radius: 25000,
    },
  });

  return (
    <Stack
      className={"search"}
      sx={{
        padding: 1,
        width: "100%",
        backgroundColor: "#E5383B",
        zIndex: "modal",
      }}
    >
      <Autocomplete
        freeSolo
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.description
        }
        filterOptions={(x) => x}
        value={value ? value : ""}
        inputValue={value ? value : ""}
        onChange={async (e, address) => {
          setValue(address, false);
          clearSuggestions();

          try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            console.log(lat, lng);
            panTo({ lat, lng });
          } catch (e) {
            console.log(e);
          }
        }}
        onInputChange={(event) => {
          setValue(event.target.value);
        }}
        disabled={!ready}
        placeholder="Enter Address"
        autoComplete
        sx={{ boxShadow: 3, padding: 1 }}
        size={"small"}
        renderInput={(params) => {
          return (
            <TextField
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: 1,
                fontSize: "10px",
                width: "100%",
              }}
              {...params}
            />
          );
        }}
        options={status !== "OK" ? [] : data.map((data) => data.description)}
      />
      <Box sx={{ display: "inline-flex" }}>
        <Locate panTo={panTo} setValue={setValue} />
        <CourtsListDrawer
          loadInfoWindow={loadInfoWindow}
          location={location}
          handleClickOpen={handleClickOpen}
        />
      </Box>
    </Stack>
  );
}

export default CourtsList;
