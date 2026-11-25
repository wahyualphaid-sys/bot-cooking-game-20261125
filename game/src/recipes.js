// recipes.js — the menu of Dapur Nusantara Rush: original dishes, their ingredient
// lists, cook times, prices and the ingredient catalogue shown on the counter.
// Every dish is an original warung-style creation invented for this game.

export const INGREDIENTS = [
  { id: 'rice',    name: 'Nasi',      color: '#f5f0dc', key: '1' },
  { id: 'noodle',  name: 'Mie',       color: '#f2c14e', key: '2' },
  { id: 'egg',     name: 'Telur',     color: '#ffb703', key: '3' },
  { id: 'chicken', name: 'Ayam',      color: '#e07a5f', key: '4' },
  { id: 'chili',   name: 'Cabai',     color: '#d62828', key: '5' },
  { id: 'shallot', name: 'Bawang',    color: '#b565a7', key: '6' },
  { id: 'tomato',  name: 'Tomat',     color: '#ef476f', key: '7' },
  { id: 'greens',  name: 'Sayur',     color: '#43aa8b', key: '8' },
  { id: 'peanut',  name: 'Kacang',    color: '#bc6c25', key: '9' },
  { id: 'tofu',    name: 'Tahu',      color: '#ffe8a3', key: '0' },
];

export const RECIPES = [
  { id: 'nasgor',  name: 'Nasi Goreng Kampung', ingredients: ['rice', 'egg', 'chili', 'shallot'], cookSeconds: 3.0, price: 120, patience: 48 },
  { id: 'miegor',  name: 'Mie Goreng Tek-Tek',  ingredients: ['noodle', 'egg', 'greens', 'shallot'], cookSeconds: 3.0, price: 110, patience: 46 },
  { id: 'soto',    name: 'Soto Ayam Lamongan',  ingredients: ['chicken', 'rice', 'greens', 'tomato'], cookSeconds: 3.6, price: 140, patience: 52 },
  { id: 'gado',    name: 'Gado-Gado Betawi',    ingredients: ['greens', 'tofu', 'peanut', 'egg'], cookSeconds: 2.4, price: 100, patience: 44 },
  { id: 'ayamgeo', name: 'Ayam Geprek Sambal',  ingredients: ['chicken', 'chili', 'rice', 'tomato'], cookSeconds: 3.4, price: 135, patience: 50 },
  { id: 'tahucris',name: 'Tahu Crispy Balado',  ingredients: ['tofu', 'chili', 'shallot', 'peanut'], cookSeconds: 2.6, price: 95,  patience: 42 },
];

export function ingredientById(id) {
  return INGREDIENTS.find((item) => item.id === id);
}

export function recipeById(id) {
  return RECIPES.find((item) => item.id === id);
}

export function recipeNeedsIngredient(recipe, ingredientId) {
  return recipe.ingredients.includes(ingredientId);
}

export function countOnPlate(plateIngredientIds, ingredientId) {
  return plateIngredientIds.filter((id) => id === ingredientId).length;
}
