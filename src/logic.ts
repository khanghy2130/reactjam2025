import type { PlayerId, RuneClient } from "rune-sdk"

type CardId = number | null
type Collection = CardId[][]

interface Player {
  id: PlayerId
  score: number
  prevScore: number
  isReady: boolean
  rng: number[]
  collection: Collection
  playedPositions: [number, number][] | null
}

export interface GameState {
  round: number
  players: Player[]
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
  minPlayers: 2,
  maxPlayers: 4,
  setup: (allPlayerIds) => ({
    round: 1,
    players: allPlayerIds.map(
      (playerId): Player => ({
        id: playerId,
        score: 0,
        prevScore: 0,
        isReady: false,
        rng: generateRNG(),
        collection: Array.from({ length: 4 }, () => Array(4).fill(null)),
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
      //// checkToEndRound() again
    },
  },
})
