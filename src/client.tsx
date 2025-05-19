import ReactDOM from "react-dom/client"
import Sketch from "react-p5"

import GameClient from "./scripts/GameClient.ts"
import { useRef, StrictMode } from "react"

function App() {
  const gameClientRef = useRef<GameClient>()

  // Only instantiate once
  if (!gameClientRef.current) {
    gameClientRef.current = new GameClient()
  }
  const gameClient = gameClientRef.current

  return (
    <Sketch
      preload={gameClient.preload}
      setup={gameClient.setup}
      draw={gameClient.draw}
      touchStarted={gameClient.touchStarted}
      touchEnded={gameClient.touchEnded}
      windowResized={gameClient.windowResized}
    />
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
