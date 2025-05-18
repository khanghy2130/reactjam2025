import type P5 from "react-p5/node_modules/@types/p5/index.d.ts"
import GameClient from "./GameClient"
import Gameplay from "./Gameplay"

export default class Render {
  gc: GameClient
  sheet!: P5.Image

  constructor(gameClient: GameClient) {
    this.gc = gameClient
  }

  draw(p5: P5, gameplay: Gameplay) {
    p5.background(100)

    p5.image(this.sheet, 250, 350, 150 * 2, 200 * 2, 0, 0, 150, 200)

    p5.textSize(100)
    p5.fill(255)
    p5.stroke(0)
    p5.strokeWeight(20)
    p5.text("Hello\nWorld\n1234567890", this.gc.mx, this.gc.my)
  }
}
