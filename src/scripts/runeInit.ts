import { GameState } from "../logic"
import Gameplay from "./Gameplay"
import { allLanguages, translations } from "./locales"

export default function runeInit(gameplay: Gameplay) {
  Rune.initClient({
    onChange: ({ game, yourPlayerId, event }) => {
      let prevGS: GameState | undefined = gameplay.gs
      gameplay.gs = game // sync game state

      // new game? reset all
      if (event?.name === "stateSync" && event.isNewGame && game.round === 1) {
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

        // close all modals
        gameplay.shop.isOpened = false
        gameplay.inspect.isOpened = false
        gameplay.langModal.isOpened = false
        gameplay.wheelModalIsOpened = false

        // set language
        if (yourPlayerId !== undefined) {
          const savedLang = game.persisted[yourPlayerId].lang
          if (allLanguages.includes(savedLang))
            gameplay.gc.translatedTexts = translations[savedLang]
          // open language modal if haven't set before
          else gameplay.openLangModal()
        }
      }

      const viewingPlayerState = game.players.find(
        (p) => p.id === gameplay.viewingPlayer
      )
      // if viewingPlayer no longer exists (left)
      if (viewingPlayerState === undefined) {
        if (yourPlayerId) {
          gameplay.setViewingPlayer(yourPlayerId)
        } else {
          if (game.players.length === 0) throw "No active player"
          gameplay.setViewingPlayer(game.players[0].id)
        }
        // scoring this player? skip to next
        if (gameplay.phase === "SCORING") {
          gameplay.scoringControl.playerIndex-- // reverse due to array size change
          gameplay.nextPlayerToScore()
        }
      }

      // round changed? start scoring phase
      if (prevGS === undefined || prevGS.round !== game.round) {
        gameplay.startScoringPhase()
      }
    },
  })
}
