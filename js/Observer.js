function observe(data) {
    if (!data || typeof data !== 'object')
        return
    Object.keys(data).forEach(function(key) {
        defineReactive(data, key, data[key])
    })
}

function defineReactive(data, key, val) {
    var dep = new Dep()
    observe(val) // 递归监听
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: false,
        get: function() {
            Dep.target && dep.depend()
            return val;
        },
        set: function(newVal) {
            if (val === newVal)
                return
            console.log(key, 'has new value', newVal)
            val = newVal
            dep.notify()
        }
    })
}

function Dep() {
    this.subs = []
}
Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub)
    },
    depend: function() {
        Dep.target.addDep(this)
    },
    removeSub: function(sub) {
        var index = this.subs.indexOf(sub)
        if (index != -1) {
            this.subs.splice(index, 1)
        }
    },
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update()
        })
    }
}

Dep.target = null