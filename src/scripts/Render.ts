import type P5 from "react-p5/node_modules/@types/p5/index.d.ts"
import GameClient from "./GameClient"
import Gameplay from "./Gameplay"
import Button from "./Button"

interface Buttons {
  getAnimalsButton: Button
}

export default class Render {
  gc: GameClient
  sheet!: P5.Image
  p5!: P5
  gameplay!: Gameplay

  buttons!: Buttons

  constructor(gameClient: GameClient) {
    this.gc = gameClient
  }

  draw() {
    const p5 = this.p5
    const gp = this.gameplay

    // render get-animals button if !hasTakenCards
    if (!gp.hasTakenCards) {
      ///
    }

    this.buttons.getAnimalsButton.render(p5)

    /// p5.image(this.sheet, 250, 350, 150 * 2, 200 * 2, 0, 0, 150, 200)
  }

  click() {
    const mx = this.gc.mx
    const my = this.gc.my

    /// button...
    /// start dragging card... (check when gc.isPressing = false to release)

    if (this.buttons.getAnimalsButton.checkHover(mx, my)) {
      this.buttons.getAnimalsButton.clicked()
    }
  }
}
