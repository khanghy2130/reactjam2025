import type P5 from "react-p5/node_modules/@types/p5/index.d.ts"
import GameClient from "./GameClient"

export default class Gameplay {
  gc: GameClient

  round: number
  stage: "GET" | "PLAY" | "READY"

  constructor(gameClient: GameClient) {
    this.gc = gameClient
    this.round = 0
    this.stage = "READY"
  }
}
