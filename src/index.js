import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./store/rootreducer";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createBrowserHistory  } from "history";
import { resetGameStatus } from "./store/games/gamesSlice";
import { resetUserStatus } from "./store/users/usersSlice";


// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';

const root = ReactDOM.createRoot(document.getElementById("root"));

const history = createBrowserHistory();
console.log(history)

history.listen((location) => {
    if(location.pathname === '/games'){ 
      console.log(`history!!!!!!!!!!!!`)
      store.dispatch(resetGameStatus())}
    if(location === '/users') store.dispatch(resetUserStatus())
})



// async function start() {
//   store.dispatch(fetchGames());

//   root.render(
//     <React.StrictMode>
//       <Provider store={store}>
//         <BrowserRouter>
//           <App />
//         </BrowserRouter>
//       </Provider>
//     </React.StrictMode>
//   );
// }

// start()

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

