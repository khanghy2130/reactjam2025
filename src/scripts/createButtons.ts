import type P5 from "react-p5/node_modules/@types/p5/index.d.ts"
import Gameplay from "./Gameplay"
import Render from "./Render"
import Button from "./Button"
import GameClient from "./GameClient"

export default function createButtons(
  gc: GameClient,
  p5: P5,
  gameplay: Gameplay,
  render: Render
) {
  // dummy button
  render.buttons = {
    getAnimalsButton: new Button(
      [250, 300, 200, 100],
      p5.color(65, 148, 59),
      function () {
        p5.fill(255, 255, 255)
        p5.stroke(0)
        p5.strokeWeight(10)
        p5.textSize(30)
        p5.text(gc.translatedTexts.short.getanimals, 0, 0)
      },
      function () {
        console.log("click")
      }
    ),
  }
}
