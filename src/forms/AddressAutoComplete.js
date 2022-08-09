import usePlacesAutocomplete from "use-places-autocomplete";
import { Controller } from "react-hook-form";
import {
  Autocomplete,
  TextField,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import statesArr from "../common/50states";

const inputOptions = {
  width: {
    xs: "100%",
    sm: "100%",
  },
};

function AddressAutoComplete({ control, watch, setFormValue, reset, errors, getValues }) {
  const {
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 37.768009, lng: () => -122.387787 },
      radius: 25000,
    },
  });

  const handleSelect = (e, address) => {
    if (!address) return handleClose();

    const addressArr = address.split(", ");
    setFormValue("state", addressArr[addressArr.length - 2]);
    setFormValue("city", addressArr[addressArr.length - 3]);
    setFormValue("address", addressArr.slice(0, -3).join(", "));
    clearSuggestions();
  };

  const handleClose = () => {
    const {title, description, date, time} = getValues()
    reset({title, description, date, time});
    clearSuggestions();
  };

  watch((data) => {
    setValue(data.address);
  });

    return (
      <>
        <Controller
          name="address"
          control={control}
          rules={{ required: "address required" }}
          render={({ field }) => (
            <Autocomplete
              {...field}
              freeSolo
              blurOnSelect
              autoSelect
              onChange={handleSelect}
              sx={inputOptions}
              options={
                status !== "OK" ? [] : data.map((data) => data.description)
              }
              renderInput={(params) => (
                <TextField 
                {...params} 
                {...field} 
                variant="standard"
                error={!!errors.address}
                helperText={errors.address ? errors.address.message : 'address'}
                 />
              )}
            />
          )}
        />
        <Controller
          name="city"
          control={control}
          rules={{ required: "city required" }}
          render={({ field }) => (
            <TextField
              {...field}
              variant="standard"
              sx={inputOptions}
              error={!!errors.city}
              helperText={errors.city ? errors.city.message : "city"}
            />
          )}
        />

        <Controller
          name="state"
          control={control}
          rules={{ required: "state required" }}
          render={({ field }) => (
            <>
              <Select
                {...field}
                variant="standard"
                sx={inputOptions}
                  error={!!errors.state}
              >
                {statesArr.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error={!!errors.state} sx={inputOptions}>
              {errors.state ? errors.state.message : "state"}
            </FormHelperText>
            </>
          )}
        />
      </>
    );
}

export default AddressAutoComplete;
