import type { SketchProps } from "react-p5"
import type P5 from "react-p5/node_modules/@types/p5/index.d.ts"

import { GameState } from "../logic.ts"
import Render from "./Render.ts"

export default class GameClient {
  setup: SketchProps["setup"]
  draw: SketchProps["draw"]
  touchStarted: SketchProps["draw"]
  touchEnded: SketchProps["draw"]
  windowResized: SketchProps["windowResized"]

  // rescaled mouse position (0 to 500 width)
  mx: number
  my: number

  constructor() {
    this.mx = 0
    this.my = 0

    const render = new Render(this)

    const getCanvasSize = () => {
      const HEIGHT_RATIO = 1.6
      const CANVAS_WIDTH = Math.min(
        document.documentElement.clientWidth,
        document.documentElement.clientHeight / HEIGHT_RATIO
      )
      return [
        CANVAS_WIDTH,
        Math.max(
          CANVAS_WIDTH * HEIGHT_RATIO,
          document.documentElement.clientHeight
        ),
      ]
    }

    this.windowResized = (p5) => {
      const [w, h] = getCanvasSize()
      p5.resizeCanvas(w, h)
    }

    this.setup = (p5, canvasParentRef) => {
      const [w, h] = getCanvasSize()
      p5.createCanvas(w, h).parent(canvasParentRef)

      // sketch configs
      p5.textAlign(p5.CENTER, p5.CENTER)
      p5.rectMode(p5.CENTER)
      p5.imageMode(p5.CENTER)
      p5.angleMode(p5.DEGREES)
      p5.strokeJoin(p5.ROUND)

      // this ends Rune initial loading
      // should not start gameplay until onChange is called
      Rune.initClient({
        onChange: ({ game, action, yourPlayerId }) => {},
      })
    }

    this.draw = (p5) => {
      // rescale mouse position
      this.mx = (p5.mouseX * 500) / p5.width
      this.my = (p5.mouseY * 500) / p5.width
      p5.scale(p5.width / 500)
      p5.background(100)
      p5.rect(this.mx, this.my, 100, 100)
    }

    this.touchStarted = (p5) => {}
    this.touchEnded = (p5) => {}
  }
}
