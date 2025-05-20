import type P5 from "react-p5/node_modules/@types/p5/index.d.ts"
import Gameplay from "./Gameplay"
import Render from "./Render"
import Button from "./Button"
import GameClient from "./GameClient"

const createButtons = (
  gc: GameClient,
  p5: P5,
  gameplay: Gameplay,
  render: Render
) => {
  render.buttons = {
    openShop: new Button(
      [250, 760, 400, 70],
      p5.color(65, 148, 59),
      function () {
        p5.fill(255, 255, 255)
        p5.stroke(0)
        p5.strokeWeight(8)
        p5.textSize(36)
        p5.text(gc.translatedTexts.short.getanimals, 0, -5)
      },
      function () {
        const shop = gameplay.shop
        shop.openBtnHintCountdown = 200
        shop.isOpened = true
      }
    ),
  }
}

export default createButtons
