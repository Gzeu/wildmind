// ── Game State Manager ─────────────────────────────────────────────
// Manages scene transitions, score, and round state.

import { Application, Container } from 'pixi.js';
import { Animal, getRandomAnimals } from './data/animals';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { ResultScene } from './scenes/ResultScene';
import { SceneTransition } from './utils/SceneTransition';

export type SceneName = 'menu' | 'game' | 'result';

export const TOTAL_ROUNDS = 5;

export interface GameState {
  score: number;
  streak: number;
  round: number;
  totalRounds: number;
  animals: Animal[];
  currentAnimalIndex: number;
  lastWasCorrect: boolean;
  pointsEarned: number;
}

export class Game {
  readonly app: Application;
  private currentScene: Container | null = null;
  private currentSceneName: SceneName = 'menu';
  private sceneContainer: Container;
  readonly transition: SceneTransition;

  state: GameState = {
    score: 0,
    streak: 0,
    round: 0,
    totalRounds: TOTAL_ROUNDS,
    animals: [],
    currentAnimalIndex: 0,
    lastWasCorrect: false,
    pointsEarned: 0,
  };

  constructor(app: Application) {
    this.app = app;
    this.sceneContainer = new Container();
    this.app.stage.addChild(this.sceneContainer);
    this.transition = new SceneTransition(app);
  }

  startNewGame(): void {
    this.state = {
      score: 0,
      streak: 0,
      round: 0,
      totalRounds: TOTAL_ROUNDS,
      animals: getRandomAnimals(TOTAL_ROUNDS),
      currentAnimalIndex: 0,
      lastWasCorrect: false,
      pointsEarned: 0,
    };
    this.goTo('game');
  }

  nextRound(): void {
    this.state.currentAnimalIndex++;
    this.state.round++;
    this.goTo(this.state.currentAnimalIndex >= this.state.animals.length ? 'result' : 'game');
  }

  onCorrectGuess(pointsEarned: number): void {
    this.state.score += pointsEarned;
    this.state.streak++;
    this.state.lastWasCorrect = true;
    this.state.pointsEarned = pointsEarned;
  }

  onWrongGuess(): void {
    this.state.streak = 0;
    this.state.lastWasCorrect = false;
    this.state.pointsEarned = 0;
  }

  get currentAnimal(): Animal {
    return this.state.animals[this.state.currentAnimalIndex];
  }

  /** Rebuild the current scene in-place (used on window resize) */
  rebuildCurrentScene(): void {
    this._swapScene(this.currentSceneName);
  }

  goTo(scene: SceneName): void {
    this.transition.crossfade(() => this._swapScene(scene));
  }

  private _swapScene(scene: SceneName): void {
    if (this.currentScene) {
      this.sceneContainer.removeChild(this.currentScene);
      this.currentScene.destroy({ children: true });
    }

    this.currentSceneName = scene;
    let next: Container;
    switch (scene) {
      case 'menu':   next = new MenuScene(this);   break;
      case 'game':   next = new GameScene(this);   break;
      case 'result': next = new ResultScene(this); break;
    }
    this.currentScene = next;
    this.sceneContainer.addChild(next);
  }
}
