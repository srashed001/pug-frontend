
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import MuiBottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SportsIcon from '@mui/icons-material/Sports';
import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import MessageInput from '../threads/MessageInput';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addMessageInThread } from '../store/threads/threadsSlice';
import { Typography } from '@mui/material';
import { styled } from "@mui/material/styles";

const BottomNavigationAction = styled(MuiBottomNavigationAction)(`
  color: #FFFFFF;
  &.Mui-selected {
    color: #F9AEB0
  }
`);

export default function BottomNavigationBar() {
  const [threadId, setThreadId] = useState()
  const [value, setValue] = useState(0);
  const [active, setActive] = useState(true)
  const my = useSelector(state => state.my)
const location = useLocation()
const dispatch = useDispatch()

useEffect(()=> {
  if (location.pathname.slice(0,11) === '/threads/t/'){
    setActive(false)
    setThreadId(location.pathname.slice(11))
    
  } else {setActive(true)}
}, [location])

function handleAddMessage({message}){
  const data = {
    username: my.username, 
    threadId,
    message
  }

  dispatch(addMessageInThread(data))
}


if (!active) return (
  null
  );


  return (
    <Box sx={{ width: '80%' }}>
      <BottomNavigation
        showLabels
        sx={{width: '100%', height: 75, position: 'fixed', bottom: 0, backgroundColor: '#7F090B', zIndex: 10 }}
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
  
      
        <BottomNavigationAction label={<Typography sx={{fontSize: 10 }} >Home</Typography>} icon={<HomeIcon sx={{}} />} component={NavLink} to={'/'} />
        <BottomNavigationAction label={<Typography sx={{fontSize: 10 }} >Users</Typography>}  icon={<PeopleIcon sx={{}}/>} component={NavLink} to={'/users'} />
        <BottomNavigationAction label={<Typography sx={{fontSize: 10 }} >Games</Typography>}  icon={<SportsBasketballIcon sx={{}}/>} component={NavLink} to={'/games'} />
        <BottomNavigationAction label={<Typography sx={{fontSize: 10 }} >Courts</Typography>}  icon={<LocationOnIcon sx={{}}/>} component={NavLink} to={'/courts'} />

      </BottomNavigation>
    </Box>
  );
}
