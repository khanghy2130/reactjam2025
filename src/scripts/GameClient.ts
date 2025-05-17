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

  myVar: number

  constructor() {
    this.myVar = 0

    const render = new Render(this)

    const HEIGHT_RATIO = 1.6
    this.windowResized = (p5) => {
      const CANVAS_WIDTH = Math.min(
        document.documentElement.clientWidth,
        document.documentElement.clientHeight / HEIGHT_RATIO
      )
      p5.resizeCanvas(
        CANVAS_WIDTH,
        Math.max(
          CANVAS_WIDTH * HEIGHT_RATIO,
          document.documentElement.clientHeight
        )
      )
    }

    this.setup = (p5, canvasParentRef) => {
      const CANVAS_WIDTH = Math.min(
        document.documentElement.clientWidth,
        document.documentElement.clientHeight / HEIGHT_RATIO
      )
      p5.createCanvas(
        CANVAS_WIDTH,
        Math.max(
          CANVAS_WIDTH * HEIGHT_RATIO,
          document.documentElement.clientHeight
        )
      ).parent(canvasParentRef)

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
      p5.background(100)
      render.drawSquare(p5)
      this.myVar = p5.mouseX
    }

    this.touchStarted = (p5) => {}
    this.touchEnded = (p5) => {}
  }
}
