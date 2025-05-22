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
      p5.color(65, 150, 60),
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
        render.buttons.acceptCards.ap = 0
        render.buttons.rerollEle.ap = 0
        render.buttons.rerollType.ap = 0
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
    closeShop: new Button(
      [430, 70, 70, 50],
      p5.color(240, 70, 60),
      function () {
        p5.fill(255)
        p5.noStroke()
        p5.textSize(30)
        p5.text("X", 0, -4)
      },
      function () {
        shop.isOpened = false
        render.buttons.closeShop.ap = 1
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
        render.buttons.rerollYes.ap = 0
        render.buttons.rerollNo.ap = 0
        shop.menuType = "CHANGE_ELEMENT"
        shop.holdersY.start = shop.holdersY.end
        shop.holdersY.end = shop.holdersY.REROLL
        shop.holdersY.ap = 0

        const rp = shop.rerollPreviews
        rp.countdown = 29
        const yinCard = shop.availableCards![1]
        rp.yinPool = shop.yinPool.filter(
          (card) => card.animal === yinCard.animal && card !== yinCard
        )
        const yangCard = shop.availableCards![0]
        rp.yangPool = shop.yangPool.filter(
          (card) => card.animal === yangCard.animal && card !== yangCard
        )
        if (rp.yangPool.length !== 2 || rp.yinPool.length !== 2) {
          throw "reroll pool size isn't 2"
        }
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
        render.buttons.rerollYes.ap = 0
        render.buttons.rerollNo.ap = 0
        shop.menuType = "CHANGE_TYPE"
        shop.holdersY.start = shop.holdersY.end
        shop.holdersY.end = shop.holdersY.REROLL
        shop.holdersY.ap = 0

        const rp = shop.rerollPreviews
        rp.countdown = 29
        const yinCard = shop.availableCards![1]
        rp.yinPool = shop.yinPool.filter(
          (card) => card.ele === yinCard.ele && card !== yinCard
        )
        const yangCard = shop.availableCards![0]
        rp.yangPool = shop.yangPool.filter(
          (card) => card.ele === yangCard.ele && card !== yangCard
        )
        if (rp.yangPool.length !== 2 || rp.yinPool.length !== 2) {
          throw "reroll pool size isn't 2"
        }
      }
    ),

    rerollYes: new Button(
      [140, 760, 140, 60],
      p5.color(65, 150, 60),
      function () {
        p5.fill(255, 255, 255)
        p5.stroke(0)
        p5.strokeWeight(8)
        p5.textSize(28)
        p5.text(gc.translatedTexts.short.yes, 0, -5)
      },
      function () {
        const thisPlayer = gameplay.gs.players.find(
          (p) => p.id === gameplay.myPlayerId
        )
        if (!thisPlayer) throw "Can't find this player data"

        render.buttons.rerollYes.ap = 1
        render.buttons.acceptCards.ap = 0
        shop.menuType = "DEFAULT"
        shop.holdersY.start = shop.holdersY.end
        shop.holdersY.end = shop.holdersY.DEFAULT
        shop.holdersY.ap = 0
        shop.flipYangPool = shop.rerollPreviews.yangPool
        shop.flipYinPool = shop.rerollPreviews.yinPool
        shop.hasRerolled = true

        // get new cards (from flip pools as they are just assigned above)
        shop.availableCards = [
          shop.flipYangPool[
            Math.floor(shop.flipYangPool.length * thisPlayer.rng[2])
          ],
          shop.flipYinPool[
            Math.floor(shop.flipYinPool.length * thisPlayer.rng[3])
          ],
        ]

        shop.cardHolders = [
          // first card has less flips
          { flips: 6, ap: 1, card: shop.availableCards[0] },
          { flips: 8, ap: 1, card: shop.availableCards[1] },
        ]
      }
    ),

    rerollNo: new Button(
      [360, 760, 140, 60],
      p5.color(240, 70, 60),
      function () {
        p5.fill(255, 255, 255)
        p5.stroke(0)
        p5.strokeWeight(8)
        p5.textSize(28)
        p5.text(gc.translatedTexts.short.no, 0, -5)
      },
      function () {
        render.buttons.rerollNo.ap = 1
        render.buttons.acceptCards.ap = 0
        render.buttons.rerollEle.ap = 0
        render.buttons.rerollType.ap = 0
        shop.menuType = "DEFAULT"
        shop.holdersY.start = shop.holdersY.end
        shop.holdersY.end = shop.holdersY.DEFAULT
        shop.holdersY.ap = 0
      }
    ),
  }
}

export default createButtons
