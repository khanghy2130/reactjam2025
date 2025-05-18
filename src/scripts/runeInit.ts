import Gameplay from "./Gameplay"

export default function runeInit(gameplay: Gameplay) {
  // should not start gameplay until onChange is called
  Rune.initClient({
    // yourPlayerId is undefined for spectators
    //// rune restart button probably needs help resetting client state (when round = 1)
    onChange: ({ game, action, yourPlayerId }) => {},
  })
}
