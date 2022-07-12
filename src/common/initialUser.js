
const initialUser = {
    birthDate: "",
    city: "",
    createdOn: undefined,
    email: "",
    firstName: "",
    followers: {entities: {}, ids: []},
    follows: {entities: {}, ids: []},
    games: {
      hosted: { resolved: [], pending: [] },
      joined: { resolved: [], pending: [] },
    },
    isAdmin: false,
    isPrivate: false,
    lastName: "",
    phoneNumber: null,
    profileImg: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDhweCIgaGVpZ2h0PSI0OHB4IiB2aWV3Qm94PSIwIDAgNDggNDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQo8cGF0aCBkPSJNMzIgMTZDMzQuNzYxNCAxNiAzNyAxMy43NjE0IDM3IDExQzM3IDguMjM4NTggMzQuNzYxNCA2IDMyIDZDMjkuMjM4NiA2IDI3IDguMjM4NTggMjcgMTFDMjcgMTMuNzYxNCAyOS4yMzg2IDE2IDMyIDE2WiIgZmlsbD0iIzJGODhGRiIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbWl0ZXJsaW1pdD0iMiIvPg0KPHBhdGggZD0iTTIzIDQwTDMxLjExIDM3Ljk0QzMxLjg5IDM3Ljc1IDMyLjEzIDM2Ljc1IDMxLjUzIDM2LjIyTDIzIDI5TDI3IDIxTDE2LjU5IDE3LjI2QzE2LjA5IDE3LjA4IDE1LjY5IDE2LjcyIDE1LjQ2IDE2LjI0TDExIDgiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLW1pdGVybGltaXQ9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTIzIDI5TDE2LjAzMDEgMzcuNzlDMTUuODIwMSAzOC4wNCAxNS41NjAxIDM4LjI0IDE1LjI2MDEgMzguMzZMNSA0MiIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbWl0ZXJsaW1pdD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8cGF0aCBkPSJNMjcgMjFMMzYuOSAyMy43OUMzNy4zNyAyMy45MyAzNy43OCAyNC4yMyAzOC4wNCAyNC42NEw0MiAzMSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbWl0ZXJsaW1pdD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8cGF0aCBkPSJNMTggOEMxOS42NTY5IDggMjEgNi42NTY4NSAyMSA1QzIxIDMuMzQzMTUgMTkuNjU2OSAyIDE4IDJDMTYuMzQzMSAyIDE1IDMuMzQzMTUgMTUgNUMxNSA2LjY1Njg1IDE2LjM0MzEgOCAxOCA4WiIgZmlsbD0iYmxhY2siLz4NCjwvc3ZnPg0K",
    state: "",
    username: "",
  };

  export default initialUser