import type P5 from "react-p5/node_modules/@types/p5/index.d.ts"
import type { PlayerId } from "rune-sdk"
import GameClient from "./GameClient"
import { GameState } from "../logic"
import Render from "./Render"
import { Card, CARDS_TABLE } from "./cards"

interface Shop {
  yinPool: Card[]
  yangPool: Card[]
  openBtnHintCountdown: number
  isOpened: boolean
  availableCards: null | [Card, Card]
  openAP: number
  hasRerolled: boolean
  hasTaken: boolean
}

interface LocalCard {
  id: number
  position: null | [number, number]
}

export default class Gameplay {
  gc: GameClient
  gs!: GameState // synchronized game state across server and all players
  render!: Render

  myPlayerId?: PlayerId
  viewingPlayer!: PlayerId
  phase: "SCORING" | "GET" | "PLAY" | "READY"

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
      openBtnHintCountdown: 0,
      isOpened: false,
      availableCards: null,
      openAP: 0,
      hasRerolled: false,
      hasTaken: false,
    }
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
    // spectator skips this phase
    if (this.myPlayerId === undefined) {
      this.phase = "READY"
      if (this.gs.round > 5) Rune.showGameOverPopUp()
      return
    }

    const thisPlayer = this.gs.players.find((p) => p.id === this.myPlayerId)
    if (!thisPlayer) throw "Can't find this player data"

    this.localCards = null
    const shop = this.shop

    // get new cards
    shop.availableCards = [
      this.shop.yangPool[
        Math.floor(this.shop.yangPool.length * thisPlayer.rng[0])
      ],
      this.shop.yinPool[
        Math.floor(this.shop.yinPool.length * thisPlayer.rng[1])
      ],
    ]
    shop.isOpened = false
    shop.openAP = 0
    shop.hasRerolled = false
    shop.hasTaken = false

    // last round? show result popup
    if (this.gs.round > 5) {
      this.phase = "READY"
      Rune.showGameOverPopUp()
    } else this.phase = "GET"
  }
}
