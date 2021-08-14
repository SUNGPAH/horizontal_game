export const SET_POS_X = "SET_POS_X";
export const SET_POS_Y = "SET_POS_Y";
export const SET_GAME_STATUS = "SET_GAME_STATUS";

export const setPosX = (posX) => ({
  type: SET_POS_X,
  payload: posX,
});

export const setPosY = (posY) => ({
  type: SET_POS_Y,
  payload: posY,
});

export const setGameStatus = (gameStatus) => ({
  type: SET_GAME_STATUS,
  payload: gameStatus
})

const initialState = {
  posX: null,
  posY: 0,
  playerWidth: 32,
  playerHeight: 48,
  gameStatus: null
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case SET_POS_X: {
      return {
        ...state,
        posX: action.payload,
      };
    }
    case SET_POS_Y: {
      return {
        ...state,
        posY: action.payload,
      };
    }

    case SET_GAME_STATUS: {
      return {
        ...state,
        gameStatus: action.payload
      }
    }

    default:
      return state;
  }
};

export default user;
