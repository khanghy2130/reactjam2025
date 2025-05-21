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
  const shop = gameplay.shop

  render.buttons = {
    openShop: new Button(
      [250, 800, 400, 70],
      p5.color(65, 148, 59),
      function () {
        p5.fill(255, 255, 255)
        p5.stroke(0)
        p5.strokeWeight(8)
        p5.textSize(36)
        p5.text(gc.translatedTexts.short.getanimals, 0, -5)
      },
      function () {
        shop.openBtnHintCountdown = 150
        shop.isOpened = true
      }
    ),

    acceptCards: new Button(
      [250, 760, 400, 70],
      p5.color(65, 150, 60),
      function () {
        p5.fill(255, 255, 255)
        p5.stroke(0)
        p5.strokeWeight(8)
        p5.textSize(36)
        p5.text(gc.translatedTexts.short.acceeptcards, 0, -5)
      },
      function () {
        ///
      }
    ),
    rerollEle: new Button(
      [250, 500, 300, 50],
      p5.color(65, 150, 60),
      function () {
        p5.fill(255)
        p5.stroke(0)
        p5.strokeWeight(6)
        p5.textSize(24)
        p5.text(gc.translatedTexts.short.changeelement, 0, -4)
      },
      function () {
        shop.menuType = "CHANGE_ELEMENT"
        shop.holdersY.start = shop.holdersY.end
        shop.holdersY.end = shop.holdersY.REROLL
        shop.holdersY.ap = 0
      }
    ),
    rerollType: new Button(
      [250, 580, 300, 50],
      p5.color(65, 150, 60),
      function () {
        p5.fill(255)
        p5.stroke(0)
        p5.strokeWeight(6)
        p5.textSize(24)
        p5.text(gc.translatedTexts.short.changetype, 0, -4)
      },
      function () {
        shop.menuType = "CHANGE_TYPE"
        shop.holdersY.start = shop.holdersY.end
        shop.holdersY.end = shop.holdersY.REROLL
        shop.holdersY.ap = 0
      }
    ),
  }
}

export default createButtons
