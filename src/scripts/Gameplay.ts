import type P5 from "react-p5/node_modules/@types/p5/index.d.ts"
import type { PlayerId } from "rune-sdk"
import GameClient from "./GameClient"
import { GameState } from "../logic"
import Render from "./Render"

interface LocalCard {
  id: number
  position: null | [number, number]
}

export default class Gameplay {
  gc: GameClient
  gs!: GameState // synchronized game state across server and all players
  render!: Render

  isSpectator: boolean
  viewingPlayer!: PlayerId
  phase: "SCORING" | "GET" | "PLAY" | "READY"

  localCards: null | [LocalCard, LocalCard]
  hasRerolled: boolean
  hasTakenCards: boolean

  /// ready phase: no render local card if already there

  constructor(gameClient: GameClient) {
    this.isSpectator = false
    this.gc = gameClient
    this.phase = "READY"
    this.localCards = null
    this.hasRerolled = false
    this.hasTakenCards = false
  }

  startScoringPhase() {
    // skip scoring phase on 1st round
    if (this.gs.round === 1) {
      this.startGetPhase()
      return
    }
    this.phase = "SCORING"
  }

  startGetPhase() {
    this.localCards = null
    this.hasRerolled = false
    this.hasTakenCards = false

    // last round? show result popup
    if (this.gs.round > 5) {
      this.phase = "READY"
      Rune.showGameOverPopUp()
      return
    }

    // spectator skips this phase
    if (this.isSpectator) {
      this.phase = "READY"
      return
    }

    this.phase = "GET"
  }
}
