import type P5 from "react-p5/node_modules/@types/p5/index.d.ts"
import GameClient from "./GameClient"
import Gameplay from "./Gameplay"
import Button from "./Button"

interface Buttons {
  openShop: Button
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

    const shop = gp.shop

    /// temporary bg
    p5.background(255, 255, 255, 50)

    // render open shop button if no cards taken yet
    if (!shop.hasTaken) {
      this.buttons.openShop.render(p5)

      if (shop.isOpened) {
        // update open ap
        shop.openAP = Math.min(1, shop.openAP + 0.005)
        p5.noStroke()
        p5.fill(0, Math.min(200, shop.openAP * 4 * 200)) // ap * faster factor * max opacity
        const h = (p5.height / p5.width) * 500
        p5.rect(250, h / 2, 500, h)
      }
      // shop closed? update hint countdown
      else {
        if (shop.openBtnHintCountdown <= 0) {
          this.buttons.openShop.ap = 0
          shop.openBtnHintCountdown = 200
        } else shop.openBtnHintCountdown--
      }
    }

    /// p5.image(this.sheet, 250, 350, 150 * 2, 200 * 2, 0, 0, 150, 200)
  }

  click() {
    /// if viewing card then exit

    const mx = this.gc.mx
    const my = this.gc.my

    // open shop button
    if (
      !this.gameplay.shop.isOpened &&
      this.buttons.openShop.checkHover(mx, my)
    ) {
      this.buttons.openShop.clicked()
    }
  }
}
