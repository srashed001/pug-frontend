// Need REACT_APP prefix for create-react-app
// https://stackoverflow.com/questions/48378337/create-react-app-not-picking-up-env-files
const environment = {
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL || "http://localhost:3001",
    googleApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    pugSecretKey: process.env.REACT_APP_PUG_SECRET
}

export default environment;