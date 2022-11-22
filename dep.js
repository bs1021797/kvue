// 依赖收集器
class Dep {
    constructor () {
        this.deps = []
    }
    // 收集依赖  参数是dep
    addDep (dep) {
        this.deps.push(dep)
    }
    // 通知依赖更新
    nodify () {
        this.deps.forEach(dep => {
            dep.update()
        })
    }
}
window.Dep = Dep