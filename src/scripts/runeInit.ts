import { GameState } from "../logic"
import Gameplay from "./Gameplay"

export default function runeInit(gameplay: Gameplay) {
  Rune.initClient({
    //// would restart work automatically at any round?
    onChange: ({ game, yourPlayerId, event }) => {
      let prevGS: GameState | undefined = gameplay.gs
      gameplay.gs = game // sync game state

      // new game? reset all
      if (event?.name === "stateSync" && event.isNewGame) {
        prevGS = undefined // force reset
        gameplay.myPlayerId = yourPlayerId // sync playerId
        // inital viewingPlayer (self, or first player if is spectator)
        if (yourPlayerId) {
          gameplay.setViewingPlayer(yourPlayerId)
        } else gameplay.setViewingPlayer(game.players[0].id)

        // load player images
        const render = gameplay.render
        render.playersInfo = {}
        game.players.forEach((p) => {
          const info = Rune.getPlayerInfo(p.id)
          render.playersInfo[p.id] = {
            name: info.displayName,
            avatar: render.p5.loadImage(info.avatarUrl),
          }
        })
      }

      // if viewingPlayer no longer exists
      if (
        game.players.find((p) => p.id === gameplay.viewingPlayer) === undefined
      ) {
        if (yourPlayerId) {
          gameplay.setViewingPlayer(yourPlayerId)
        } else gameplay.setViewingPlayer(game.players[0].id)
        // if doing the scoring process then skip to next ///////
      }

      // round changed? start scoring phase
      if (prevGS === undefined || prevGS.round !== game.round) {
        gameplay.startScoringPhase()
      }

      /// else: handle other onchange actions? update guestCollection if viewing it? update self collection if self got ready?
    },
  })
}
