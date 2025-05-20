import type P5 from "react-p5/node_modules/@types/p5/index.d.ts"

function easeOutElastic(x: number, p5: P5) {
  const c4 = (2 * 180) / 3
  return x === 0
    ? 0
    : x === 1
      ? 1
      : p5.pow(2, -10 * x) * p5.sin((x * 10 - 0.75) * c4) + 1
}

export default class Button {
  animateProgress: number // 0 to 1
  x: number
  y: number
  w: number
  h: number
  bc: P5.Color
  renderContent: () => void
  clicked: () => void

  constructor(
    [x, y, w, h]: [number, number, number, number],
    bc: P5.Color,
    renderContent: () => void,
    clicked: () => void
  ) {
    this.animateProgress = 1
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.bc = bc
    this.renderContent = renderContent
    this.clicked = () => {
      this.animateProgress = 0 // start animation
      clicked()
    }
  }

  checkHover(mx: number, my: number) {
    const hw = this.w / 2,
      hh = this.h / 2
    return (
      mx > this.x - hw &&
      mx < this.x + hw &&
      my > this.y - hh &&
      my < this.y + hh
    )
  }

  render(p5: P5) {
    if (this.animateProgress < 1) {
      this.animateProgress = Math.min(this.animateProgress + 0.01, 1)
    }
    // render button
    p5.push()
    p5.translate(this.x, this.y)
    if (this.animateProgress < 0.08) {
      this.animateProgress = 0.08
    }
    let scaleFactor = easeOutElastic(this.animateProgress, p5)
    scaleFactor *= 0.3 // animated range
    p5.scale(0.7 + scaleFactor, 1.3 - scaleFactor) // 1 - or + range

    p5.noStroke()
    p5.fill(this.bc)
    p5.rect(0, 0, this.w, this.h, 8)
    this.renderContent()
    p5.pop()
  }
}
