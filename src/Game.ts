// ── Game State Manager ─────────────────────────────────────────────
// Manages scene transitions, score, and round state.

import { Application, Container } from 'pixi.js';
import { Animal, getRandomAnimals } from './data/animals';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { ResultScene } from './scenes/ResultScene';

export type SceneName = 'menu' | 'game' | 'result';

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
  private sceneContainer: Container;

  state: GameState = {
    score: 0,
    streak: 0,
    round: 0,
    totalRounds: 5,
    animals: [],
    currentAnimalIndex: 0,
    lastWasCorrect: false,
    pointsEarned: 0,
  };

  constructor(app: Application) {
    this.app = app;
    this.sceneContainer = new Container();
    this.app.stage.addChild(this.sceneContainer);
  }

  startNewGame(): void {
    this.state = {
      score: 0,
      streak: 0,
      round: 0,
      totalRounds: 5,
      animals: getRandomAnimals(5),
      currentAnimalIndex: 0,
      lastWasCorrect: false,
      pointsEarned: 0,
    };
    this.goTo('game');
  }

  nextRound(): void {
    this.state.currentAnimalIndex++;
    this.state.round++;

    if (this.state.currentAnimalIndex >= this.state.animals.length) {
      this.goTo('result');
    } else {
      this.goTo('game');
    }
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

  goTo(scene: SceneName): void {
    // Destroy previous scene
    if (this.currentScene) {
      this.sceneContainer.removeChild(this.currentScene);
      this.currentScene.destroy({ children: true });
    }

    // Create new scene
    let next: Container;
    switch (scene) {
      case 'menu':
        next = new MenuScene(this);
        break;
      case 'game':
        next = new GameScene(this);
        break;
      case 'result':
        next = new ResultScene(this);
        break;
    }

    this.currentScene = next;
    this.sceneContainer.addChild(next);
  }
}
