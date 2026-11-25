// screenshotModes.js — deterministic scenes for the entry screenshots, reached
// with ?shot=cover|orders|cooking|serve. Each scene builds a real mid-game
// kitchen from the game's own state: orders on the board, ingredients going
// onto a plate, the stove cooking, the shift timer running and a ready plate
// waiting on the serving counter. Normal play never uses these scenes.

import { spawnOrder } from './orders.js';

export function applyScreenshotScene(state, shotName) {
  state.phase = 'playing';
  state.elapsed = 52;
  state.shiftLeft = 68;
  state.score = 350;
  state.combo = 3;
  state.ordersServed = 3;
  // Deterministic order sequence: nasgor, soto, gado (by controlled randoms).
  spawnOrder(state, 0.01);
  spawnOrder(state, 0.4);
  spawnOrder(state, 0.55);
  state.orders[0].patienceLeft = 31;
  state.orders[1].patienceLeft = 44;
  state.orders[2].patienceLeft = 25;
  state.selectedOrderNumber = state.orders[0].number;

  if (shotName === 'cover' || shotName === 'cooking') {
    state.plate = ['rice', 'egg', 'chili'];
    state.cooking = { active: true, progress: 1.8, duration: 3.0, recipeId: 'nasgor', orderNumber: state.orders[0].number };
    state.plate = ['chicken', 'rice'];
    state.readyPlates = [{ recipeId: 'gado', recipeName: 'Gado-Gado Betawi', orderNumber: state.orders[2].number }];
    state.flashMessage = 'Gado-Gado matang dan siap saji — Nasi Goreng sedang dirakit!';
    state.flashSeconds = 99;
  } else if (shotName === 'orders') {
    state.plate = ['rice', 'egg'];
    state.flashMessage = 'Rush hour! Tiga order di papan — rakit yang paling mepet waktunya dulu!';
    state.flashSeconds = 99;
  } else if (shotName === 'serve') {
    state.plate = [];
    state.readyPlates = [
      { recipeId: 'nasgor', recipeName: 'Nasi Goreng Kampung', orderNumber: state.orders[0].number },
      { recipeId: 'soto', recipeName: 'Soto Ayam Lamongan', orderNumber: state.orders[1].number },
    ];
    state.score = 590;
    state.flashMessage = 'Dua piring siap saji! Tekan SAJIKAN (S) sebelum pelanggan kabur!';
    state.flashSeconds = 99;
  }
  return state;
}

export function screenshotShotFromLocation() {
  const params = new URLSearchParams(window.location.search);
  return params.get('shot');
}
