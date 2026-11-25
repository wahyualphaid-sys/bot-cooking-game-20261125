// inputHandlers.js — mouse and keyboard control: clicking an ingredient chip
// on the counter adds it to the plate, the MASAK / SAJIKAN / BUANG buttons run
// the stove, the serving counter and the bin, and keys 1-0, C, S, T, TAB, R
// mirror every mouse action for fast play.

import { INGREDIENTS } from './recipes.js';
import { chopIngredient, startCooking, serveReadyPlate, trashPlate } from './cooking.js';
import { selectNextOrder } from './orders.js';
import { resetKitchen } from './kitchenState.js';
import { playChopSound, playSizzleSound, playServeSound } from './soundEffects.js';
import { VIEW_WIDTH, VIEW_HEIGHT } from './renderKitchen.js';

export function ingredientAtPoint(x, y) {
  if (y < 610 || y > 662) return null;
  for (let i = 0; i < INGREDIENTS.length; i++) {
    const chipX = 36 + i * 122;
    if (x >= chipX && x <= chipX + 52) return INGREDIENTS[i];
  }
  return null;
}

export function actionButtonAtPoint(x, y) {
  if (y < 402 || y > 468) return null;
  const actions = ['cook', 'serve', 'trash'];
  for (let i = 0; i < actions.length; i++) {
    const buttonX = 764 + i * 168;
    if (x >= buttonX && x <= buttonX + 156) return actions[i];
  }
  return null;
}

export function runKitchenAction(state, action) {
  if (action === 'cook' && startCooking(state)) playSizzleSound();
  if (action === 'serve' && serveReadyPlate(state)) playServeSound();
  if (action === 'trash') trashPlate(state);
}

export function bindMouseAndKeyboard(canvas, state) {
  function toGamePoint(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * VIEW_WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * VIEW_HEIGHT,
    };
  }
  canvas.addEventListener('click', (event) => {
    const point = toGamePoint(event);
    if (state.phase === 'title') { resetKitchen(state); return; }
    if (state.phase === 'over') { resetKitchen(state); return; }
    const ingredient = ingredientAtPoint(point.x, point.y);
    if (ingredient) { if (chopIngredient(state, ingredient.id)) playChopSound(); return; }
    const action = actionButtonAtPoint(point.x, point.y);
    if (action) runKitchenAction(state, action);
  });
  window.addEventListener('keydown', (event) => {
    if (state.phase !== 'playing') {
      if (event.key === 'r' || event.key === 'R' || event.key === 'Enter' || event.key === ' ') resetKitchen(state);
      return;
    }
    const byKey = INGREDIENTS.find((item) => item.key === event.key);
    if (byKey) { if (chopIngredient(state, byKey.id)) playChopSound(); return; }
    if (event.key === 'c' || event.key === 'C') runKitchenAction(state, 'cook');
    else if (event.key === 's' || event.key === 'S') runKitchenAction(state, 'serve');
    else if (event.key === 't' || event.key === 'T') runKitchenAction(state, 'trash');
    else if (event.key === 'Tab') { event.preventDefault(); selectNextOrder(state); }
  });
}
