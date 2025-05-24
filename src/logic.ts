import type { PlayerId, RuneClient } from "rune-sdk"

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
  playedPositions: [number, number][] | null
}

export interface GameState {
  round: number
  players: LogicPlayer[]
}

type GameActions = {
  becomeReady: (collection: Collection) => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

// randomness for each player per round
const generateRNG = () => {
  const r = Math.random
  return [r(), r(), r(), r()]
}

function checkToEndRound() {
  /// check if all players are ready
}

function startNewRound() {
  /// calculate gained score for each player
  /// each player: isReady => false, renew rng, update score & prevScore
}

Rune.initLogic({
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
    becomeReady: (collection, { game, playerId, allPlayerIds }) => {
      /// update this player collection, lastPlayedCards, and isReady
      /// checkToEndRound()
    },
  },
  events: {
    playerLeft: (playerId, { game }) => {
      // clean up this player data in game state
      game.players = game.players.filter((p) => p.id !== playerId)
      //// checkToEndRound() again
    },
  },
})
