// renderKitchen.js — draws the whole kitchen on one canvas screen: the order
// board on the left, the ingredient counter along the bottom, the assembly
// plate and stove in the middle, the serving counter with ready plates on the
// right, and the shift timer + score across the top. Big labels, big shapes:
// every screenshot must read clearly even when shrunk to a thumbnail.

import { INGREDIENTS, ingredientById } from './recipes.js';
import { rushLevelForElapsed } from './kitchenState.js';

export const VIEW_WIDTH = 1280;
export const VIEW_HEIGHT = 720;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function drawText(ctx, text, x, y, size, color, align = 'left', weight = '700') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

export function drawIngredientChip(ctx, ingredient, x, y, size) {
  ctx.fillStyle = ingredient.color;
  roundRect(ctx, x, y, size, size, 14); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.beginPath(); ctx.arc(x + size / 2, y + size / 2, size * 0.26, 0, Math.PI * 2); ctx.fill();
  drawText(ctx, ingredient.name, x + size / 2, y + size + 16, 17, '#fff7e6', 'center', '800');
}

export function drawOrderBoard(ctx, state) {
  ctx.fillStyle = '#3b2314';
  roundRect(ctx, 18, 86, 330, 470, 18); ctx.fill();
  ctx.strokeStyle = '#ffb703'; ctx.lineWidth = 4; ctx.stroke();
  drawText(ctx, '📋 PAPAN ORDER', 183, 116, 27, '#ffd166', 'center', '900');
  if (!state.orders.length) {
    drawText(ctx, 'Menunggu pelanggan…', 183, 300, 21, '#ffe8a3', 'center');
  }
  state.orders.slice(0, 3).forEach((order, i) => {
    const y = 140 + i * 138;
    const selected = order.number === state.selectedOrderNumber;
    ctx.fillStyle = selected ? '#fff3d6' : '#e9dcc3';
    roundRect(ctx, 34, y, 298, 126, 12); ctx.fill();
    if (selected) { ctx.strokeStyle = '#d62828'; ctx.lineWidth = 5; ctx.stroke(); }
    drawText(ctx, `#${order.number} ${order.recipeName}`, 48, y + 24, 19, '#3b2314', 'left', '900');
    const names = order.ingredients.map((id) => ingredientById(id).name).join(' + ');
    drawText(ctx, names, 48, y + 52, 16, '#6b4226', 'left', '700');
    drawText(ctx, `${order.price} poin`, 48, y + 78, 16, '#2a7d4f', 'left', '800');
    const ratio = Math.max(0, order.patienceLeft / order.patienceTotal);
    ctx.fillStyle = '#d8c9a3'; roundRect(ctx, 48, y + 96, 200, 14, 7); ctx.fill();
    ctx.fillStyle = ratio > 0.45 ? '#43aa8b' : ratio > 0.22 ? '#f2c14e' : '#d62828';
    roundRect(ctx, 48, y + 96, Math.max(10, 200 * ratio), 14, 7); ctx.fill();
    drawText(ctx, `${Math.ceil(order.patienceLeft)}s`, 262, y + 103, 17, '#3b2314', 'left', '900');
  });
}

