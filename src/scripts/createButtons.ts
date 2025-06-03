import type P5 from "react-p5/node_modules/@types/p5/index.d.ts"
import Gameplay from "./Gameplay"
import Render from "./Render"
import Button from "./Button"
import GameClient from "./GameClient"
import { Language, translations } from "./locales"

const createButtons = (
  gc: GameClient,
  p5: P5,
  gameplay: Gameplay,
  render: Render
) => {
  const shop = gameplay.shop

  // add lang option buttons
  let langOpX = 0
  let langOpY = 0
  for (const langCode in translations) {
    const langObj = translations[langCode as Language]
    gameplay.langModal.optionButtons.push(
      new Button(
        [langOpX === 0 ? 140 : 360, 250 + 105 * langOpY, 180, 60],
        p5.color(180),
        p5,
        render,
        function () {
          p5.fill(255)
          p5.stroke(0)
          p5.strokeWeight(8)
          p5.textSize(28)
          p5.text(langObj.langname, 0, -5)
        },
        function () {
          gc.translatedTexts = langObj
          gameplay.langModal.isOpened = false
          Rune.actions.setLang(langCode as Language)
        }
      )
    )
    langOpX++
    if (langOpX > 1) {
      langOpX = 0
      langOpY++
    }
  }

  render.buttons = {
    openShop: new Button(
      [250, 805, 400, 70],
      p5.color(65, 150, 60),
      p5,
      render,
      function () {
        p5.fill(255)
        p5.stroke(0)
        p5.strokeWeight(8)
        p5.textSize(36)
        p5.text(gc.translatedTexts.short.getanimals, 0, -8)
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
      p5,
      render,
      function () {
        p5.fill(255)
        p5.stroke(0)
        p5.strokeWeight(8)
        p5.textSize(36)
        p5.text(gc.translatedTexts.short.acceeptcards, 0, -8)
      },
      function () {
        shop.isOpened = false
        gameplay.phase = "PLAY"
        gameplay.localCards = [
          {
            card: shop.availableCards![0],
            placedPos: null,
            x: 140,
            y: shop.holdersY.DEFAULT,
            s: 1.5,
            isDragging: false,
          },
          {
            card: shop.availableCards![1],
            placedPos: null,
            x: 360,
            y: shop.holdersY.DEFAULT,
            s: 1.5,
            isDragging: false,
          },
        ]
      }
    ),
    closeShop: new Button(
      [430, 70, 70, 50],
      p5.color(240, 70, 60),
      p5,
      render,
      function () {
        p5.fill(255)
        p5.noStroke()
        p5.textSize(30)
        p5.text("X", 0, -6)
      },
      function () {
        // closing ending?
        if (gameplay.endingControl.isOpened) {
          gameplay.endingControl.isOpened = false
          Rune.showGameOverPopUp()
          return
        }

        if (gameplay.wheelModalIsOpened) {
          return (gameplay.wheelModalIsOpened = false)
        }

        shop.isOpened = false
        render.buttons.closeShop.ap = 1
      }
    ),
    rerollEle: new Button(
      [250, 500, 300, 50],
      p5.color(65, 150, 60),
      p5,
      render,
      function () {
        p5.fill(255)
        p5.stroke(0)
        p5.strokeWeight(6)
        p5.textSize(24)
        p5.text(gc.translatedTexts.short.changeelement, 0, -6)
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
      p5,
      render,
      function () {
        p5.fill(255)
        p5.stroke(0)
        p5.strokeWeight(6)
        p5.textSize(24)
        p5.text(gc.translatedTexts.short.changetype, 0, -6)
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
      p5,
      render,
      function () {
        p5.fill(255)
        p5.stroke(0)
        p5.strokeWeight(8)
        p5.textSize(28)
        p5.text(gc.translatedTexts.short.yes, 0, -8)
      },
      function () {
        const thisPlayer = gameplay.gs!.players.find(
          (p) => p.id === gameplay.myPlayerId
        )
        if (!thisPlayer) throw "Can't find this player data"

        render.buttons.rerollYes.ap = 1
        render.buttons.acceptCards.ap = 0
        shop.menuType = "DEFAULT"
        shop.holdersY.start = shop.holdersY.AFTER_REROLL
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
      p5,
      render,
      function () {
        p5.fill(255)
        p5.stroke(0)
        p5.strokeWeight(8)
        p5.textSize(28)
        p5.text(gc.translatedTexts.short.no, 0, -8)
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

    undo: new Button(
      [120, 805, 140, 60],
      p5.color(240, 70, 50),
      p5,
      render,
      function () {
        p5.fill(255)
        p5.stroke(0)
        p5.strokeWeight(6)
        p5.textSize(24)
        p5.text(gc.translatedTexts.short.undo, 0, -3)
      },
      function () {
        gameplay.undo()
      }
    ),
    ready: new Button(
      [350, 805, 200, 60],
      p5.color(65, 150, 60),
      p5,
      render,
      function () {
        p5.fill(255)
        p5.stroke(0)
        p5.strokeWeight(6)
        p5.textSize(32)
        p5.text(gc.translatedTexts.short.ready, 0, -8)
      },
      function () {
        gameplay.phase = "READY"
        Rune.actions.becomeReady({
          collection: gameplay.localDisplay.collection,
          playedPositions: gameplay.playedPositions,
        })
      }
    ),

    goBack: new Button(
      [130, 805, 170, 60],
      p5.color(65, 150, 60),
      p5,
      render,
      function () {
        p5.fill(255)
        p5.stroke(0)
        p5.strokeWeight(6)
        p5.textSize(26)
        p5.text(gc.translatedTexts.short.goback, 0, -5)
      },
      function () {
        if (gameplay.myPlayerId) gameplay.setViewingPlayer(gameplay.myPlayerId)
      }
    ),
  }
}

export default createButtons
