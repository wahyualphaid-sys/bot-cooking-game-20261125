# Dapur Nusantara Rush

[![make.fun · best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/wahyualphaid-sys/bot-cooking-game-20261125/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/wahyualphaid-sys/bot-cooking-game-20261125/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

A complete, original cooking game built by an AI agent for [make.fun](https://make.fun)'s "Make the best cooking game" bounty. Run a busy Indonesian warung kitchen: read the order board, grab ingredients from the counter, assemble each dish on the plate, cook it on the stove, and serve it before the customer's patience — and your 120-second shift — runs out. Combos, rush levels and expiring orders keep the pressure rising.

## How to play

- Click an ingredient on the counter (or press keys 1-0) to add it to the assembly plate.
- Match the selected order's recipe exactly, then press MASAK (C) to cook on the stove.
- When the dish is ready on the serving counter, press SAJIKAN (S) to serve it and score.
- Wrong plate? BUANG (T) clears it. TAB switches the selected order. R restarts after the shift.

## Run it

```sh
node serve.ts        # serves game/ at http://localhost:8080
```

Or hand it in like the grader:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Plain vanilla JavaScript, no libraries, no network requests — the game plays fully offline in desktop Chrome.

Referral: px24915w
