import type P5 from "react-p5/node_modules/@types/p5/index.d.ts"
import type { PlayerId } from "rune-sdk"
import GameClient from "./GameClient"
import { GameState } from "../logic"
import Render from "./Render"
import { Card, CARDS_TABLE } from "./cards"

interface Inspect {
  isOpened: boolean
  isOpening: boolean
  card: Card
  ox: number
  oy: number
  os: number
  ap: number
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

  inspect: Inspect
}

interface LocalCard {
  card: Card
  position: null | [number, number]
}

export default class Gameplay {
  gc: GameClient
  gs!: GameState // synchronized game state across server and all players
  render!: Render

  myPlayerId?: PlayerId
  viewingPlayer!: PlayerId
  phase: "SCORING" | "GET" | "PLAY" | "READY" | "SPECTATE"

  shop: Shop
  localCards: null | [LocalCard, LocalCard]

  /// ready phase: no render local card if already there

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

      inspect: {
        isOpened: false,
        isOpening: false,
        card: CARDS_TABLE[0],
        ox: 0,
        oy: 0,
        os: 0,
        ap: 0,
      },
    }
  }

  inspectCard(card: Card, ox: number, oy: number, os: number) {
    //// exit conditions here
  }

  startScoringPhase() {
    // skip scoring phase on 1st round
    if (this.gs.round === 1) {
      this.startGetPhase()
      return
    }
    this.phase = "SCORING"
  }

  startGetPhase() {
    // spectator skips this and PLAY phases
    if (this.myPlayerId === undefined) {
      this.phase = "SPECTATE"
      if (this.gs.round > 5) Rune.showGameOverPopUp()
      return
    }

    const thisPlayer = this.gs.players.find((p) => p.id === this.myPlayerId)
    if (!thisPlayer) throw "Can't find this player data"

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
    if (this.gs.round > 5) {
      this.phase = "READY"
      Rune.showGameOverPopUp()
    } else this.phase = "GET"
  }
}
