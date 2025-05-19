import { GameState } from "../logic"
import Gameplay from "./Gameplay"

export default function runeInit(gameplay: Gameplay) {
  Rune.initClient({
    //// would restart work automatically at any round?
    onChange: ({ game, yourPlayerId }) => {
      // initial set up: isSpectator and initial viewingPlayer
      if (yourPlayerId === undefined) gameplay.isSpectator = true
      if (gameplay.viewingPlayer === undefined) {
        if (yourPlayerId) gameplay.viewingPlayer = yourPlayerId
        else gameplay.viewingPlayer = game.players[0].id
      }

      const prevGS: GameState | undefined = gameplay.gs
      gameplay.gs = game // sync game state

      // update viewingPlayer if out of players array (due to someone leaving)
      /// set to self if not spectator

      // round changed? start scoring phase
      if (prevGS === undefined || prevGS.round !== game.round) {
        gameplay.startScoringPhase()
      }
    },
  })
}
