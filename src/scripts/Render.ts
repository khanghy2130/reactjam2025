import type P5 from "react-p5/node_modules/@types/p5/index.d.ts"
import GameClient from "./GameClient"

export default class Render {
  gameClient: GameClient

  constructor(gameClient: GameClient) {
    this.gameClient = gameClient
  }
}
