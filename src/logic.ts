import type { PlayerId, RuneClient } from "rune-sdk"

export interface GameState {
  playerIds: PlayerId[]
}

type GameActions = {
  claimCell: (cellIndex: number) => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (allPlayerIds) => ({
    playerIds: allPlayerIds,
  }),
  actions: {
    claimCell: (cellIndex, { game, playerId, allPlayerIds }) => {},
  },
})