export function drawAssemblyAndStove(ctx, state) {
  // Assembly plate (centre)
  ctx.fillStyle = '#5b3a1e';
  roundRect(ctx, 366, 86, 380, 300, 18); ctx.fill();
  drawText(ctx, '🍽️ PIRING PERAKITAN', 556, 116, 25, '#ffd166', 'center', '900');
  ctx.fillStyle = '#fdf6e3';
  ctx.beginPath(); ctx.ellipse(556, 248, 128, 82, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#c9b48a'; ctx.lineWidth = 5; ctx.stroke();
  state.plate.forEach((id, i) => {
    const ing = ingredientById(id);
    const x = 472 + (i % 2) * 92;
    const y = 196 + Math.floor(i / 2) * 62;
    ctx.fillStyle = ing.color;
    ctx.beginPath(); ctx.arc(x + 34, y + 22, 26, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 3; ctx.stroke();
    drawText(ctx, ing.name, x + 34, y + 22, 14, '#2b1a08', 'center', '900');
  });
  if (!state.plate.length) drawText(ctx, 'klik bahan di bawah…', 556, 248, 19, '#8a6d3b', 'center');
  // Stove
  ctx.fillStyle = '#22223b';
  roundRect(ctx, 366, 402, 380, 154, 18); ctx.fill();
  drawText(ctx, '🔥 KOMPOR', 400, 432, 24, '#ff9e5e', 'left', '900');
  ctx.fillStyle = '#4a4e69';
  ctx.beginPath(); ctx.ellipse(486, 492, 62, 30, 0, 0, Math.PI * 2); ctx.fill();
  if (state.cooking.active) {
    ctx.fillStyle = '#ff7b33';
    ctx.beginPath(); ctx.ellipse(486, 486, 44, 20, 0, 0, Math.PI * 2); ctx.fill();
    const ratio = state.cooking.progress / state.cooking.duration;
    ctx.fillStyle = '#3a3a5e'; roundRect(ctx, 566, 470, 160, 22, 11); ctx.fill();
    ctx.fillStyle = '#ffb703'; roundRect(ctx, 566, 470, 160 * ratio, 22, 11); ctx.fill();
    drawText(ctx, 'MEMASAK…', 646, 522, 19, '#ffd166', 'center', '900');
  } else {
    drawText(ctx, state.plate.length ? 'tekan MASAK (C)' : 'wajan siap', 646, 492, 19, '#cfd2ff', 'center', '800');
  }
}

export function drawServingCounter(ctx, state) {
  ctx.fillStyle = '#274156';
  roundRect(ctx, 764, 86, 498, 300, 18); ctx.fill();
  drawText(ctx, '⭐ MEJA SAJI — PIRING SIAP SAJI', 1013, 116, 24, '#a8e063', 'center', '900');
  if (!state.readyPlates.length) {
    drawText(ctx, 'Belum ada piring matang.', 1013, 220, 21, '#dbeafe', 'center');
    drawText(ctx, 'Selesaikan satu hidangan!', 1013, 254, 19, '#93c5fd', 'center');
  }
  state.readyPlates.slice(0, 2).forEach((plate, i) => {
    const x = 792 + i * 244;
    ctx.fillStyle = '#fdf6e3';
    ctx.beginPath(); ctx.ellipse(x + 110, 226, 96, 66, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#56cc71'; ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = '#e07a5f';
    ctx.beginPath(); ctx.ellipse(x + 110, 220, 58, 36, 0, 0, Math.PI * 2); ctx.fill();
    drawText(ctx, plate.recipeName, x + 110, 318, 17, '#ffffff', 'center', '900');
    drawText(ctx, `untuk order #${plate.orderNumber}`, x + 110, 342, 15, '#a8e063', 'center', '700');
  });
  // Action buttons row
  const buttons = [
    { label: '🔥 MASAK  (C)', color: '#d62828' },
    { label: '⭐ SAJIKAN  (S)', color: '#2a7d4f' },
    { label: '🗑️ BUANG  (T)', color: '#6c757d' },
  ];
  buttons.forEach((button, i) => {
    const x = 764 + i * 168;
    ctx.fillStyle = button.color;
    roundRect(ctx, x, 402, 156, 66, 14); ctx.fill();
    drawText(ctx, button.label, x + 78, 436, 17, '#ffffff', 'center', '900');
  });
  drawText(ctx, 'Ganti order: TAB • Bahan: klik / tombol 1-0', 1013, 506, 17, '#dbeafe', 'center', '700');
  drawText(ctx, `Rush Level ${rushLevelForElapsed(state.elapsed)} — order makin cepat datang!`, 1013, 534, 16, '#ffd166', 'center', '800');
}

export function drawIngredientCounter(ctx, state) {
  ctx.fillStyle = '#6f4518';
  roundRect(ctx, 18, 572, 1244, 130, 18); ctx.fill();
  drawText(ctx, 'MEJA BAHAN:', 40, 596, 19, '#ffd166', 'left', '900');
  INGREDIENTS.forEach((ingredient, i) => {
    const x = 36 + i * 122;
    drawIngredientChip(ctx, ingredient, x, 610, 52);
    drawText(ctx, `[${ingredient.key}]`, x + 26, 692, 14, '#ffe8a3', 'center', '800');
  });
}

export function drawTopBar(ctx, state) {
  ctx.fillStyle = '#1d1207';
  ctx.fillRect(0, 0, VIEW_WIDTH, 72);
  drawText(ctx, '🍳 DAPUR NUSANTARA RUSH', 24, 37, 30, '#ffd166', 'left', '900');
  const ratio = Math.max(0, state.shiftLeft / state.shiftTotal);
  ctx.fillStyle = '#3a2c18'; roundRect(ctx, 520, 22, 300, 28, 14); ctx.fill();
  ctx.fillStyle = ratio > 0.3 ? '#43aa8b' : '#d62828';
  roundRect(ctx, 520, 22, 300 * ratio, 28, 14); ctx.fill();
  drawText(ctx, `⏱️ SISA SHIFT ${Math.ceil(state.shiftLeft)}s`, 670, 37, 19, '#ffffff', 'center', '900');
  drawText(ctx, `SKOR ${state.score}`, 880, 37, 24, '#a8e063', 'left', '900');
  drawText(ctx, `COMBO x${Math.max(1, state.combo)}`, 1090, 37, 21, '#ffb703', 'left', '900');
}

export function drawKitchenScene(ctx, state) {
  ctx.fillStyle = '#2e1a0c';
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(0, 72, VIEW_WIDTH, 500);
  drawTopBar(ctx, state);
  drawOrderBoard(ctx, state);
  drawAssemblyAndStove(ctx, state);
  drawServingCounter(ctx, state);
  drawIngredientCounter(ctx, state);
  if (state.flashSeconds > 0 && state.flashMessage) {
    ctx.fillStyle = 'rgba(20,10,2,0.92)';
    roundRect(ctx, 190, 554, 900, 36, 12); ctx.fill();
    drawText(ctx, state.flashMessage, 640, 573, 16, '#ffe8a3', 'center', '800');
  }
  if (state.phase === 'title') {
    ctx.fillStyle = 'rgba(15,8,2,0.82)';
    ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    drawText(ctx, '🍳 DAPUR NUSANTARA RUSH', 640, 250, 54, '#ffd166', 'center', '900');
    drawText(ctx, 'Rakit hidangan sesuai papan order, masak di kompor, sajikan sebelum pelanggan kabur!', 640, 320, 22, '#ffffff', 'center', '700');
    drawText(ctx, 'Klik bahan / tombol 1-0 • C masak • S sajikan • T buang • TAB ganti order', 640, 362, 20, '#a8e063', 'center', '700');
    ctx.fillStyle = '#d62828'; roundRect(ctx, 490, 410, 300, 72, 16); ctx.fill();
    drawText(ctx, '▶  MULAI SHIFT', 640, 447, 28, '#ffffff', 'center', '900');
  }
  if (state.phase === 'over') {
    ctx.fillStyle = 'rgba(15,8,2,0.85)';
    ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    drawText(ctx, 'SHIFT SELESAI!', 640, 240, 52, '#ffd166', 'center', '900');
    drawText(ctx, `Skor akhir: ${state.score} • Tersaji: ${state.ordersServed} • Kabur: ${state.ordersMissed}`, 640, 316, 24, '#ffffff', 'center', '800');
    drawText(ctx, 'Tekan R untuk shift baru', 640, 372, 22, '#a8e063', 'center', '700');
  }
}
