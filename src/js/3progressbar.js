class ProgressBar {
  constructor({ box, bar, circle, direction }) {
    this.box = box
    this.bar = bar
    this.direction = direction
    this.circle = circle
    this.flag = true
    this.ofs = this.direction == 'x' ? 'left' : 'top'
    this.ofs1 = this.direction == 'x' ? 'offsetLeft' : 'offsetTop'
    this.client = this.direction == 'x' ? 'clientWidth' : 'clientHeight'
    this.client1 = this.direction == 'x' ? 'clientX' : 'clientY'
    this.or = this.direction == 'x' ? 'width' : 'height'
    this.circle.onmousedown = this.mousedown.bind(this)
    this.box.addEventListener('click', this.boxClick.bind(this))
  }
  boxClick(e){
    let offset = e[this.client1] - this.box.getBoundingClientRect()[this.ofs]
    offset < 0 && (offset = 0)
    offset > this.box[this.client] && (offset = this.box[this.client])
    play.progress(this.direction,offset)
    this.amend(e[this.client1] - this.box.getBoundingClientRect()[this.ofs])
  }
  mousedown(e) {
    let client = e[this.client1]
    let cOffset = this.circle[this.ofs1]
    this.flag = false
    document.onmousemove = (e) => {
      this.amend(cOffset + (e[this.client1] - client))
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
    offset > this.box[this.client] && (offset = this.box[this.client])
    this.circle.style[this.ofs] = offset + 'px'
    this.bar.style[this.or] = (this.ofs == 'top' ? 100 - offset : offset) + 'px'
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