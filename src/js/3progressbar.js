class ProgressBar {
  constructor({ box, bar, circle, direction }) {
    this.box = box
    this.bar = bar
    this.direction = direction
    this.circle = circle
    this.flag = true
    this.off = this.direction == 'x' ? 'left' : 'top'
    this.off1 = this.direction == 'x' ? 'offsetLeft' : 'offsetTop'
    this.off2 = this.direction == 'x' ? 'clientWidth' : 'clientHeight'
    this.off3 = this.direction == 'x' ? 'width' : 'height'
    this.off4 = this.direction == 'x' ? 'clientX' : 'clientY'
    this.circle.onmousedown = this.mousedown.bind(this)
    this.box.addEventListener('click', this.boxClick.bind(this))
  }
  boxClick(e){
    let offset = e[this.off4] - this.box.getBoundingClientRect()[this.off]
    offset < 0 && (offset = 0)
    offset > this.box[this.off2] && (offset = this.box[this.off2])
    play.progress(this.direction,offset)
    this.amend(e[this.off4] - this.box.getBoundingClientRect()[this.off])
  }
  mousedown(e) {
    let client = e[this.off4]
    let cOffset = this.circle[this.off1]
    this.flag = false
    document.onmousemove = (e) => {
      this.amend(cOffset + (e[this.off4] - client))
      return 
    }
    document.onmouseup = (e) => {
      document.onmousemove = null
      document.onmouseup = null;
      this.boxClick(e)
      this.flag = true
    }
  }
  amend(offset){
    offset < 0 && (offset = 0)
    offset > this.box[this.off2] && (offset = this.box[this.off2])
    this.circle.style[this.off] = offset + 'px'
    this.bar.style[this.off3] = (this.off == 'top' ? 100 - offset : offset) + 'px'
  }
}
let auidoProgress = new ProgressBar({
  box: $('.progress'),
  bar: $('.progress-w'),
  circle: document.querySelector('.progress-x'),
  direction: 'x'
})

let volumeProgress = new ProgressBar({
  box: $('.sY'),
  bar: $('.sY-H'),
  circle: $('.sY-Y'),
  direction: 'y'
})