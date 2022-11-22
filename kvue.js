class KVue {
    constructor (options) {
        // 保存选项
        this.$options = options
        // 获取data
        this.$data = options.data
        // 响应式处理
        this.observe(this.$data)

        // 模拟响应式
        // new Watcher(this, 'foo')
        // this.foo
        // new Watcher(this, 'bar.mua')
        // this.bar.mua

        // 模板解析
        new Complier(this.$options.el, this)
    }

    observe (data) {
        if (!data || typeof data !== 'object') {
            return
        }
        Object.keys(data).forEach( item => {
            this.defineReactive(data, item, data[item])
            //代理 实现直接访问data中key值  将data中key值代理到kvue实例上
            this.proxyData(item)
        })

    }
    // 劫持
    defineReactive (obj, key, val) {
        // 深度监听
        this.observe(val)

        // 实例化依赖收集器 一个key对应一个收集器实例
        const dep = new Dep()

        Object.defineProperty(obj, key, {
            get() {
                Dep.target && dep.addDep(Dep.target)
                return val
            },
            set (newVal) {
                if (newVal !== val) {
                    val = newVal
                    dep.nodify()
                }
                // console.log('新值' + val)
            }
        })
    }

    //代理 实现直接访问data中key值  将data中key值代理到kvue实例上
    proxyData (key) {
        Object.defineProperty(this, key, {
            get() {
                return this.$data[key]
            },
            set (newVal) {
                // 深度监听时有些问题
                this.$data[key] = newVal
                console.log('代理新值' + this.$data[key])
            }
        })
    }
}