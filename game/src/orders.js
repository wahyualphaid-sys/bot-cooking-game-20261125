// orders.js — the order board: spawning customer orders, ticking their patience
// timers down, expiring orders that waited too long and scoring served orders.

import { RECIPES } from './recipes.js';

let nextOrderNumber = 1;

export function spawnOrder(state, randomValue) {
  const recipe = RECIPES[Math.floor(randomValue * RECIPES.length) % RECIPES.length];
  const order = {
    number: nextOrderNumber++,
    recipeId: recipe.id,
    recipeName: recipe.name,
    ingredients: [...recipe.ingredients],
    price: recipe.price,
    patienceLeft: recipe.patience,
    patienceTotal: recipe.patience,
  };
  state.orders.push(order);
  if (state.selectedOrderNumber === null) state.selectedOrderNumber = order.number;
  return order;
}

export function expireOrders(state, deltaSeconds) {
  const expired = [];
  for (const order of state.orders) {
    order.patienceLeft -= deltaSeconds;
    if (order.patienceLeft <= 0) expired.push(order);
  }
  for (const order of expired) {
    removeOrder(state, order.number);
    state.ordersMissed += 1;
    state.combo = 0;
    state.flashMessage = `Order #${order.number} kabur! Pelanggan menunggu terlalu lama.`;
    state.flashSeconds = 2.2;
  }
  return expired;
}

export function removeOrder(state, orderNumber) {
  state.orders = state.orders.filter((order) => order.number !== orderNumber);
  if (state.selectedOrderNumber === orderNumber) {
    state.selectedOrderNumber = state.orders.length ? state.orders[0].number : null;
  }
}

export function selectedOrder(state) {
  return state.orders.find((order) => order.number === state.selectedOrderNumber) || null;
}

export function selectNextOrder(state) {
  if (!state.orders.length) return null;
  const index = state.orders.findIndex((order) => order.number === state.selectedOrderNumber);
  const next = state.orders[(index + 1) % state.orders.length];
  state.selectedOrderNumber = next.number;
  return next;
}

export function scoreServedOrder(state, order) {
  const patienceBonus = Math.round((order.patienceLeft / order.patienceTotal) * 40);
  state.combo += 1;
  const comboBonus = Math.min(state.combo - 1, 5) * 10;
  const earned = order.price + patienceBonus + comboBonus;
  state.score += earned;
  state.coins += earned;
  state.ordersServed += 1;
  state.flashMessage = `Order #${order.number} tersaji! +${earned} poin (combo x${state.combo})`;
  state.flashSeconds = 2.2;
  return earned;
}
