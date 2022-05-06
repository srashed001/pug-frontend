
const INITIAL_STATE = {
    byId: {},
    allIds: []
}

function games (state = INITIAL_STATE, action){
    switch(action.type){
        case "FETCH_GAMES":
            return {...state, byId : action.byId, allIds: action.allIds}
        default:
            return state
    }

}

export default games