import type P5 from "react-p5/node_modules/@types/p5/index.d.ts"
import GameClient from "./GameClient"

export default class Render {
  gameClient: GameClient

  constructor(gameClient: GameClient) {
    this.gameClient = gameClient
  }

  drawSquare(p5: P5) {
    p5.circle(this.gameClient.myVar, 0, 0.2 * p5.width)
  }
}
