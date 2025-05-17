import type { PlayerId, RuneClient } from "rune-sdk"

type CardID = number | null

export interface GameState {
  playerIds: PlayerId[]
}

type GameActions = {
  confirmRound: (collection: CardID[][]) => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

Rune.initLogic({
  minPlayers: 4,
  maxPlayers: 4,
  setup: (allPlayerIds) => ({
    playerIds: allPlayerIds,
  }),
  actions: {
    confirmRound: (collection, { game, playerId, allPlayerIds }) => {},
  },
})
