import Gameplay from "./Gameplay"

export default function runeInit(gameplay: Gameplay) {
  // should not start gameplay until onChange is called
  Rune.initClient({
    //// rune restart button probably needs help resetting client state (when round = 1)
    onChange: ({ game, action, event, yourPlayerId }) => {
      // sync game state

      // is spectator
      if (yourPlayerId === undefined) {
        console.log("Logging from a spectator")
      } else {
        console.log("Logging from player: " + yourPlayerId)
      }

      // someone (including self) became ready
      if (action?.name === "becomeReady") {
        console.log("Event: Player " + action.playerId + " is ready")
        ///
      }

      // someone left
      if (event?.name === "playerLeft") {
        console.log("Event: Player " + event.params.playerId + " has left")
        ///
      }
    },
  })
}
