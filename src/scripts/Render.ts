import type P5 from "react-p5/node_modules/@types/p5/index.d.ts"
import GameClient from "./GameClient"
import Gameplay from "./Gameplay"
import Button from "./Button"
import { Card, CARDS_TABLE } from "./cards"
import { Translation } from "./locales"
import { Collection, LogicPlayer } from "../logic"

interface Buttons {
  openShop: Button
  acceptCards: Button
  closeShop: Button
  rerollEle: Button
  rerollType: Button
  rerollYes: Button
  rerollNo: Button

  undo: Button
  ready: Button
  goBack: Button
}

interface Flasher {
  x: number
  y: number
  ap: 0
}

export default class Render {
  gc: GameClient
  sheet!: P5.Image
  p5!: P5
  gameplay!: Gameplay

  playersInfo: { [key: string]: { name: string; avatar: P5.Image } }

  buttons!: Buttons

  flashers: Flasher[]

  dragHoveredPos: null | [number, number]

  constructor(gameClient: GameClient) {
    this.gc = gameClient
    this.flashers = []
    this.dragHoveredPos = null
    this.playersInfo = {}
  }

  getGridCenter(collection: Collection): [number, number] {
    // find max rows and cols
    let rows = 0,
      cols = 0
    for (let y = 3; y >= 0; y--) {
      for (let x = 3; x >= 0; x--) {
        // not empty?
        if (collection[y][x] !== null) {
          cols = Math.max(cols, y)
          rows = Math.max(rows, x)
        }
      }
    }
    return [rows, cols]
  }

  getPossiblePlacements(rows: number, cols: number): [number, number][] {
    const collection = this.gameplay.localDisplay.collection
    // check if no card placed then return only first slot
    if (rows === 0 && collection[0][0] === null) return [[0, 0]]
    const obj: { [key: string]: true } = {}
    const dirs = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]

    // loop through all cards to get pps
    for (let y = 0; y < cols + 1; y++) {
      for (let x = 0; x < rows + 1; x++) {
        if (collection[y][x] === null) continue // no card here
        // add all empty adjs to obj
        for (let i = 0; i < dirs.length; i++) {
          const newX = x + dirs[i][0]
          const newY = y + dirs[i][1]
          // out of bound right-bottom? skip
          if (newX > 3 || newY > 3) continue

          // accepted conditions
          if (
            (newX === -1 && rows < 3) ||
            (newY === -1 && cols < 3) ||
            (newX > -1 && newY > -1 && collection[newY][newX] === null)
          ) {
            obj[`${newX},${newY}`] = true
          }
        }
      }
    }

