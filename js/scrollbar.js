//自动生成滚动条
class ScrollBar {
    constructor({div,width = 10,bgColor = 'rgba(255, 255, 255, 0.242)'}) {
        this.newDiv = div;
        this.width = width;
        this.bgColor = bgColor;
        this.conMoveTarget = 0;
        this.scrMoveTarget = 0;
        this.num = 0;
        this.timer = null;
    }
    init() {
        this.createDiv()
        this.scrollBarWheel()
        this.scrollBarDown()
    }
    createDiv() {
        if(this.newDiv.children[1]) this.newDiv.removeChild(this.newDiv.children[1]);
        this.newDiv.style.position = 'relative';
        this.newDiv.style.overflow = 'hidden';
        this.newDiv.children[0].style.position = 'absolute';
        let scrollDiv = document.createElement('div');
        scrollDiv.style.position = 'absolute';
        scrollDiv.style.background = this.bgColor; 
        this.newDiv.appendChild(scrollDiv);
        scrollDiv.style.width = this.width + 'px';
        scrollDiv.style.borderRadius = '10px'
        scrollDiv.style.right = 0+'px';
        scrollDiv.style.cursor = 'pointer';
        this.updateTop()
    }
    divHeight() {
        let contentHeight;
        if (this.newDiv.children[0].offsetHeight < this.newDiv.offsetHeight) {
            this.newDiv.children[1].style.display = 'none';
            this.newDiv.children[0].style.position = 'static';
        } else {
            this.newDiv.children[1].style.display = 'block';
            let oH = this.newDiv.offsetHeight / this.newDiv.children[0].offsetHeight * this.newDiv.offsetHeight;
            contentHeight = oH + 'px';
        }
        return contentHeight;
    }
    updateTop(){
        this.newDiv.children[1].style.height = this.divHeight()
        let wrapTop = this.conMoveTarget < -(this.newDiv.children[0].offsetHeight - this.newDiv.offsetHeight) ? -(this.newDiv.children[0].offsetHeight - this.newDiv.offsetHeight) : this.conMoveTarget;
        this.newDiv.children[0].style.top = wrapTop + 'px';
        let scrTop = this.scrMoveTarget > this.newDiv.offsetHeight - this.newDiv.children[1].offsetHeight ? this.newDiv.offsetHeight - this.newDiv.children[1].offsetHeight : this.scrMoveTarget
        this.newDiv.children[1].style.top = scrTop +'px';
    }
    scrollBarWheel() {
        this.newDiv.addEventListener('wheel', (event) => {
            let e = event || window.event;   
            e.preventDefault()
            this.num = this.newDiv.children[0].offsetTop;
            clearInterval(this.timer)
            this.timer = setInterval(() => {
                if (e.wheelDelta < 0) {
                    this.conMoveTarget -= 60;
                    if (this.conMoveTarget < this.num - 100) {
                        clearInterval(this.timer)
                    }
                    if (this.conMoveTarget < -(this.newDiv.children[0].offsetHeight - this.newDiv.offsetHeight)) {
                        this.conMoveTarget = -(this.newDiv.children[0].offsetHeight - this.newDiv.offsetHeight);
                        clearInterval(this.timer);
                    }
                }
                if (e.wheelDelta > 0) {
                    this.conMoveTarget += 60;
                    if (this.conMoveTarget > this.num + 100) {
                        clearInterval(this.timer)
                    }
                    if (this.conMoveTarget > 0) {
                        this.conMoveTarget = 0;
                        clearInterval(this.timer);
                    }
                }
                this.newDiv.children[0].style.top = this.conMoveTarget + 'px';
                this.scrMoveTarget = parseInt(-this.conMoveTarget * ((this.newDiv.children[1].offsetHeight - this.newDiv.offsetHeight) / (this.newDiv.offsetHeight - this.newDiv.children[0].offsetHeight)));
                this.newDiv.children[1].style.top = this.scrMoveTarget + 'px';
                
            }, 10)
        })
    }
    scrollBarDown() {
        this.newDiv.children[1].addEventListener('mousedown', (e) => {
            var e = e || window.e;
            e.preventDefault()
            var yy = e.pageY - (this.newDiv.children[1].offsetTop);
            document.onmousemove = (ee) => {
                ee.preventDefault()
                var top = ee.pageY - yy;
                if (top < 0) {
                    top = 0;
                }
                if (top > this.newDiv.offsetHeight - this.newDiv.children[1].offsetHeight) {
                    top = this.newDiv.offsetHeight - this.newDiv.children[1].offsetHeight;
                }
                var conTop = -((this.newDiv.children[0].offsetHeight - this.newDiv.offsetHeight) / (this.newDiv.offsetHeight - this.newDiv.children[1].offsetHeight) * top);
                this.newDiv.children[0].style.top = conTop + 'px';
                this.newDiv.children[1].style.top = top + 'px';
                this.scrMoveTarget = top;
                this.conMoveTarget = conTop;
                return false;
            }
        })
        document.addEventListener('mouseup', () => {
            document.onmousemove = null;
        })
    }
}