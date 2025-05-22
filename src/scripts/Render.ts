import type P5 from "react-p5/node_modules/@types/p5/index.d.ts"
import GameClient from "./GameClient"
import Gameplay from "./Gameplay"
import Button from "./Button"
import { Card } from "./cards"
import { Translation } from "./locales"

interface Buttons {
  openShop: Button
  acceptCards: Button
  closeShop: Button
  rerollEle: Button
  rerollType: Button

  rerollYes: Button
  rerollNo: Button
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
    const buttons = this.buttons
    const tt = this.gc.translatedTexts

    // card: 105 x 140
    //// test layout
    p5.background(0, 100)
    p5.strokeWeight(1)
    p5.stroke(255)
    p5.fill(0)
    const fac = 0.7
    const cw = 150 * fac
    const ch = 200 * fac
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        p5.rect(92.5 + cw * x, 250 + ch * y, cw, ch)
      }
    }

    //// any phase: collection, players, lang menu

    // GET phase
    if (gp.phase === "GET") {
      const shop = gp.shop

      if (shop.isOpened) this.renderShop(p5, gp, tt)
      // shop closed? update hint countdown
      else {
        // render open shop button
        buttons.openShop.render(p5)
        if (shop.openBtnHintCountdown <= 0) {
          buttons.openShop.ap = 0
          shop.openBtnHintCountdown = 120
        } else shop.openBtnHintCountdown--
      }
    } else if (gp.phase === "PLAY") {
      ///
    }

    // card inspection
    if (gp.inspect.isOpened) {
      const ip = gp.inspect
      const { card, ap, ox, oy, os } = ip

      // update opening and closing animation
      if (ip.isOpening) ip.ap = Math.min(1, ip.ap + 0.15)
      else {
        ip.ap = Math.max(0, ip.ap - 0.15)
        if (ip.ap === 0) {
          ip.isOpened = false // done closing
        }
      }

      // render bg
      p5.noStroke()
      const h = (p5.height / p5.width) * 500
      p5.fill(0, 220 * ap)
      p5.rect(250, h / 2, 500, h)

      // render card
      this.renderTransformCard(
        card,
        ox + (250 - ox) * ap,
        oy + (470 - oy) * ap,
        os + (4 - os) * ap,
        os + (4 - os) * ap
      )

      // render full desc
      p5.noStroke()
      p5.fill(255)
      p5.textSize(30)
      p5.text(tt.carddesc[card.id], 250, -100 + 210 * ap)
    }
  }

  renderShop(p5: P5, gp: Gameplay, tt: Translation) {
    const shop = gp.shop
    const buttons = this.buttons

    // shop modal bg
    p5.noStroke()
    p5.fill(0, 200)
    const h = (p5.height / p5.width) * 500
    p5.rect(250, h / 2, 500, h)

    const holder1 = shop.cardHolders![0]
    const holder2 = shop.cardHolders![1]
    const isFlipping = holder2.flips > 0 || holder2.ap > 0.5
    // update flipping
    if (isFlipping) {
      holder1.ap -= holder1.flips * 0.015 + 0.04
      if (holder1.flips > 0) {
        if (holder1.ap <= 0) {
          holder1.flips--
          holder1.ap = 1 + holder1.ap // spillover
          // set random card or real card
          if (holder1.flips > 0) {
            // make sure not repeating the same card
            const prevCard = holder1.card
            while (holder1.card === prevCard) {
              holder1.card =
                shop.flipYangPool[
                  Math.floor(shop.flipYangPool.length * Math.random())
                ]
            }
          } else {
            if (shop.availableCards === null)
              throw "shop has no available cards"
            holder1.card = shop.availableCards[0]
          }
        }
      } else {
        // flips is at 0, showing real card, keep at 0.5
        holder1.ap = Math.max(holder1.ap, 0.5)
      }

      holder2.ap -= holder2.flips * 0.015 + 0.04
      if (holder2.flips > 0) {
        if (holder2.ap <= 0) {
          holder2.flips--
          holder2.ap = 1 + holder2.ap // spillover
          // set random card or real card
          if (holder2.flips > 0) {
            // make sure not repeating the same card
            const prevCard = holder2.card
            while (holder2.card === prevCard) {
              holder2.card =
                shop.flipYinPool[
                  Math.floor(shop.flipYinPool.length * Math.random())
                ]
            }
          } else {
            if (shop.availableCards === null)
              throw "shop has no available cards"
            holder2.card = shop.availableCards[1]
          }
        }
      } else {
        // flips is at 0, showing real card, keep at 0.5
        holder2.ap = Math.max(holder2.ap, 0.5)
      }
    }

    // update holdersY
    if (shop.holdersY.ap < 1) {
      shop.holdersY.ap = Math.min(1, shop.holdersY.ap + 0.07)
    }
    // draw holders
    const realY = p5.map(
      p5.sin(shop.holdersY.ap * 90),
      0,
      1,
      shop.holdersY.start,
      shop.holdersY.end
    )
    const sx1 = (holder1.ap < 0.5 ? holder1.ap : 1 - holder1.ap) * 2
    const sx2 = (holder2.ap < 0.5 ? holder2.ap : 1 - holder2.ap) * 2
    this.renderTransformCard(holder1.card, 140, realY, sx1 * 1.5, 1.5)
    this.renderTransformCard(holder2.card, 360, realY, sx2 * 1.5, 1.5)

    // render other than holders if they are not flipping
    if (!isFlipping) {
      // render condition based on menuType
      if (shop.menuType === "DEFAULT") {
        // render buttons
        buttons.acceptCards.render(p5)

        if (!shop.hasRerolled) {
          buttons.rerollEle.render(p5)
          buttons.rerollType.render(p5)
          buttons.closeShop.render(p5)
        }

        // render inspect hint
        p5.noStroke()
        p5.fill(255)
        p5.textSize(26)
        p5.text(tt.short.clicktoinspect, 140, 80)
        p5.stroke(255)
        p5.strokeWeight(5)
        p5.line(140, 120, 140, 170)
        p5.line(140, 170, 130, 155)
        p5.line(140, 170, 150, 155)
      }
      // reroll menu
      else {
        // render changing arrows
        p5.stroke(240)
        p5.strokeWeight(6)
        p5.line(140, 280, 140, 350)
        p5.line(140, 350, 125, 330)
        p5.line(140, 350, 155, 330)

        p5.line(360, 280, 360, 350)
        p5.line(360, 350, 345, 330)
        p5.line(360, 350, 375, 330)

        const rp = shop.rerollPreviews
        // update changing previews
        if (rp.countdown-- < 0) {
          rp.countdown = 40
          rp.showingIndex = rp.showingIndex === 0 ? 1 : 0
        }
        // render preview cards
        this.renderTransformCard(
          rp.yangPool[rp.showingIndex],
          140,
          shop.holdersY.AFTER_REROLL,
          1.5,
          1.5
        )
        this.renderTransformCard(
          rp.yinPool[rp.showingIndex],
          360,
          shop.holdersY.AFTER_REROLL,
          1.5,
          1.5
        )

        p5.stroke(0)
        p5.strokeWeight(5)
        p5.textSize(28)
        p5.fill(255)
        p5.text(
          shop.menuType === "CHANGE_ELEMENT"
            ? tt.short.changeeleques
            : tt.short.changetypeques,
          250,
          660
        )

        // render button
        buttons.rerollYes.render(p5)
        buttons.rerollNo.render(p5)
      }
    }
  }

  renderTransformCard(
    card: Card,
    x: number,
    y: number,
    sx: number,
    sy: number
  ) {
    const p5 = this.p5
    p5.push()
    p5.translate(x, y)
    p5.scale(sx, sy)
    const indexY = Math.floor(card.id / 6)
    p5.image(
      this.sheet,
      0,
      0,
      105,
      140,
      150 * (card.id - indexY * 6),
      200 * indexY,
      150,
      200
    )
    p5.fill(255)
    p5.stroke(0)
    p5.strokeWeight(3)
    p5.textSize(16)
    p5.text("2 / Chicken\nDragon", 0, 40)
    p5.pop()
  }

  click() {
    const gp = this.gameplay
    const buttons = this.buttons

    // if is inspecting card then exit
    if (gp.inspect.isOpening) return (gp.inspect.isOpening = false)

    const mx = this.gc.mx
    const my = this.gc.my

    // get cards phase
    if (gp.phase === "GET") {
      const shop = gp.shop
      // shop is opened?
      if (gp.shop.isOpened) {
        const holder1 = shop.cardHolders![0]
        const holder2 = shop.cardHolders![1]
        const isFlipping = holder2.flips > 0 || holder2.ap > 0.5
        if (isFlipping) return

        // check click to inspect holders
        const holdersYEnd = shop.holdersY.end
        if (
          mx > 140 - 75 &&
          mx < 140 + 75 &&
          my > holdersYEnd - 100 &&
          my < holdersYEnd + 100
        ) {
          gp.inspectCard(holder1.card, 140, holdersYEnd, 1.5)
          return
        } else if (
          mx > 360 - 75 &&
          mx < 360 + 75 &&
          my > holdersYEnd - 100 &&
          my < holdersYEnd + 100
        ) {
          gp.inspectCard(holder2.card, 360, holdersYEnd, 1.5)
          return
        }

        if (shop.menuType == "DEFAULT") {
          // default menu buttons
          if (buttons.acceptCards.checkHover(mx, my)) {
            return buttons.acceptCards.clicked()
          }

          if (!shop.hasRerolled) {
            if (buttons.rerollEle.checkHover(mx, my)) {
              return buttons.rerollEle.clicked()
            }
            if (buttons.rerollType.checkHover(mx, my)) {
              return buttons.rerollType.clicked()
            }
            if (buttons.closeShop.checkHover(mx, my)) {
              return buttons.closeShop.clicked()
            }
          }
        } else {
          // reroll menu buttons
          if (buttons.rerollYes.checkHover(mx, my)) {
            return buttons.rerollYes.clicked()
          }
          if (buttons.rerollNo.checkHover(mx, my)) {
            return buttons.rerollNo.clicked()
          }

          // check click to inspect reroll previews
          const holdersYAR = shop.holdersY.AFTER_REROLL
          if (
            mx > 140 - 75 &&
            mx < 140 + 75 &&
            my > holdersYAR - 100 &&
            my < holdersYAR + 100
          ) {
            gp.inspectCard(
              shop.rerollPreviews.yangPool[shop.rerollPreviews.showingIndex],
              140,
              holdersYAR,
              1.5
            )
            return
          } else if (
            mx > 360 - 75 &&
            mx < 360 + 75 &&
            my > holdersYAR - 100 &&
            my < holdersYAR + 100
          ) {
            gp.inspectCard(
              shop.rerollPreviews.yinPool[shop.rerollPreviews.showingIndex],
              360,
              holdersYAR,
              1.5
            )
            return
          }
        }
      }
      // shop is closed?
      else {
        // check click open shop button
        if (buttons.openShop.checkHover(mx, my)) {
          return buttons.openShop.clicked()
        }
      }
    }

    //// SPECTATE phase can switch between views, similar to READY?
  }
}
