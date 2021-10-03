function DataBinder(object_id) {
    var pubSub = jQuery({})

    var data_attr = "bind-"+object_id
    var message = object_id + ":change"

    jQuery(document).on("change", "[data-" + data_attr + "]", function(evt) {
        var input = jQuery(this)
        pubSub.trigger(message, [input.data(data_attr), input.val()])
    })

    pubSub.on(message, function(evt, prop_name, new_val){
        jQuery(`[data-${data_attr}=${prop_name}]`).each(function(){
            var $bound = jQuery(this)

            if ($bound.is("input,text area,select")) {
                $bound.val(new_val)
            } else {
                $bound.html(new_val)
            }
        })
    })
    return pubSub
}

function User(uid) {
    var binder = new DataBinder(uid)
    user = {
        attributes: {},
        set: function(attr_name, val) {
            this.attributes[attr_name] = val
            console.log("set", attr_name, "to", val)
            binder.trigger(uid+":change", [attr_name, val, this])
        },
        get: function(attr_name) {
            return this.attributes["attr_name"]
        },
        _binder: binder
    }
    binder.on(uid+":change", function(evt, attr_name, new_val, initiator) {
        if (initiator !== user) {
            user.set(attr_name, new_val)
        }
    })
    return user
}