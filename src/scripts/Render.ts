import type P5 from "react-p5/node_modules/@types/p5/index.d.ts"
import GameClient from "./GameClient"
import Gameplay from "./Gameplay"
import Button from "./Button"

export default class Render {
  gc: GameClient
  sheet!: P5.Image
  p5!: P5
  gameplay!: Gameplay

  dummyButton!: Button

  constructor(gameClient: GameClient) {
    this.gc = gameClient
  }

  draw() {
    const p5 = this.p5

    this.dummyButton.render(p5)

    /// p5.image(this.sheet, 250, 350, 150 * 2, 200 * 2, 0, 0, 150, 200)
  }

  click() {
    const mx = this.gc.mx
    const my = this.gc.my

    /// button...
    /// start dragging card... (check when gc.isPressing = false to release)

    if (this.dummyButton.checkHover(mx, my)) {
      this.dummyButton.clicked()
    }
  }
}
