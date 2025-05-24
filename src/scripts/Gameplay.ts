import type { PlayerId } from "rune-sdk"
import GameClient from "./GameClient"
import { Collection, GameState } from "../logic"
import Render from "./Render"
import { Card, CARDS_TABLE } from "./cards"

interface Inspect {
  isOpened: boolean
  isOpening: boolean
  card: Card
  ox: number
  oy: number
  os: number
  ap: number // 0 to 1 (opening), 1 to 0 (closing)
}

interface CardHolder {
  flips: number // x to 0
  ap: number // 1 to 0 (to 0.5 on last flip)
  card: Card
}

interface Shop {
  yinPool: Card[]
  yangPool: Card[]
  flipYinPool: Card[]
  flipYangPool: Card[]
  openBtnHintCountdown: number
  isOpened: boolean
  availableCards: null | [Card, Card]
  cardHolders: null | [CardHolder, CardHolder]
  holdersY: {
    DEFAULT: 300
    REROLL: 150
    AFTER_REROLL: 480
    start: number
    end: number
    ap: number // 0 to 1
  }
  rerollPreviews: {
    yinPool: Card[]
    yangPool: Card[]
    countdown: number
    showingIndex: 0 | 1
  }
  hasRerolled: boolean
  menuType: "DEFAULT" | "CHANGE_ELEMENT" | "CHANGE_TYPE"
}

interface LocalCard {
  card: Card
  // placedPos for spawning unplayed cards on undo
  placedPos: null | [number, number]
  x: number
  y: number
  s: number
  isDragging: boolean
}

export default class Gameplay {
  gc: GameClient
  gs?: GameState // synchronized game state across server and all players
  render!: Render

  myPlayerId?: PlayerId
  viewingPlayer!: PlayerId
  phase: "SCORING" | "GET" | "PLAY" | "READY" | "SPECTATE"

  shop: Shop
  inspect: Inspect
  localCards: null | [LocalCard, LocalCard]
  // update directly collection, x & y
  localDisplay: {
    collection: Collection
    guestCollection: Collection
    x: number
    y: number
  }

  constructor(gameClient: GameClient) {
    this.gc = gameClient
    this.phase = "READY"
    this.localCards = null
    this.shop = {
      yinPool: CARDS_TABLE.filter((c) => c.isYin),
      yangPool: CARDS_TABLE.filter((c) => !c.isYin),
      flipYinPool: [],
      flipYangPool: [],
      openBtnHintCountdown: 0,
      isOpened: false,
      availableCards: null,
      cardHolders: null,
      holdersY: {
        DEFAULT: 300,
        REROLL: 150,
        AFTER_REROLL: 480,
        start: 0,
        end: 0,
        ap: 0,
      },
      rerollPreviews: {
        yinPool: [],
        yangPool: [],
        countdown: 0,
        showingIndex: 0,
      },
      hasRerolled: false,
      menuType: "DEFAULT",
    }
    this.inspect = {
      isOpened: false,
      isOpening: false,
      card: CARDS_TABLE[0],
      ox: 0,
      oy: 0,
      os: 0,
      ap: 0,
    }
    this.localDisplay = {
      collection: [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ],
      guestCollection: [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ],
      x: 0,
      y: 0,
    }
  }

  undo() {
    if (
      !this.localCards ||
      this.localCards[0].placedPos === null ||
      this.localCards[1].placedPos === null
    )
      return
    const stateCollection = this.gs!.players.find(
      (player) => player.id === this.myPlayerId!
    )?.collection
    if (stateCollection === undefined) return
    const ld = this.localDisplay
    // reset collection
    ld.collection = stateCollection.map((row) => row.slice())

    for (let i = 0; i < this.localCards.length; i++) {
      const lc = this.localCards[i]
      const [px, py] = lc.placedPos!
      // was shifted by x?
      if (px === -1) this.localDisplay.x += 105
      // was shifted by y?
      if (py === -1) this.localDisplay.y += 140
      lc.x = 250
      lc.y = 1000
      lc.placedPos = null
    }
  }

  playCard(lc: LocalCard, [x, y]: [number, number]) {
    const collection = this.localDisplay.collection
    lc.placedPos = [x, y] // set to local card
    // make change to collection
    // shift cols
    if (x === -1) {
      for (let col = 0; col < 4; col++) {
        for (let row = 3; row > 0; row--) {
          collection[col][row] = collection[col][row - 1]
          collection[col][row - 1] = null
        }
      }
      this.localDisplay.x -= 105
      x = 0
    }
    // shift rows
    if (y === -1) {
      for (let col = 3; col > 0; col--) {
        for (let row = 0; row < 4; row++) {
          collection[col][row] = collection[col - 1][row]
          collection[col - 1][row] = null
        }
      }
      this.localDisplay.y -= 140
      y = 0
    }

    // add card to collection
    collection[y][x] = lc.card.id
    this.render.addFlasher(x, y)
    this.render.buttons.undo.ap = 0
    this.render.buttons.ready.ap = 0
  }

  inspectCard(card: Card, ox: number, oy: number, os: number) {
    const ip = this.inspect

    //// more exit conditions here
    if (ip.isOpened) return

    ip.card = card
    ip.ox = ox
    ip.oy = oy
    ip.os = os
    ip.ap = 0
    ip.isOpening = true
    ip.isOpened = true
  }

  startScoringPhase() {
    // skip scoring phase on 1st round
    if (this.gs!.round === 1) {
      this.startGetPhase()
      return
    }
    this.phase = "SCORING"
  }

  startGetPhase() {
    // spectator skips this and PLAY phases
    if (this.myPlayerId === undefined) {
      this.phase = "SPECTATE"
      if (this.gs!.round > 5) Rune.showGameOverPopUp()
      return
    }

    const thisPlayer = this.gs!.players.find((p) => p.id === this.myPlayerId)
    if (!thisPlayer) throw "Can't find this player data"

    // update self collection
    this.localDisplay.collection = thisPlayer.collection.map((row) =>
      row.slice()
    )

    this.localCards = null
    const shop = this.shop

    // get new cards
    shop.availableCards = [
      shop.yangPool[Math.floor(shop.yangPool.length * thisPlayer.rng[0])],
      shop.yinPool[Math.floor(shop.yinPool.length * thisPlayer.rng[1])],
    ]

    shop.cardHolders = [
      // first card has less flips
      { flips: 6, ap: 1, card: shop.availableCards[0] },
      { flips: 8, ap: 1, card: shop.availableCards[1] },
    ]
    shop.isOpened = false
    shop.hasRerolled = false
    shop.menuType = "DEFAULT"
    shop.holdersY.start = -100
    shop.holdersY.end = shop.holdersY.DEFAULT
    shop.holdersY.ap = 0
    shop.flipYinPool = shop.yinPool
    shop.flipYangPool = shop.yangPool

    // last round? show result popup
    if (this.gs!.round > 5) {
      this.phase = "READY"
      Rune.showGameOverPopUp()
    } else this.phase = "GET"
  }
}
