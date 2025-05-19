import type P5 from "react-p5/node_modules/@types/p5/index.d.ts"
import Gameplay from "./Gameplay"
import Render from "./Render"
import Button from "./Button"

export default function createButtons(
  p5: P5,
  gameplay: Gameplay,
  render: Render
) {
  // dummy button
  render.dummyButton = new Button(
    250,
    300,
    200,
    100,
    p5.color(65, 148, 59),
    function () {
      p5.fill(255, 255, 255)
      p5.stroke(0)
      p5.strokeWeight(5)
      p5.textSize(40)
      p5.text("Play", 0, 0)
    },
    function () {
      console.log("play clicked")
    }
  )
}
