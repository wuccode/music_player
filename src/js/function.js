let DOM = {};

        //获取dom
function $(obj){
            //已经获取直接返回
            if(DOM[obj]){
                return DOM[obj]
            }
            DOM[obj] = typeof obj === 'string' ? document.querySelector(obj) : obj = null;
            return DOM[obj]
        }
        //获取css样式
function getStyleAttr(obj,attr){
            if(obj.currentStyle){
                return obj.currentStyle[attr];
            }else{
                return window.getComputedStyle(obj,null)[attr];
            }
        }
function debounce(fn,outTime = 300){
            let time = null;
            return function(...args){
                if(time) clearTimeout(time) 
                time = setTimeout(()=>{
                    fn.apply(this,args)
                },outTime)
            }
}

    







