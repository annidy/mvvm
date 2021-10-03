

function MVVM(options) {
    this.$options = options || {};
    var data = this._data = this.$options.data, me = this;
    Object.keys(data).forEach(function(key) {
        me._proxy(key)
    })
    observe(data, this)
    this.$compile = new Compile(options.el || document.body, this)
}


MVVM.prototype = {
    _proxy: function(key) {
        var me = this;
        Object.defineProperty(me, key, {
            configurable: false,
            enumerable: true,
            get: function () {
                return me._data[key]
            },
            set: function (newVal) {
                me._data[key] = newVal
            }
        })
    }
}