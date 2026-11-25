// kitchenState.js — creates and resets the whole kitchen: score, shift timer,
// orders, the assembly plate, the stove, ready plates and the rush level that
// makes orders arrive faster the longer the shift runs.

export function createKitchenState() {
  return {
    phase: 'title', // title | playing | over
    score: 0,
    coins: 0,
    shiftLeft: 120,
    shiftTotal: 120,
    orders: [],
    selectedOrderNumber: null,
    plate: [],
    prepped: {},
    cooking: { active: false, progress: 0, duration: 0, recipeId: null, orderNumber: null },
    readyPlates: [],
    ordersServed: 0,
    ordersMissed: 0,
    combo: 0,
    spawnTimer: 0,
    flashMessage: 'Klik bahan di meja untuk merakit hidangan sesuai papan order!',
    flashSeconds: 4,
    elapsed: 0,
  };
}

export function resetKitchen(state) {
  const fresh = createKitchenState();
  Object.assign(state, fresh);
  state.phase = 'playing';
  return state;
}

export function spawnIntervalForElapsed(elapsedSeconds) {
  if (elapsedSeconds < 30) return 9;
  if (elapsedSeconds < 60) return 7.5;
  if (elapsedSeconds < 90) return 6;
  return 5;
}

export function rushLevelForElapsed(elapsedSeconds) {
  return Math.min(4, 1 + Math.floor(elapsedSeconds / 30));
}
