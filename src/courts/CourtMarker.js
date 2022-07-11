
import {
    Marker,
    InfoWindowF,
  } from "@react-google-maps/api";
import CourtInfoWindow from "./CourtInfoWindow";


function CourtMarker({marker, selected, setSelected, loadInfoWindow}){

    return (
        <Marker
        position={marker.geometry.location}
        visible={true}
        //   icon={{
        //     url: `/courtIcon4.svg`,
        //     scaledSize: new window.google.maps.Size(30, 30),
        //     origin: new window.google.maps.Point(0, 0),
        //     anchor: new window.google.maps.Point(15, 15),
        //     fillColor: "blue"
        //   }}
        onClick={() => {
          loadInfoWindow({ placeId: marker.place_id });
        }}
      >
        {selected && selected.place_id === marker.place_id && (
          <InfoWindowF
            // position={selected.geometry.location}
            // zIndex={10}
            // onLoad={onLoad}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <CourtInfoWindow selected={selected} />
          </InfoWindowF>
        )}
      </Marker>

    )

}

export default CourtMarker