// 观察者 data中数据在模板中应用
class Watcher {
    // vm 组件实例
    constructor (vm, key, cb) {
        this.$key = key
        this.$vm = vm
        this.$cb = cb

        // 当前实例给到dep.target对象 收集依赖使用
        Dep.target = this
        // 读取key 添加进dep
        this.$vm[this.$key]
        Dep.target = null
    }

    update () {
        console.log(this.$key + '更新了')
        this.$cb.call(this.$vm, this.$vm[this.$key])
    }
}

window.Watcher = Watcher