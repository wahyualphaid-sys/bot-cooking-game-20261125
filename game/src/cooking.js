// cooking.js — the cooking line: adding ingredients to the assembly plate,
// checking a plate against its recipe, running the stove timer, plating the
// finished dish onto the serving counter and clearing a ruined plate.

import { recipeById, recipeNeedsIngredient, countOnPlate } from './recipes.js';
import { selectedOrder, removeOrder, scoreServedOrder } from './orders.js';

export function addIngredientToPlate(state, ingredientId) {
  if (state.phase !== 'playing') return false;
  if (state.cooking.active) return false;
  const order = selectedOrder(state);
  if (!order) { state.flashMessage = 'Belum ada order — tunggu pelanggan datang.'; state.flashSeconds = 1.6; return false; }
  if (state.plate.length >= 4) { state.flashMessage = 'Piring perakitan sudah penuh!'; state.flashSeconds = 1.6; return false; }
  state.plate.push(ingredientId);
  const recipe = recipeById(order.recipeId);
  if (!recipeNeedsIngredient(recipe, ingredientId)) {
    state.flashMessage = `${ingredientId} tidak ada di resep ${recipe.name} — hati-hati!`;
    state.flashSeconds = 1.8;
  }
  return true;
}

export function plateMatchesRecipe(state) {
  const order = selectedOrder(state);
  if (!order) return false;
  if (state.plate.length !== order.ingredients.length) return false;
  return order.ingredients.every((id) => countOnPlate(state.plate, id) === countOnPlate(order.ingredients, id));
}

export function startCooking(state) {
  if (state.cooking.active || !state.plate.length) return false;
  const order = selectedOrder(state);
  if (!order) return false;
  if (!plateMatchesRecipe(state)) {
    state.flashMessage = 'Bahan belum pas dengan resep — buang (T) atau lengkapi dulu.';
    state.flashSeconds = 2.0;
    return false;
  }
  const recipe = recipeById(order.recipeId);
  state.cooking = { active: true, progress: 0, duration: recipe.cookSeconds, recipeId: recipe.id, orderNumber: order.number };
  return true;
}

export function updateCooking(state, deltaSeconds) {
  if (!state.cooking.active) return false;
  state.cooking.progress += deltaSeconds;
  if (state.cooking.progress < state.cooking.duration) return false;
  const recipe = recipeById(state.cooking.recipeId);
  state.readyPlates.push({ recipeId: recipe.id, recipeName: recipe.name, orderNumber: state.cooking.orderNumber });
  state.cooking = { active: false, progress: 0, duration: 0, recipeId: null, orderNumber: null };
  state.plate = [];
  state.flashMessage = `${recipe.name} matang! Klik SAJIKAN untuk mengantar.`;
  state.flashSeconds = 2.0;
  return true;
}

export function serveReadyPlate(state) {
  const ready = state.readyPlates[0];
  if (!ready) { state.flashMessage = 'Belum ada piring siap saji di meja saji.'; state.flashSeconds = 1.6; return false; }
  const order = state.orders.find((item) => item.number === ready.orderNumber);
  state.readyPlates.shift();
  if (!order) { state.flashMessage = 'Pelanggan piring itu sudah pergi…'; state.flashSeconds = 1.8; return false; }
  scoreServedOrder(state, order);
  removeOrder(state, order.number);
  return true;
}

export function trashPlate(state) {
  if (state.cooking.active) return false;
  state.plate = [];
  state.flashMessage = 'Piring dibersihkan. Mulai rakit lagi.';
  state.flashSeconds = 1.4;
  return true;
}

export function chopIngredient(state, ingredientId) {
  // Chopping-board flavour action: the first tap on a raw ingredient "preps" it.
  state.prepped[ingredientId] = true;
  return addIngredientToPlate(state, ingredientId);
}
