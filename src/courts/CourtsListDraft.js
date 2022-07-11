import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { formatRelative } from "date-fns";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

import Autocomplete from "@mui/material/Autocomplete";

import TextField from "@mui/material/TextField";
import GeoLocationApi from "../api/GeoLocationApi";
import mapStyles from "./mapStyles";
import "./mapStyles.css";
import {
  startTransition,
  useCallback,
  useRef,
  useState,
  useTransition,
} from "react";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import { isPending } from "@reduxjs/toolkit";
import NeabySearchApi from "../api/NearbySearchApi";
import axios from "axios";
import PugApi from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { selectAllCourts, updateCourts } from "../store/courts/courtsSlice";

const api_key = GeoLocationApi.api_key;
const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 43.653225,
  lng: -79.383186,
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

function CourtsList() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: api_key,
    libraries,
  });

  const markers = useSelector(selectAllCourts);
  const courts = useSelector((state) => state.courts);
  const dispatch = useDispatch();
  //   const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState();
  const [isPending, setIsPending] = useState(false);

  //   const onMapClick = useCallback((event) => {
  //     setMarkers((state) => [
  //       ...state,
  //       {
  //         lat: event.latLng.lat(),
  //         lng: event.latLng.lng(),
  //         time: new Date(),
  //       },
  //     ]);
  //   }, []);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;

    getCourts(center);
  }, []);

  const getCourts = useCallback((location) => {
    let request = {
      location,
      //   radius: 15000,
      rankBy: window.google.maps.places.RankBy.DISTANCE,
      keyword: "basketball courts",
    };

    const service = new window.google.maps.places.PlacesService(mapRef.current);
    const a = service.nearbySearch(
      request,
      (results, status, next_page_token) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          dispatch(updateCourts({ results, next_page_token }));
        }
      }
    );

    // async function get(){
    //     const res = await PugApi.getCourts(location)
    //     setMarkers(res.results)
    // }
    // get()
  }, []);

  const panTo = useCallback(
    ({ lat, lng }) => {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(14);
      getCourts({ lat, lng });
    },
    [getCourts]
  );

  if (loadError) return "Error Loading Maps";
  if (!isLoaded) return "Loading maps";
  console.log(markers, courts);

  return (
    <div style={{ opacity: isPending ? 0.5 : 1.0 }}>
      <h1>pug</h1>
      <button onClick={getCourts}>get courts</button>

      <Search panTo={panTo} />
      {/* <Locate panTo={panTo} st={setIsPending} /> */}
      {isPending ? <Loading /> : null}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={center}
        options={options}
        // onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.place_id}
            position={marker.geometry.location}
            // icon={{
            //   url: `/courtIcon4.svg`,
            //   scaledSize: new window.google.maps.Size(30, 30),
            //   origin: new window.google.maps.Point(0, 0),
            //   anchor: new window.google.maps.Point(15, 15),
            // }}
            onClick={() => {
              console.log(marker);
              setSelected(marker);
            }}
          />
        ))}

        {selected ? (
          <InfoWindow
            position={selected.geometry.location}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <h2>game</h2>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}

function Loading() {
  return (
    <div className="loading" style={{ opacity: 1.0 }}>
      <img src="loadingIcon1.svg" alt="loading icon" />
    </div>
  );
}

function Locate({ panTo, setValue }) {
  return (
    <button
      className="locate"
      onClick={async () => {
        // st(true)
        //   navigator.geolocation.getCurrentPosition(
        //     (position) => {
        //       panTo({
        //         lat: position.coords.latitude,
        //         lng: position.coords.longitude,
        //       });
        //       st(false)
        //     },
        //     () => null
        //   );
        const res = await GeoLocationApi.get();
        console.log(res);
        panTo(res.location);
        setValue("");
      }}
    >
      <img src="locateMeIcon1.svg" alt="compass locate me" />
    </button>
  );
}

function Search({ panTo }) {
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
    <div>
      <div className="search">
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
          renderInput={(params) => {
            return <TextField {...params} />;
          }}
          options={status !== "OK" ? [] : data.map((data) => data.description)}
        />
      </div>
      <Locate panTo={panTo} setValue={setValue} />
    </div>
  );
}

export default CourtsList;
