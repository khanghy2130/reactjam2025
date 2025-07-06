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

        // closing wheel?
        if (gameplay.wheelModalIsOpened) {
          gameplay.wheelModalIsOpened = false
          return
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
        rp.showingIndex = 0
        const yinCard = shop.availableCards![1]
        rp.yinPool = shop.yinPool.filter(
          (card) => card.animal === yinCard.animal && card !== yinCard
        )
        const yangCard = shop.availableCards![0]
        rp.yangPool = shop.yangPool.filter(
          (card) => card.animal === yangCard.animal && card !== yangCard
        )
        if (rp.yangPool.length !== 3 || rp.yinPool.length !== 3) {
          throw "reroll pool size isn't 3"
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
        rp.showingIndex = 0
        const yinCard = shop.availableCards![1]
        rp.yinPool = shop.yinPool.filter(
          (card) => card.ele === yinCard.ele && card !== yinCard
        )
        const yangCard = shop.availableCards![0]
        rp.yangPool = shop.yangPool.filter(
          (card) => card.ele === yangCard.ele && card !== yangCard
        )
        if (rp.yangPool.length !== 3 || rp.yinPool.length !== 3) {
          throw "reroll pool size isn't 3"
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

    shareImage: new Button(
      [250, 805, 200, 70],
      p5.color(65, 150, 60),
      p5,
      render,
      function () {
        p5.fill(255)
        p5.stroke(0)
        p5.strokeWeight(8)
        p5.textSize(36)
        p5.text(gc.translatedTexts.short.share, 0, -8)
      },
      function () {
        if (!gameplay.myPlayerId || !gameplay.gs) return
        // take screenshot
        const screenshot = p5.get(0, 0, p5.width, p5.width * 1.7) // HEIGHT RATIO
        p5.image(render.shareAssets.bgImage, 250, 425, 500, 850)
        p5.image(screenshot, 250, 425, 500, 850)

        p5.noStroke()
        p5.fill(100, 17, 157)
        p5.rect(250, 815, 500, 120)
        p5.image(render.shareAssets.runeImage, 90, 802, 150, 45)
        render.renderYang(330, 803, 35)
        render.renderYin(330, 803, 35)
        p5.push()
        p5.translate(455, 800)
        p5.rotate(-20)
        p5.image(render.playersInfo[gameplay.myPlayerId].avatar, 0, 0, 135, 135)
        p5.stroke(0)
        p5.strokeWeight(10)
        p5.fill(65, 200, 60)
        p5.textSize(46)
        const playerState = gameplay.gs.players.find(
          (p) => p.id === gameplay.myPlayerId
        )!
        p5.text(p5.min(playerState.yangPts, playerState.yinPts), -175, -70)
        p5.pop()

        Rune.showShareImage(
          // @ts-ignore
          p5.get(0, 0, p5.width, p5.width * 1.7).canvas.toDataURL()
        )

        p5.clear(0, 0, 0, 0)
        p5.image(screenshot, 250, 425, 500, 850)
      }
    ),
  }
}

export default createButtons
