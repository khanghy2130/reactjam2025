import type { GameOverResult, PlayerId, RuneClient } from "rune-sdk"
import { CARDS_TABLE, getTriggerPositions } from "./scripts/cards"
import { Language } from "./scripts/locales"

type CardItem = number | null
export type Collection = CardItem[][]

export interface LogicPlayer {
  id: PlayerId
  prevYinPts: number
  prevYangPts: number
  yinPts: number
  yangPts: number
  isReady: boolean
  rng: number[]
  collection: Collection
  playedPositions: [number[], number[]] | null
}

export interface GameState {
  round: number
  players: LogicPlayer[]
}

type Persisted = {
  lang: Language
}

type GameActions = {
  becomeReady: (payload: {
    collection: Collection
    playedPositions: [number[], number[]]
  }) => void
  readyToEndGame: () => void
  setLang: (payload: Language) => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions, Persisted>
}

// randomness for each player per round
const generateRNG = () => {
  const r = Math.random
  return [r(), r(), r(), r()]
}

function checkToEndRound(game: GameState) {
  // exit if someone is not ready
  if (game.players.some((p) => !p.isReady)) return

  if (game.round >= 6) return // game is already over

  // update all players
  game.players.forEach((p) => {
    p.isReady = false
    p.rng = generateRNG()
    p.prevYangPts = p.yangPts
    p.prevYinPts = p.yinPts

    // go through collection to calculate points gained
    const c = p.collection
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const cardId = c[y][x]
        if (cardId !== null) {
          const triggers = getTriggerPositions(c, [x, y])
          const card = CARDS_TABLE[cardId]
          const pointsGained = triggers.length * card.ability.num
          if (card.isYin) p.yinPts += pointsGained
          else p.yangPts += pointsGained
        }
      }
    }
  })

  game.round++ // update round
}

Rune.initLogic({
  persistPlayerData: true,
  minPlayers: 1,
  maxPlayers: 4,
  setup: (allPlayerIds) => ({
    round: 1,
    players: allPlayerIds.map(
      (playerId): LogicPlayer => ({
        id: playerId,
        prevYinPts: 0,
        prevYangPts: 0,
        yinPts: 0,
        yangPts: 0,
        isReady: false,
        rng: generateRNG(),
        collection: [
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
        ],
        playedPositions: null,
      })
    ),
  }),
  actions: {
    becomeReady: (payload, { game, playerId }) => {
      if (game.round >= 6) throw Rune.invalidAction() // game is already over

      const thisPlayer = game.players.find((p) => p.id === playerId)
      // validate
      if (thisPlayer === undefined || thisPlayer.isReady)
        throw Rune.invalidAction()
      if (!payload.collection || !payload.playedPositions)
        throw Rune.invalidAction()

      // corrent amount of cards?
      const cardsCount = payload.collection
        .flat()
        .filter((cardId) => cardId !== null).length
      if (cardsCount !== game.round * 2) throw Rune.invalidAction()

      thisPlayer.collection = payload.collection
      thisPlayer.playedPositions = payload.playedPositions
      thisPlayer.isReady = true

      checkToEndRound(game)
    },
    readyToEndGame: (payload, { game, playerId }) => {
      if (game.round !== 6) throw Rune.invalidAction()

      const playerState = game.players.find((p) => p.id === playerId)
      if (playerState) playerState.isReady = true
      if (game.players.every((p) => p.isReady)) {
        const scores: { [playerId: string]: GameOverResult } = {}
        game.players.forEach(
          (p) => (scores[p.id] = Math.min(p.yinPts, p.yangPts))
        )
        Rune.gameOver({
          players: scores,
          delayPopUp: true,
          minimizePopUp: true,
        })
      }
    },
    setLang: (payload, { game, playerId }) => {
      game.persisted[playerId].lang = payload
    },
  },
  events: {
    playerLeft: (playerId, { game }) => {
      // clean up this player data in game state
      game.players = game.players.filter((p) => p.id !== playerId)
      checkToEndRound(game)
    },
  },
})