    return Object.keys(obj).map((key) => {
      const arr = key.split(",")
      return [Number(arr[0]), Number(arr[1])]
    })
  }

  addFlasher(x: number, y: number) {
    this.flashers.push({ x, y, ap: 0 })
  }

  renderPlayers(p5: P5, playersState: LogicPlayer[]) {
    // render players
    const statePlayers = this.gameplay.gs!.players
    const isScoringPhase = this.gameplay.phase === "SCORING"
    const infos = statePlayers.map((p) => this.playersInfo[p.id])
    p5.textSize(32)

    // render selected viewingPlayer outline
    const vp = this.gameplay.viewingPlayer
    p5.fill(240, 70, 60)
    p5.noStroke()
    if (vp === statePlayers[0]?.id) {
      p5.rect(185, 50, 180, 60, 20)
    } else if (vp === statePlayers[1]?.id) {
      p5.rect(395, 50, 180, 60, 20)
    } else if (vp === statePlayers[2]?.id) {
      p5.rect(185, 120, 180, 60, 20)
    } else if (vp === statePlayers[3]?.id) {
      p5.rect(395, 120, 180, 60, 20)
    }

    // player 1
    p5.noStroke()
    p5.fill(255)
    p5.rect(150, 50, 100, 40)
    p5.fill(0)
    p5.rect(230, 50, 70, 40, 0, 10, 10, 0)
    p5.text(888, 160, 46)
    p5.fill(255)
    p5.text(888, 230, 46)
    if (infos[0].avatar) p5.image(infos[0].avatar, 100, 50, 60, 60)
    if (statePlayers[0].isReady || isScoringPhase) {
      p5.fill(65, 230, 60)
      p5.circle(78, 28, 20)
    }

    if (statePlayers.length > 1) {
      // player 2
      p5.fill(255)
      p5.rect(360, 50, 100, 40)
      p5.fill(0)
      p5.rect(440, 50, 70, 40, 0, 10, 10, 0)
      p5.text(888, 370, 46)
      p5.fill(255)
      p5.text(888, 440, 46)
      if (infos[1].avatar) p5.image(infos[1].avatar, 310, 50, 60, 60)
      if (statePlayers[1].isReady || isScoringPhase) {
        p5.fill(65, 230, 60)
        p5.circle(288, 28, 20)
      }
    }

    if (statePlayers.length > 2) {
      // player 3
      p5.fill(255)
      p5.rect(150, 120, 100, 40)
      p5.fill(0)
      p5.rect(230, 120, 70, 40, 0, 10, 10, 0)
      p5.text(888, 160, 116)
      p5.fill(255)
      p5.text(888, 230, 116)
      if (infos[2].avatar) p5.image(infos[2].avatar, 100, 120, 60, 60)
      if (statePlayers[2].isReady || isScoringPhase) {
        p5.fill(65, 230, 60)
        p5.circle(78, 98, 20)
      }
    }

    if (statePlayers.length > 3) {
      // player 4
      p5.fill(255)
      p5.rect(360, 120, 100, 40)
      p5.fill(0)
      p5.rect(440, 120, 70, 40, 0, 10, 10, 0)
      p5.text(888, 370, 116)
      p5.fill(255)
      p5.text(888, 440, 116)
      if (infos[3].avatar) p5.image(infos[3].avatar, 310, 120, 60, 60)
      if (statePlayers[3].isReady || isScoringPhase) {
        p5.fill(65, 230, 60)
        p5.circle(288, 98, 20)
      }
    }

    // render added totals during scoring phase
    ////
  }

  draw() {
    const gp = this.gameplay
    if (!gp.gs) return
    const p5 = this.p5
    const buttons = this.buttons
    const tt = this.gc.translatedTexts
    const playersState = gp.gs.players

    //// any phase rendering: collection, players, lang menu

    // p5.stroke(0)
    // p5.strokeWeight(3)
    // this.renderYang(250, 500, 20)

    // p5.stroke(255)
    // p5.strokeWeight(3)
    // this.renderYin(300, 500, 20)

    // render collection border
    // p5.strokeWeight(5)
    // p5.stroke(150)
    // p5.noFill()
    // p5.rect(250, 460, 440, 580, 15)

    const viewingPlayerState = playersState.find(
      (p) => p.id === gp.viewingPlayer
    )!

    this.renderPlayers(p5, playersState)

    // render collection
    const ld = gp.localDisplay
    const [rows, cols] = this.getGridCenter(
      gp.viewingPlayer === gp.myPlayerId
        ? ld.collection
        : viewingPlayerState.collection
    )
    // update grid position
    ld.x += (92.5 + (3 - rows) * 52.5 - ld.x) * 0.2
    ld.y += (250 + (3 - cols) * 75 - ld.y) * 0.2
    const ldx = ld.x
    const ldy = ld.y

    if (gp.viewingPlayer === gp.myPlayerId) {
      // render self collection
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          const cardId = ld.collection[y][x]
          if (cardId !== null) {
            const card = CARDS_TABLE[cardId]
            this.renderTransformCard(card, ldx + 105 * x, ldy + 140 * y, 1, 1)
          }
        }
      }
    } else {
      // guest collection
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          const cardId = viewingPlayerState.collection[y][x]
          if (cardId !== null) {
            // render question mark if this player is ready and this is the newly played card
            if (
              viewingPlayerState.playedPositions &&
              viewingPlayerState.isReady
            ) {
              const [pos1, pos2] = viewingPlayerState.playedPositions
              if (
                (pos1[0] === x && pos1[1] === y) ||
                (pos2[0] === x && pos2[1] === y)
              ) {
                p5.strokeWeight(4)
                p5.stroke(255)
                p5.noFill()
                p5.rect(ldx + 105 * x, ldy + 140 * y, 90, 125, 10)
                p5.fill(255)
                p5.noStroke()
                p5.textSize(50)
                p5.text("?", ldx + 105 * x, ldy + 140 * y)

                continue
              }
            }
            this.renderTransformCard(
              CARDS_TABLE[cardId],
              ldx + 105 * x,
              ldy + 140 * y,
              1,
              1
            )
          }
        }
      }
    }

    // viewing a guest?
    if (gp.viewingPlayer !== gp.myPlayerId) {
      // not spectator?
      if (gp.myPlayerId) buttons.goBack.render(p5)
      // watching guest-name text
      p5.textSize(24)
      p5.noStroke()
      p5.fill(255)
      p5.text(
        tt.short.watching + "\n" + this.playersInfo[gp.viewingPlayer].name,
        360,
        805
      )
    } else {
      // GET phase
      if (gp.phase === "GET") {
        const shop = gp.shop

        if (shop.isOpened) this.renderShop(p5, gp, tt)
        // shop closed?
        else {
          // render open shop button
          buttons.openShop.render(p5)
          if (shop.openBtnHintCountdown <= 0) {
            buttons.openShop.ap = 0
            shop.openBtnHintCountdown = 120
          } else shop.openBtnHintCountdown--
          p5.stroke(255)
          p5.strokeWeight(10)
          const arrowY = p5.cos(p5.frameCount * 8) * 20
          p5.line(250, 600 + arrowY, 250, 700 + arrowY)
          p5.line(270, 670 + arrowY, 250, 700 + arrowY)
          p5.line(230, 670 + arrowY, 250, 700 + arrowY)
        }
      } else if (gp.phase === "PLAY") {
        this.dragHoveredPos = null
        const { mx, my, isPressing } = this.gc
        const lc1 = gp.localCards![0]
        const lc2 = gp.localCards![1]

        // is dragging? render pps
        if (lc1.isDragging || lc2.isDragging) {
          // make a list of possible placements
          const pps = this.getPossiblePlacements(rows, cols)
          p5.noFill()
          p5.stroke(220, 220, 0)
          p5.strokeWeight(5)
          for (let i = 0; i < pps.length; i++) {
            const [x, y] = pps[i]
            const centerX = ldx + 105 * x
            const centerY = ldy + 140 * y

            // check hover
            if (
              mx > centerX - 52.5 &&
              mx < centerX + 52.5 &&
              my > centerY - 70 &&
              my < centerY + 70
            ) {
              p5.rect(centerX, centerY, 105, 140, 10)
              this.dragHoveredPos = [x, y]
            } else p5.circle(centerX, centerY, 15)
          }
        }

        // not placed? render local card 1
        if (lc1.placedPos === null) {
          this.renderTransformCard(lc1.card, lc1.x, lc1.y, lc1.s, lc1.s)
          // check drag
          if (isPressing && !lc2.isDragging) {
            if (
              mx > lc1.x - 78 &&
              mx < lc1.x + 78 &&
              my > lc1.y - 105 &&
              my < lc1.y + 105
            ) {
              lc1.isDragging = true
            }
          }
          if (lc1.isDragging) {
            // follow cursor
            lc1.s = Math.max(1, lc1.s - 0.1)
            lc1.x += (mx - lc1.x) * 0.4
            lc1.y += (my - lc1.y) * 0.4
          } else {
            // return to hand
            lc1.s = Math.min(1.5, lc1.s + 0.1)
            lc1.x += (140 - lc1.x) * 0.4
            lc1.y += (800 - lc1.y) * 0.4
          }
        }

        // not placed? render local card 2
        if (lc2.placedPos === null) {
          this.renderTransformCard(lc2.card, lc2.x, lc2.y, lc2.s, lc2.s)
          // check drag
          if (isPressing && !lc1.isDragging) {
            if (
              mx > lc2.x - 78 &&
              mx < lc2.x + 78 &&
              my > lc2.y - 105 &&
              my < lc2.y + 105
            ) {
              lc2.isDragging = true
            }
          }
          if (lc2.isDragging) {
            // follow cursor
            lc2.s = Math.max(1, lc2.s - 0.1)
            lc2.x += (mx - lc2.x) * 0.4
            lc2.y += (my - lc2.y) * 0.4
          } else {
            // return to hand
            lc2.s = Math.min(1.5, lc2.s + 0.1)
            lc2.x += (360 - lc2.x) * 0.4
            lc2.y += (800 - lc2.y) * 0.4
          }
        }

        // both cards are placed?
        if (lc1.placedPos !== null && lc2.placedPos !== null) {
          this.buttons.undo.render(p5)
          this.buttons.ready.render(p5)
        }
        // not dragging & none placed yet & is round 1?
        else if (
          gp.gs.round === 1 &&
          !lc1.isDragging &&
          !lc2.isDragging &&
          lc1.placedPos === null &&
          lc2.placedPos === null
        ) {
          // render hint drag arrow
          p5.push()
          const ap = p5.cos(p5.frameCount * 5)
          p5.translate(320 + 30 * ap, 660 + 80 * ap)
          p5.rotate(-22)
          p5.stroke(0)
          p5.strokeWeight(18)
          p5.line(0, 0, 0, -80)
          p5.line(15, -60, 0, -80)
          p5.line(-15, -60, 0, -80)
          p5.stroke(255)
          p5.strokeWeight(8)
          p5.line(0, 0, 0, -80)
          p5.line(15, -60, 0, -80)
          p5.line(-15, -60, 0, -80)
          p5.pop()
        }
      }
    }

    // render flashers
    p5.noStroke()
    for (let i = this.flashers.length - 1; i >= 0; i--) {
      const f = this.flashers[i]
      p5.fill(255, 255, 0, (1 - f.ap) * 220)
      p5.rect(ldx + 105 * f.x, ldy + 140 * f.y, 105, 140, 10)
      f.ap += 0.1
      if (f.ap >= 1) this.flashers.splice(i, 1) // remove flasher
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
      holder1.ap -= holder1.flips * 0.02 + 0.04
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

      holder2.ap -= holder2.flips * 0.02 + 0.04
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

  // card: 105 x 140
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
    p5.text("ability\nhere", 0, 40)
    p5.pop()
  }

  renderYang(x: number, y: number, r: number) {
    const p5 = this.p5
    const rg = r * 1.33
    const hrg = (r / 2) * 1.33
    p5.fill(255)
    p5.beginShape()
    p5.vertex(x, y - r)
    p5.bezierVertex(x - rg, y - r, x - rg, y + r, x, y + r)
    p5.bezierVertex(x - hrg, y + r, x - hrg, y, x, y)
    p5.bezierVertex(x + hrg, y, x + hrg, y - r, x, y - r)
    p5.endShape()
    p5.noStroke()
    p5.fill(0)
    p5.circle(x, y - r / 2, r * 0.4)
  }

  renderYin(x: number, y: number, r: number) {
    const p5 = this.p5
    const rg = r * 1.33
    const hrg = (r / 2) * 1.33
    p5.fill(0)
    p5.beginShape()
    p5.vertex(x + 0, y + r)
    p5.bezierVertex(x + rg, y + r, x + rg, y - r, x, y - r)
    p5.bezierVertex(x + hrg, y - r, x + hrg, y, x, y)
    p5.bezierVertex(x - hrg, y, x - hrg, y + r, x, y + r)
    p5.endShape()
    p5.noStroke()
    p5.fill(255)
    p5.circle(x, y + r / 2, r * 0.4)
  }

  click() {
    const gp = this.gameplay
    if (!gp.gs) return
    // if is inspecting card then exit
    if (gp.inspect.isOpening) return (gp.inspect.isOpening = false)

    const buttons = this.buttons
    const mx = this.gc.mx
    const my = this.gc.my

    // viewing a guest?
    if (gp.viewingPlayer !== gp.myPlayerId) {
      if (gp.myPlayerId) {
        if (buttons.goBack.checkHover(mx, my)) return buttons.goBack.clicked()
      }
    } else {
      // phases
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
            if (buttons.acceptCards.checkHover(mx, my))
              return buttons.acceptCards.clicked()

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
            if (buttons.rerollYes.checkHover(mx, my))
              return buttons.rerollYes.clicked()

            if (buttons.rerollNo.checkHover(mx, my))
              return buttons.rerollNo.clicked()

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
          return
        }
        // shop is closed?
        else {
          // check click open shop button
          if (buttons.openShop.checkHover(mx, my)) {
            return buttons.openShop.clicked()
          }
        }
      } else if (gp.phase === "PLAY") {
        const [lc1, lc2] = gp.localCards!

        // release dragged card
        if (lc1.isDragging) {
          lc1.isDragging = false
          if (this.dragHoveredPos) gp.playCard(0, this.dragHoveredPos)
          return
        }
        if (lc2.isDragging) {
          lc2.isDragging = false
          if (this.dragHoveredPos) gp.playCard(1, this.dragHoveredPos)
          return
        }

        // both cards are placed?
        if (lc1.placedPos !== null && lc2.placedPos !== null) {
          if (buttons.undo.checkHover(mx, my)) return buttons.undo.clicked()
          if (buttons.ready.checkHover(mx, my)) return buttons.ready.clicked()
        }
      }
    }

    // inspect card in collection
    const clickedCardX = Math.floor((mx - (gp.localDisplay.x - 52.5)) / 105)
    const clickedCardY = Math.floor((my - (gp.localDisplay.y - 70)) / 140)
    if (
      clickedCardX > -1 &&
      clickedCardX < 4 &&
      clickedCardY > -1 &&
      clickedCardY < 4
    ) {
      const viewingPlayerState = gp.gs.players.find(
        (p) => p.id === gp.viewingPlayer
      )!
      const collection =
        gp.viewingPlayer === gp.myPlayerId
          ? gp.localDisplay.collection
          : viewingPlayerState.collection
      const cardId = collection[clickedCardY][clickedCardX]
      if (cardId !== null) {
        if (
          gp.viewingPlayer !== gp.myPlayerId &&
          viewingPlayerState.isReady &&
          viewingPlayerState.playedPositions
        ) {
          const [pos1, pos2] = viewingPlayerState.playedPositions
          if (
            (pos1[0] === clickedCardX && pos1[1] === clickedCardY) ||
            (pos2[0] === clickedCardX && pos2[1] === clickedCardY)
          )
            return // cancel if this card is hidden for this guest
        }
        return gp.inspectCard(
          CARDS_TABLE[cardId],
          gp.localDisplay.x + 105 * clickedCardX,
          gp.localDisplay.y + 140 * clickedCardY,
          1
        )
      }
    }

    // clicked a player?
    const statePlayers = gp.gs.players
    if (mx > 70 && mx < 270) {
      if (my > 20 && my < 80) {
        return gp.setViewingPlayer(statePlayers[0].id)
      }
      if (statePlayers.length > 2 && my > 90 && my < 150) {
        return gp.setViewingPlayer(statePlayers[2].id)
      }
    }
    if (statePlayers.length > 1 && mx > 280 && mx < 480) {
      if (my > 20 && my < 80) {
        return gp.setViewingPlayer(statePlayers[1].id)
      }
      if (statePlayers.length > 3 && my > 90 && my < 150) {
        return gp.setViewingPlayer(statePlayers[3].id)
      }
    }
  }
}
