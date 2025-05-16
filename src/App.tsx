import Sketch from "react-p5"
import type { SketchProps } from "react-p5"
import type P5 from "react-p5/node_modules/@types/p5/index.d.ts"

import { GameState } from "./logic.ts"
import { ClientState } from "./client_scripts/ClientState.i.ts"

function App() {
  const clientState: ClientState = {
    string1: "hello",
  }

  const setup: SketchProps["setup"] = (p5, canvasParentRef) => {
    console.log(22)
    p5.createCanvas(400, 400).parent(canvasParentRef)

    // stop Rune initial loading
    Rune.initClient({
      onChange: ({ game, action, yourPlayerId }) => {},
    })
  }

  const draw: SketchProps["draw"] = (p5) => {
    p5.background(100)
    p5.ellipse(p5.width / 2, p5.height / 2, 50, 50)
  }

  return <Sketch setup={setup} draw={draw} />
}

export default App
