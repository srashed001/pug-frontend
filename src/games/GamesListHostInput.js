import { FormHelperText, TextField } from "@mui/material"
import { Box } from "@mui/system"
import { Controller } from "react-hook-form"




function GamesHostListInput({control}){
 

    return (
        <Box sx={{padding: 1, boxShadow: "1px 1px 5px #161A1D"}}>

            <Controller
            name="hostQuery"
            control={control}
            sx={{boxShadow: 1}}
            render={({ field }) => (
                <>
              <TextField  size="small"  sx={{ width: "100%", backgroundColor: '#ffffff', boxShadow: 3, borderRadius: 1, fontSize: 10}} {...field} />
              <FormHelperText sx={{color: '#ffffff'}}>search by host username</FormHelperText>
                </>
              )}
          />
        </Box>

    )

}

export default GamesHostListInput