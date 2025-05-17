import ReactDOM from "react-dom/client"
import Sketch from "react-p5"

import GameClient from "./scripts/GameClient.ts"

function App() {
  const gameClient = new GameClient()

  return (
    <Sketch
      setup={gameClient.setup}
      draw={gameClient.draw}
      touchStarted={gameClient.touchStarted}
      touchEnded={gameClient.touchEnded}
      windowResized={gameClient.windowResized}
    />
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
)
