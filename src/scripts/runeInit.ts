import { GameState } from "../logic"
import Gameplay from "./Gameplay"

export default function runeInit(gameplay: Gameplay) {
  Rune.initClient({
    //// would restart work automatically at any round?
    onChange: ({ game, yourPlayerId, event }) => {
      // new game? reset all
      if (event?.name === "stateSync" && event.isNewGame) {
        ///// reset for a new game here if needed
      }

      gameplay.myPlayerId = yourPlayerId // sync playerId
      // inital viewingPlayer (self, or first player if is spectator)
      if (gameplay.viewingPlayer === undefined) {
        if (yourPlayerId) gameplay.viewingPlayer = yourPlayerId
        else gameplay.viewingPlayer = game.players[0].id
      }

      const prevGS: GameState | undefined = gameplay.gs
      gameplay.gs = game // sync game state

      // update viewingPlayer if out of players array (due to someone leaving)
      // if doing the scoring process then skip to next if watching this leaving player
      /// set to self if not spectator

      // round changed? start scoring phase
      if (prevGS === undefined || prevGS.round !== game.round) {
        gameplay.startScoringPhase()
      }
    },
  })
}
