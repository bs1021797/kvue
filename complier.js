// 遍历模板 解析指令和插值
class Complier {
    // el模板 vm kvue实例
    constructor (el, vm) {
        this.$vm = vm
        this.$el = document.querySelector(el)
        // 提取模板片段
        this.$fragment = this.node2Fragment(this.$el)
        // 解析模板片段
        this.complie(this.$fragment)
        // 插入解析后模板片段
        this.$el.appendChild(this.$fragment)
    }
    // 提取模板
    node2Fragment (el) {
        // 创建片段
        const fragment = document.createDocumentFragment()
        // 填充
        let child
        while (child = el.firstChild) {
            fragment.appendChild(child)
        }
        return fragment
    }

    complie (el) {
        const childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            // nodeType 1:元素节点 3.文本节点 
            if (node.nodeType == 1) {
                console.log('-------------解析模板元素---------------')
                this.complieElement(node)
            } else if (this.isInter(node)) {
                // 插值解析
                console.log('----------插值解析----------')
                this.complieText(node)
            }

            // 递归子元素
            if (node.childNodes && node.childNodes.length > 0) {
                this.complie(node)
            }
        })
    }

    isInter (node) {
        return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }

    complieText (node) {
        // const value = this.$vm[RegExp.$1]
        // node.textContent = value

        // 表达式
        const exp = RegExp.$1
        this.update(node, exp, 'text')
    }
    // node当前节点 exp：data数据， dir指令（text 一些指令和v-text相同操作）
    update (node, exp, dir) {
        // 获取具体操作事件
        const updator = this[dir + 'Updator']
        updator && updator(node, this.$vm[exp])

        // 实例化watcher
        // const value = this.$vm[exp]
        new Watcher(this.$vm, exp, (value) => {
            console.log('---------watcher回调更新节点-----------' + value)
            updator && updator(node, value)
        })
    }

    // 操作插值或v-text
    textUpdator (node, value) {
        node.textContent = value
    }

    complieElement (node) {
        // 获取属性 k-xxx
        const attrs = node.attributes
        Array.from(attrs).forEach(attr => {
            //格式 k-xxx = yyy
            const attrName = attr.name // k-xxx
            // 表达式
            const exp = attr.value //yyy
            if (attrName.indexOf('k-') == 0) {
                //指令
                const dir = attrName.substring(2)
                this['k'+ dir] && this['k'+ dir](node, exp)
            }

            if (attrName.indexOf('@') == 0) {
                //事件
                // 事件名称 click等
                const dir = attrName.substring(1)
                this.eventHandler(node, this.$vm, exp, dir)
            }
        })
    }

    //实现k-text指令
    ktext (node, exp) {
        // update
        this.update(node, exp, 'text')
    }

    // 事件处理 dir事件名称
    eventHandler (node, vm, exp, dir) {
        const fn = vm.$options.methods && vm.$options.methods[exp]
        if (dir && fn)
            node.addEventListener(dir, fn.bind(vm))
    }
}
window.Complier = Complier