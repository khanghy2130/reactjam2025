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
  playedPositions: [number[], number[]] | null
}

export interface GameState {
  round: number
  players: LogicPlayer[]
}

type GameActions = {
  becomeReady: (payload: {
    collection: Collection
    playedPositions: [number[], number[]]
  }) => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

// randomness for each player per round
const generateRNG = () => {
  const r = Math.random
  return [r(), r(), r(), r()]
}

function checkToEndRound(game: GameState) {
  // exit if someone is not ready
  game.players.some((p) => !p.isReady)

  /// calculate gained score for each player
  /// each player: isReady => false, renew rng, update score & prevScore
  // unready all players
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
    becomeReady: (payload, { game, playerId }) => {
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
  },
  events: {
    playerLeft: (playerId, { game }) => {
      // clean up this player data in game state
      game.players = game.players.filter((p) => p.id !== playerId)
      checkToEndRound(game)
    },
  },
})
