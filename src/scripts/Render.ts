import type P5 from "react-p5/node_modules/@types/p5/index.d.ts"
import GameClient from "./GameClient"
import Gameplay from "./Gameplay"
import Button from "./Button"
import { Card } from "./cards"

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

    // render open shop button if no cards taken yet
    if (!shop.hasTaken) {
      this.buttons.openShop.render(p5)

      if (shop.isOpened) this.renderShop(p5, gp)
      // shop closed? update hint countdown
      else {
        if (shop.openBtnHintCountdown <= 0) {
          this.buttons.openShop.ap = 0
          shop.openBtnHintCountdown = 200
        } else shop.openBtnHintCountdown--
      }
    }
  }

  renderShop(p5: P5, gp: Gameplay) {
    const shop = gp.shop

    // shop modal bg
    p5.noStroke()
    p5.fill(0, 150)
    const h = (p5.height / p5.width) * 500
    p5.rect(250, h / 2, 500, h)

    // update flipping card if the second holder flips > 0 && ap > 0.5
    const holder1 = shop.cardHolders![0]
    const holder2 = shop.cardHolders![1]
    if (holder2.flips > 0 || holder2.ap > 0.5) {
      holder1.ap -= holder1.flips * 0.008 + 0.015
      if (holder1.flips > 0) {
        if (holder1.ap <= 0) {
          holder1.flips--
          holder1.ap = 1 + holder1.ap // spillover
          // set random card or real card
          if (holder1.flips > 0) {
            holder1.card = gp.getRandomCard(false, Math.random())
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

      holder2.ap -= holder2.flips * 0.008 + 0.015
      if (holder2.flips > 0) {
        if (holder2.ap <= 0) {
          holder2.flips--
          holder2.ap = 1 + holder2.ap // spillover
          // set random card or real card
          if (holder2.flips > 0) {
            holder2.card = gp.getRandomCard(false, Math.random())
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
      shop.holdersY.ap = Math.min(1, shop.holdersY.ap + 0.01)
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

    this.renderCard(holder1.card, 150, realY, sx1, 1)
    this.renderCard(holder2.card, 350, realY, sx2, 1)
  }

  renderCard(card: Card, x: number, y: number, sx: number, sy: number) {
    const p5 = this.p5
    p5.push()
    p5.translate(x, y)
    p5.scale(sx, sy)
    const indexY = Math.floor(card.id / 6)
    p5.image(
      this.sheet,
      0,
      0,
      150,
      200,
      150 * (card.id - indexY * 6),
      200 * indexY,
      150,
      200
    )
    p5.fill(255, 255, 0)
    p5.textSize(40)
    p5.text(Math.floor(p5.frameRate()), 0, 20)
    p5.pop()
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
