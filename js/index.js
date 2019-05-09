// 基于高级单例模式完成业务逻辑的开发
let productRender = (function(){
    // 自执行函数形成一个不被销毁的作用域，也就是闭包机制。
    // 作用：里面的方法，变量不会和外界冲突；
    // 里面创建的值也不会被销毁；

    let productDate = null,
        productBox = document.getElementById('productBox'),
        productList = null,
        // 因为dom映射,所有尽可能避免映射影响.
        tit = document.getElementById('tit'),
        linkList = tit.getElementsByTagName('a');
    // 若是变量在闭包中多处使用，可以定义为公共变量来使用.

    // 基于ajax进行数据的获取
    let getDate = function(){

        let xhr =new XMLHttpRequest;
        xhr.open('GET','json/product.json',false)
        // 发生请求
        // 默认是异步编程，false表示是同步
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4 && xhr.status === 200){
                productDate = JSON.parse(xhr.responseText);
            }
        }
        xhr.send(null);

    }
    // 进行html结构和数据的绑定
    let bindHTML = function(){

        let str = ``;
        
        productDate.forEach(({title,hot,price,time,img})=>{
            str +=
                // 将要比较的值以属性的方式存储在相应元素上,比较时以属性的方式获取
                `<li data-time='${time}' data-price='${price}' data-hot='${hot}'>
                    <a href="#">
                        <img src="${img}" alt="">
                        <p title='${title}'>${title}</p>
                        <span>${price}</span>
                        <span>时间：${time}</span>
                        <span>热度：${hot}</span>
                    </a>
                </li>`
            
        })

        productBox.innerHTML = str;

        // 绑定之后盒子中存在li.
        productList = productBox.querySelectorAll('li');

    }
    // 点击排序
    let bindClick = function(){
        // linkList是个类数组
        [].slice.call(linkList).forEach( (item,index) =>{
            // 循环三次执行三次方法,每次执行都会形成一个闭包,闭包中保存了相应的索引值.

            // 每次点击都改变item.flag,从而改变排序时的顺序.
            item.flag=-1;

            item.onclick = function(){
                // 根据点击的不同给productList进行不同的排序

                this.flag *= -1;

                let ary = ['data-time' , 'data-price' , 'data-hot'];
                    productList = [].slice.call(productList);

                productList.sort( (a,b)=>{

                    let aInn = a.getAttribute(ary[index]),
                        bInn = b.getAttribute(ary[index]);
                    
                    // time是字符串且带'-',
                    // 所以即使字符串相减会转化为number类型,但time无法转变.
                    // 所以将'-'去除,利用正则.
                    if(index === 0){
                       aInn = aInn.replace(/-/g,'');
                       bInn = bInn.replace(/-/g,'');
                    }

                    return (aInn-bInn)*this.flag;
                    
                });
                // 排序之后改变页面结构
                let frg = document.createDocumentFragment();
                [].slice.call(productList).forEach(item=>{
                    frg.appendChild(item);
                })
                productBox.appendChild(frg);
                frg = null;
                // 减少回流，减少消耗；
                // 释放，减少消耗；

            }

            
            
            // 按最新顺序添加到容器中
        })
    }

    return{

        // init是当前模块的入口，若想完成实现某个功能执行init即可。
        // 在init中，根据具体的业务逻辑进行排序执行即可。
        // 命令设计模式
        init:function(){
            getDate();
            bindHTML();
            bindClick();
        }
    }
})();

// 使用
productRender.init();