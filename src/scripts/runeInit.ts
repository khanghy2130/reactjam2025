import Gameplay from "./Gameplay"

export default function runeInit(gameplay: Gameplay) {
  // should not start gameplay until onChange is called
  Rune.initClient({
    // yourPlayerId is undefined for spectators
    onChange: ({ game, action, yourPlayerId }) => {},
  })
}
