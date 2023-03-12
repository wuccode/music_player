(function(w){
    
        //获取id
        w.$ = function(obj){
            return typeof obj === 'string' ? document.querySelector(obj) : obj = null;
        }
        //获取css样式
        w.getStyleAttr = function(obj,attr){
            if(obj.currentStyle){
                return obj.currentStyle[attr];
            }else{
                return window.getComputedStyle(obj,null)[attr];
            }
        }
        w.debounce = function(fn,outTime = 300){
            let time = null;
            const _debounce = function(...args){
                if(time) clearTimeout(time) 
                time = setTimeout(()=>{
                    fn.apply(this,args)
                },outTime)
            }
            return _debounce
        }
})(window)

    







