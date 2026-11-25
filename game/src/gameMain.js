// gameMain.js — boots Dapur Nusantara Rush: creates the kitchen state, spawns
// the first customers, runs the per-frame loop (order spawning, patience and
// shift timers, stove progress) and repaints the kitchen canvas.

import { createKitchenState, resetKitchen, spawnIntervalForElapsed } from './kitchenState.js';
import { spawnOrder, expireOrders } from './orders.js';
import { updateCooking } from './cooking.js';
import { drawKitchenScene } from './renderKitchen.js';
import { bindMouseAndKeyboard } from './inputHandlers.js';
import { applyScreenshotScene, screenshotShotFromLocation } from './screenshotModes.js';
import { playMissSound } from './soundEffects.js';

export function createSeededRandom(seed) {
  let value = seed >>> 0;
  return function nextRandom() {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export function stepKitchenSimulation(state, deltaSeconds, random) {
  if (state.phase !== 'playing') return;
  state.elapsed += deltaSeconds;
  state.shiftLeft -= deltaSeconds;
  state.flashSeconds = Math.max(0, state.flashSeconds - deltaSeconds);
  if (state.shiftLeft <= 0) { state.phase = 'over'; state.shiftLeft = 0; return; }
  state.spawnTimer -= deltaSeconds;
  if (state.spawnTimer <= 0 && state.orders.length < 3) {
    spawnOrder(state, random());
    state.spawnTimer = spawnIntervalForElapsed(state.elapsed);
  }
  const expired = expireOrders(state, deltaSeconds);
  if (expired.length) playMissSound();
  updateCooking(state, deltaSeconds);
}

export function bootKitchenGame() {
  const canvas = document.getElementById('kitchenCanvas');
  const ctx = canvas.getContext('2d');
  const state = createKitchenState();
  const params = new URLSearchParams(window.location.search);
  const seed = Number(params.get('seed') || 7);
  const random = createSeededRandom(seed);
  const shot = screenshotShotFromLocation();
  if (shot) {
    applyScreenshotScene(state, shot);
  } else {
    state.phase = 'title';
  }
  bindMouseAndKeyboard(canvas, state);
  let lastTime = performance.now();
  function frame(now) {
    const deltaSeconds = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    if (!shot) stepKitchenSimulation(state, deltaSeconds, random);
    drawKitchenScene(ctx, state);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  return { state, resetKitchen };
}

bootKitchenGame();
