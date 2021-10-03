function JsBinder(object_id) {
    var pubSub = {
        callbacks: {},
        on: function(msg, callback) {
            this.callbacks[msg] = this.callbacks[msg] || []
            this.callbacks[msg].push(callback)
        },
        publish: function(msg) {
            this.callbacks[msg] = this.callbacks[msg] || []
            for (let i = 0; i < this.callbacks[msg].length; i++) {
                this.callbacks[msg][i].apply(this, arguments)
            }
        }
    }
    var data_attr = "data-bind-" + object_id
    var message = object_id + ":change"
    var changeHandler = function (evt) {
        var target = evt.target,
            prop_name = target.getAttribute(data_attr);

        if (prop_name && prop_name !== "") {
            pubSub.publish(message, prop_name, target.value)
        }
    }

    if (document.addEventListener) {
        document.addEventListener("change", changeHandler, false)
    }

    pubSub.on(message, function(evt, prop_name, new_val) {
        var elements = document.querySelectorAll(`[${data_attr}=${prop_name}]`)

        for (let i = 0; i < elements.length; i++) {
            var tag_name = elements[i].tagName.toLowerCase()
            if (tag_name === "input" || tag_name === "textarea" || tag_name === "select") {
                elements[i].value = new_val
            } else {
                elements[i].innerHTML = new_val
            }
        }
    })

    return pubSub
}

function JsUser(uid) {
    var binder = new JsBinder(uid)
    user = {
        attributes: {},
        set: function(attr_name, val) {
            this.attributes[attr_name] = val
            console.log("set", attr_name, "to", val)
            binder.publish(uid+":change", attr_name, val, this) // 传的这个this对象避免无限循环
        },
        get: function(attr_name) {
            return this.attributes["attr_name"]
        },
        _binder: binder
    }
    binder.on(uid+":change", function(evt, attr_name, new_val, initiator) {
        if (initiator !== user) { // 避免set方法再次触发set
            user.set(attr_name, new_val)
        }
    })
    return user
}