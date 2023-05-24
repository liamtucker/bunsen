// FIXME: everything that is not, could be called out of anywhere, meaning it could be a global variable
// function getScroll() {

//   const docHeight = document.body.clientHeight

//   var sy, d = document,
//     r = d.documentElement,
//     vh = d.documentElement.clientHeight,
//     b = d.body;
//   sy = r.scrollTop || b.scrollTop || 0;

//   // normalize values to 0 - 1
//   sy /= (docHeight - vh)
//   return sy;

// }

// const lerp = (x, y, a) => x * (1 - a) + y * a;
let _scrollZoom = 0

// setInterval(() => {
//   // make value from -1 to 1
//   const a = ((getScroll() - .5) * 2)
//   const b = a * 500
//   // smooth out value
//   _scrollZoom = lerp( _scrollZoom, b, 0.05)
//   console.log(_scrollZoom)
// }, 10)



let bunsenSketch = function (p) {
  // FIXME: everything that is within bunsenSketch object is local to itself and can not be called outside of it

  let _rotateLineAngle = 0
  let _rotateIncrease = Math.PI / 2 * 4 - (Math.PI / 2 - Math.PI / 4)
  let _spiralLength

  //————————————————————————————————————————————————————————————————————————————————— Main parameters
  //————————————————————————————————————————————————————————————————————————————————— Main parameters
  //————————————————————————————————————————————————————————————————————————————————— Main parameters
  // TODO: dim values
  const _dimFromTo = [
    [230, 50],
    [50, 25],
    [25, 15]
  ]

  // TODO: control colors
  const _params = {
    // on white background
    // color: [
    //   [230, 230, 230],// bg color, removed to be controlled within webflow
    //   [25, 25, 25, 255], // if you want to change the dim version go down and change teh animation one
    //   [25, 25, 25, 50],
    //   [25, 25, 25, 25],
    // ],

    // on dark background
    color: [
      [25, 25, 25], // bg color, removed to be controlled within webflow
      [230, 230, 230, _dimFromTo[0][0]], // if you want to change the dim version go down and change teh animation one
      [230, 230, 230, _dimFromTo[1][0]],
      [230, 230, 230, _dimFromTo[2][0]],
    ],
    // if you want hover clors to be different comment the line below and change these colors
    // hoverColor: [
    //   // [230, 230, 230],
    //   // [25, 25, 25, 255],
    //   // [25, 25, 25, 50],
    //   // [25, 25, 25, 25],
    // ],
    colorGradient: [
      [4, 89, 254],
      [255, 90, 243],
      [255, 122, 0]
    ],

    // stable graphics
    rotateLineAngle: 0,
    minCircleSize: 15,
    maxCircleSize: 250,
    totalObjcts: 24,
    spiralZoom: null, // is controlled in code
    extendedLineQuantity: 0,
    circleLineQuantity: 0,

    // animation
    offsetPoint: 1,
    totalFrames: 300,
    animationType: "line" // point goes on line or on the circle
  };

  // FIXME: copy hover Color
  _params.hoverColor = [
    [_params.color[0].slice()],
    [_params.color[1].slice()],
    [_params.color[2].slice()],
    [_params.color[2].slice()]
  ]

  //————————————————————————————————————————————————————————————————————————————————— Main parameters END
  //————————————————————————————————————————————————————————————————————————————————— Main parameters END
  //————————————————————————————————————————————————————————————————————————————————— Main parameters END

  // define variables
  let _gradient

  let _myObjcts

  // TODO: control animation
  // animation timing
  let _totalStartFrames = 60 * 3
  let _totalLoopAnimation = 60 * 8
  let _totalDimFrames = 60 * 4 // to dim from full to dimmed version
  let _currentFrame = 0
  let _loopFrame = 0

  // trail
  let _totalPointLength = 15 // trail length

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    // recreate graphics to fit the screen
    createMyGraphics()
  }

  //————————————————————————————————————————————————————————————————————————————————— Setup
  //————————————————————————————————————————————————————————————————————————————————— Setup
  //————————————————————————————————————————————————————————————————————————————————— Setup
  p.setup = function () {
    const cnv = p.createCanvas(p.windowWidth, p.windowHeight);
    cnv.parent("#myCanvas")

    p.strokeCap(p.SQUARE);

    // createGraphics
    createMyGraphics()

    p.frameRate(60)

    p.textSize(12)
  }

  //————————————————————————————————————————————————————————————————————————————————— Setup END
  //————————————————————————————————————————————————————————————————————————————————— Setup END
  //————————————————————————————————————————————————————————————————————————————————— Setup END

  function createMyGraphics() {
    _myObjcts = []

    //—————— generate color gradient
    _gradient = generateColorGradient(_params.colorGradient, _params.totalObjcts)

    //——————————————————————————————————————————————————————
    //—————— generateGraphics graphics
    for (let i = 0; i < _params.totalObjcts; i++) {
      // circle
      const angle = p.map(i, 0, _params.totalObjcts - 1, 0, p.TWO_PI - p.PI / 2 + _spiralLength)
      const rPos = p.map(i, 0, _params.totalObjcts, _params.spiralZoom, 15)
      const x = p.width / 2 + rPos * p.cos(angle)
      const y = p.height / 2 + rPos * p.sin(angle)

      const r = p.map(i, 0, _params.totalObjcts, _params.maxCircleSize, _params.minCircleSize)
      // circle line
      const lineAngle = p.map(i, 0, _params.totalObjcts - 1, p.PI / 2 - p.PI / 4 + _rotateLineAngle, p.PI / 2 - p.PI / 4 + _rotateLineAngle + _rotateIncrease)
      const v1 = p.createVector(x - r / 2, y)
      const v2 = p.createVector(x, y)
      const v3 = p5.Vector.sub(v1, v2)
      const v4 = v3.copy()
      v3.rotate(0 + lineAngle)
      v4.rotate(-p.PI + lineAngle)
      v3.add(v2)
      v4.add(v2)

      const x1 = v3.x
      const x2 = v4.x
      const y1 = v3.y
      const y2 = v4.y

      // add to objects
      _myObjcts.push(new myObjc(x, y, r, x1, y1, x2, y2, i))

    }
  }

  //————————————————————————————————————————————————————————————————————————————————— Draw
  //————————————————————————————————————————————————————————————————————————————————— Draw
  //————————————————————————————————————————————————————————————————————————————————— Draw
  p.draw = function () {
    // p.background(..._params.color[0]);
    p.clear()
    // console.log(p.frameRate())

    //——————————————————————————————————————————————————————
    //—————— animation
    if (_currentFrame < _totalStartFrames) {
      // startAnimation
      let percent = _currentFrame / (_totalStartFrames - 1)
      percent = normalizedErf(percent)
      // TODO: here you can change the parameters 
      _params.spiralZoom = p.map(percent, 0, 1, 0, 700) + _scrollZoom
      _spiralLength = p.map(percent, 0, 1, 0, 3)
      _currentFrame++
    } else {
      // loop animation
      const percent = (_loopFrame % _totalLoopAnimation) / (_totalLoopAnimation - 1)
      _params.spiralZoom = p.map(p.sin(percent * p.TWO_PI + p.PI / 2), -1, 1, 650, 700) + _scrollZoom
      _spiralLength = p.map(p.cos(percent * p.TWO_PI), -1, 1, 2.8, 3)
      _loopFrame++

      // dim color
      if (_loopFrame < _totalDimFrames) {
        // TODO: dimmed colors
        _params.color[1][3] = p.map(_loopFrame, 0, _totalDimFrames, _dimFromTo[0][0], _dimFromTo[0][1])
        _params.color[2][3] = p.map(_loopFrame, 0, _totalDimFrames, _dimFromTo[1][0], _dimFromTo[1][1])
        _params.color[3][3] = p.map(_loopFrame, 0, _totalDimFrames, _dimFromTo[2][0], _dimFromTo[2][1])
        _loopFrame++
      }
    }
    //——————————————————————————————————————————————————————
    //—————— draw graphics
    // from the list add lines that goes trough other lines
    // go trough all objects except the last two ones

    for (let i = 0; i < _myObjcts.length; i++) {
      const mo1 = _myObjcts[i]
      mo1.calculatePosition()
      mo1.calculateExtendedLine()
      mo1.calculateOffLine()
    }

    // check mouse Interaction
    _intersectionPoint = null
    _intersectionLine = null
    const mouseR = 15;
    let lastHovered = null
    for (let i = 0; i < _myObjcts.length; i++) {
      const mo = _myObjcts[i]
      const A = p.createVector(mo.x1, mo.y1)
      const A2 = p.createVector(mo.x2, mo.y2)
      const B = mo.extendedLine
      const B2 = p.createVector(p.width / 2, p.height / 2)
      const C = p.createVector(p.mouseX, p.mouseY)
      const d1 = distanceSegmentToPoint(A, B, C)
      const d2 = distanceSegmentToPoint(A2, B2, C)

      // reset hover
      mo.hovered = false
      // with extended line
      if (d1 < mouseR) {
        _intersectionPoint = getIntersectionPoint(A, B, C)
        if (lastHovered != null) lastHovered.hovered = false
        mo.hovered = true
        lastHovered = mo
        _intersectionLine = "Extended"
      }
      // with center line
      if (d2 < mouseR) {
        _intersectionPoint = getIntersectionPoint(A2, B2, C)
        if (lastHovered != null) lastHovered.hovered = false
        mo.hovered = true
        lastHovered = mo
        _intersectionLine = "Center"
      }
    }

    // circle(mouseX, mouseY, mouseR * 2)
    if (_intersectionPoint != null) {
      p.noStroke()
      p.fill(lastHovered.hoveredColor)
      p.circle(_intersectionPoint.x, _intersectionPoint.y, 2 * 2)

      p.fill(..._params.hoverColor[1])
      p.text(`${p.floor(_intersectionPoint.x)} ${p.floor(_intersectionPoint.y)}`, _intersectionPoint.x + 4, _intersectionPoint.y - 4)

      p.stroke(..._params.hoverColor[2])
      setLineDash([3])
      p.line(0, _intersectionPoint.y, p.width, _intersectionPoint.y)
      p.line(_intersectionPoint.x, 0, _intersectionPoint.x, p.height)
      setLineDash([0])
    } else {
      // mouse
      const lsize = 20
      p.noStroke()
      p.fill(..._params.hoverColor[1])
      p.text(`${p.floor(p.mouseY)}`, 0 + lsize, p.mouseY)
      p.text(`${p.floor(p.mouseY)}`, p.width - lsize - p.textWidth(p.floor(p.mouseY)), p.mouseY)
      p.text(`${p.floor(p.mouseX)}`, p.mouseX, lsize + p.textAscent(p.mouseY) * 0.8)
      p.text(`${p.floor(p.mouseX)}`, p.mouseX, p.height - lsize)

      p.stroke(..._params.hoverColor[1])
      p.noFill()
      p.line(0, p.mouseY, lsize, p.mouseY)
      p.line(p.width, p.mouseY, p.width - lsize, p.mouseY)
      p.line(p.mouseX, 0, p.mouseX, lsize)
      p.line(p.mouseX, p.height, p.mouseX, p.height - lsize)
    }

    // update graphics
    for (let i = 0; i < _myObjcts.length; i++) {
      const mo = _myObjcts[i]
      mo.update()
    }

    // show graphics
    for (let i = 0; i < _myObjcts.length; i++) {
      const mo = _myObjcts[i]
      mo.show(this)
    }
  }
  //————————————————————————————————————————————————————————————————————————————————— Draw END
  //————————————————————————————————————————————————————————————————————————————————— Draw END
  //————————————————————————————————————————————————————————————————————————————————— Draw END

  function setLineDash(list) {
    p.drawingContext.setLineDash(list);
  }

  // ————————————————————————————————————————————————————————————————————————————————— Colors
  // color gradient
  function generateColorGradient(colors, total) {
    // color arrays to colors
    for (let i = 0; i < colors.length; i++) {
      const c = colors[i]
      colors[i] = p.color(c)
    }

    const colorStep = Math.ceil(total / (colors.length - 1.0));
    const colorGradient = []
    for (let i = 0; i < total; i++) {
      // main color algorithm
      for (let n = 0; n < colors.length; n++) {
        if (i >= colorStep * (n) && i < colorStep * (n + 1)) {
          const c1 = colors[n]
          const c2 = colors[n + 1]
          const amt = p.map(i, colorStep * (n), colorStep * (n + 1) - 1, 0, 1.)
          const c = p.lerpColor(c1, c2, amt);
          colorGradient.push(c)
        }
      }
    }
    return colorGradient
  }

  function normalizedErf(_x) {
    var erfBound = 2.0; // set bounds for artificial "normalization"
    var erfBoundNorm = 0.99532226501; // this = erf(2.0), i.e., erf(erfBound)
    var z = p.map(_x, 0.0, 1.0, 0 - erfBound, erfBound);

    var z2 = z * z;
    var a = (8.0 * (p.PI - 3.0)) / ((3 * p.PI) * (4.0 - p.PI));
    var _y = p.sqrt(1.0 - p.exp(0 - z2 * ((a * z2 + 4.0 / p.PI) / (a * z2 + 1.0))));
    if (z < 0.0) _y = 0 - _y;

    _y /= erfBoundNorm;
    _y = (_y + 1.0) / 2.0;

    return (_y);
  }

  // ————————————————————————————————————————————————————————————————————————————————— Custom math
  // ————————————————————————————————————————————————————————————————————————————————— Custom math
  // ————————————————————————————————————————————————————————————————————————————————— Custom math
  let _intersectionPoint
  let _intersectionLine

  // Define some common functions for working with vectors
  const add = (a, b) => ({
    x: a.x + b.x,
    y: a.y + b.y
  });
  const sub = (a, b) => ({
    x: a.x - b.x,
    y: a.y - b.y
  });
  const dot = (a, b) => a.x * b.x + a.y * b.y;
  const hypot2 = (a, b) => dot(sub(a, b), sub(a, b));

  // Function for projecting some vector a onto b
  function proj(a, b) {
    const k = dot(a, b) / dot(b, b);
    return {
      x: k * b.x,
      y: k * b.y
    };
  }

  function getIntersectionPoint(A, B, C) {
    // Compute vectors AC and AB
    const AC = sub(C, A);
    const AB = sub(B, A);

    // Get point D by taking the projection of AC onto AB then adding the offset of A
    const D = add(proj(AC, AB), A);
    return D;
  }

  function distanceSegmentToPoint(A, B, C) {
    // Compute vectors AC and AB
    const AC = sub(C, A);
    const AB = sub(B, A);

    // Get point D by taking the projection of AC onto AB then adding the offset of A
    const D = add(proj(AC, AB), A);

    const AD = sub(D, A);
    // D might not be on AB so calculate k of D down AB (aka solve AD = k * AB)
    // We can use either component, but choose larger value to reduce the chance of dividing by zero
    const k = Math.abs(AB.x) > Math.abs(AB.y) ? AD.x / AB.x : AD.y / AB.y;

    // Check if D is off either end of the line segment
    if (k <= 0.0) {
      return Math.sqrt(hypot2(C, A));
    } else if (k >= 1.0) {
      return Math.sqrt(hypot2(C, B));
    }
    return Math.sqrt(hypot2(C, D));
  }
  // ————————————————————————————————————————————————————————————————————————————————— Custom math END
  // ————————————————————————————————————————————————————————————————————————————————— Custom math END
  // ————————————————————————————————————————————————————————————————————————————————— Custom math END

  // ————————————————————————————————————————————————————————————————————————————————— myObjc class
  // ————————————————————————————————————————————————————————————————————————————————— myObjc class
  // ————————————————————————————————————————————————————————————————————————————————— myObjc class
  class myObjc {
    constructor(x, y, r, x1, y1, x2, y2, idx) {
      this.x = x, this.y = y, this.r = r;
      this.x1 = x1, this.y1 = y1, this.y2 = y2, this.x2 = x2;
      this.idx = idx

      // center point
      this.cx = p.width / 2
      this.cy = p.height / 2

      // off from center line
      this.offX = null
      this.offY = null

      // point position
      this.pointPos = p.createVector(this.x1, this.y1)
      this.pointSize = 4
      this.pointTrail = []

      // extended line
      this.extendedLine = p.createVector(0, 0)

      // hovered
      this.hovered = false
      this.hoveredColor = _gradient[this.idx]
      // this.hoveredColor = map(this.idx, 0, params.totalObjcts, 0, 255)
    }

    // calculate
    calculatePosition() {
      // circle
      const angle = p.map(this.idx, 0, _params.totalObjcts - 1, 0, p.TWO_PI - p.PI / 2 + _spiralLength)
      const rPos = p.map(this.idx, 0, _params.totalObjcts, _params.spiralZoom, 15)
      this.x = p.width / 2 + rPos * p.cos(angle)
      this.y = p.height / 2 + rPos * p.sin(angle)

      const r = p.map(this.idx, 0, _params.totalObjcts, _params.maxCircleSize, _params.minCircleSize)
      // circle line
      const lineAngle = p.map(this.idx, 0, _params.totalObjcts - 1, p.PI / 2 - p.PI / 4 + _rotateLineAngle, p.PI / 2 - p.PI / 4 + _rotateLineAngle + _rotateIncrease)
      const v1 = p.createVector(this.x - r / 2, this.y)
      const v2 = p.createVector(this.x, this.y)
      const v3 = p5.Vector.sub(v1, v2)
      const v4 = v3.copy()
      v3.rotate(0 + lineAngle)
      v4.rotate(-p.PI + lineAngle)
      v3.add(v2)
      v4.add(v2)

      this.x1 = v3.x
      this.x2 = v4.x
      this.y1 = v3.y
      this.y2 = v4.y
    }

    calculateExtendedLine() {
      const v1 = p.createVector(this.x1, this.y1)
      const v2 = p.createVector(this.x2, this.y2)
      const v3 = p5.Vector.sub(v2, v1)
      v3.setMag(10000)
      v3.add(v2)

      this.extendedLine = p.createVector(v3.x, v3.y)
    }

    calculateOffLine() {
      const v1 = p.createVector(this.cx, this.cy)
      const v2 = p.createVector(this.x1, this.y1)
      const v3 = p5.Vector.sub(v2, v1)
      v3.setMag(10000)
      v3.add(v1)

      this.offX = v3.x
      this.offY = v3.y
    }

    // update
    update() {
      this.updatePoint()
    }

    updatePoint() {
      const percent = ((p.frameCount + this.idx * _params.offsetPoint) % _params.totalFrames) / _params.totalFrames
      if (_params.animationType == "line") {
        // if you do not want to have an animation change change the lines that are commented
        this.pointPos.x = p.map(p.sin(percent * p.TWO_PI), -1, 1, this.x1, this.x2)
        this.pointPos.y = p.map(p.sin(percent * p.TWO_PI), -1, 1, this.y1, this.y2)

        // These lines to make point to be in the center of everything
        // this.pointPos.x = (this.x2 + this.x1) / 2
        // this.pointPos.y = (this.y2 + this.y1) / 2
      } else if (_params.animationType == "circle") {
        this.pointPos.x = this.x + this.r * p.sin(percent * p.TWO_PI) / 2
        this.pointPos.y = this.y + this.r * p.cos(percent * p.TWO_PI) / 2
      }

      // add trail
      if (this.pointTrail.length < _totalPointLength && _currentFrame < _totalStartFrames) {
        this.pointTrail.push(this.pointPos.copy())
      } else if (this.pointTrail.length > 0) {
        this.pointTrail.push(this.pointPos.copy())
        this.pointTrail.shift()
        this.pointTrail.shift()
      } else {
        // after finishing color animation
      }

    }

    // show
    show(cnv) {
      cnv.noFill()
      if (this.hovered) {
        cnv.stroke(..._params.hoverColor[2])
        this.showCircle(cnv)

        // cnv.stroke(..._params.hoverColor[3])
        if (_intersectionLine == "Center") {
          cnv.stroke(this.hoveredColor)
        } else {
          cnv.stroke(..._params.color[3])
        }
        this.showCenterLine(cnv)

        // cnv.stroke(..._params.hoverColor[3])
        if (_intersectionLine == "Extended") {
          cnv.stroke(this.hoveredColor)
        } else {
          cnv.stroke(..._params.color[3])
        }
        this.showExtendedLine(cnv)

        // cnv.stroke(..._params.hoverColor[1])
        if (_intersectionLine == "Extended") {
          cnv.stroke(this.hoveredColor)
        } else {
          cnv.stroke(..._params.color[1])
        }
        this.showCircleLine(cnv)

        if (_params.animationType != "none") {
          cnv.noStroke()
          // cnv.fill(..._params.hoverColor[1])
          if (_intersectionLine == "Extended") {
            cnv.fill(this.hoveredColor)
          } else {
            cnv.fill(..._params.color[1])
          }
          this.showMovingPoint(cnv)

          cnv.noFill()
          this.showTrail(cnv)
          cnv.strokeWeight(1)
        }
      } else {
        cnv.stroke(..._params.color[2])
        this.showCircle(cnv)

        cnv.stroke(..._params.color[3])
        this.showCenterLine(cnv)

        cnv.stroke(..._params.color[3])
        this.showExtendedLine(cnv)

        cnv.stroke(..._params.color[1])
        this.showCircleLine(cnv)

        if (_params.animationType != "none") {
          cnv.noStroke()
          cnv.fill(..._params.color[1])
          this.showMovingPoint(cnv)

          cnv.noFill()
          this.showTrail(cnv)
          cnv.strokeWeight(1)
        }
      }

    }

    showTrail(cnv) {
      cnv.stroke(_gradient[this.idx])
      cnv.strokeWeight(1)
      for (let i = 0; i < this.pointTrail.length - 1; i++) {
        const pt1 = this.pointTrail[i]
        const pt2 = this.pointTrail[i + 1]
        cnv.line(pt1.x, pt1.y, pt2.x, pt2.y)
      }
    }

    showMovingPoint(cnv) {
      cnv.circle(this.pointPos.x, this.pointPos.y, this.pointSize)
    }

    showExtendedLine(cnv) {
      if (this.idx < _myObjcts.length - _params.extendedLineQuantity) {
        cnv.line(this.x2, this.y2, this.extendedLine.x, this.extendedLine.y)
      }
    }

    showCenterLine(cnv) {
      if (this.idx > _params.circleLineQuantity) cnv.line(this.x2, this.y2, this.cx, this.cy)
    }

    showCircleLine(cnv) {
      cnv.line(this.x1, this.y1, this.x2, this.y2)
    }

    showCircle(cnv) {
      cnv.circle(this.x, this.y, this.r)
    }
  }
}

new p5(bunsenSketch)