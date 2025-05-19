import type { SketchProps } from "react-p5"
import type P5 from "react-p5/node_modules/@types/p5/index.d.ts"

import Render from "./Render.ts"
import Gameplay from "./Gameplay.ts"
import runeInit from "./runeInit.ts"

import sheetPath from "../assets/sheet.webp"
import fontPath from "../assets/font.ttf"
import createButtons from "./createButtons.ts"

export default class GameClient {
  preload: SketchProps["preload"]
  setup: SketchProps["setup"]
  draw: SketchProps["draw"]
  touchStarted: SketchProps["draw"]
  touchEnded: SketchProps["draw"]
  windowResized: SketchProps["windowResized"]

  // rescaled mouse position (0 to 500 width)
  mx: number
  my: number
  touchCountdown: number
  isPressing: boolean

  constructor() {
    this.mx = 0
    this.my = 0
    this.touchCountdown = 0
    this.isPressing = false

    const render = new Render(this)
    const gameplay = new Gameplay(this)

    let globalFont: P5.Font | undefined
    this.preload = (p5) => {
      render.sheet = p5.loadImage(sheetPath)
      globalFont = p5.loadFont(fontPath)
    }

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
      canvasParentRef.innerHTML = "" // clear previous canvas
      const [w, h] = getCanvasSize()
      p5.createCanvas(w, h).parent(canvasParentRef)

      // p5 configs
      p5.textAlign(p5.CENTER, p5.CENTER)
      p5.rectMode(p5.CENTER)
      p5.imageMode(p5.CENTER)
      p5.angleMode(p5.DEGREES)
      p5.strokeJoin(p5.ROUND)
      if (globalFont) p5.textFont(globalFont)

      // connect instances
      render.p5 = p5
      gameplay.render = render

      createButtons(p5, gameplay, render)
      runeInit(gameplay) // start game
    }

    this.draw = (p5) => {
      // rescale canvas and mouse position
      this.mx = (p5.mouseX * 500) / p5.width
      this.my = (p5.mouseY * 500) / p5.width
      p5.scale(p5.width / 500)

      this.touchCountdown-- // update

      p5.clear(0, 0, 0, 0)
      render.draw()
    }

    this.touchStarted = () => {
      // prevent clicking too fast
      if (this.touchCountdown > 0) return
      else this.touchCountdown = 5
      this.isPressing = true
      render.click()
    }

    this.touchEnded = () => {
      // this event is called many times, no other action should be here beside to end pressing
      this.isPressing = false
    }
  }
}
