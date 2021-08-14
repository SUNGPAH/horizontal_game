export const SET_ENEMIES = "SET_ENEMIES";

export const setEnemies = (enemies) => ({
  type: SET_ENEMIES,
  payload: enemies,
});

const initialState = {
  enemies: [],
};

const enemy = (state = initialState, action) => {
  switch (action.type) {
    case SET_ENEMIES: {
      return {
        ...state,
        enemies: action.payload,
      };
    }
    default:
      return state;
  }
}

export default enemy

