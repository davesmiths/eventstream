// Custom events
(function(context) {

    'use strict';

    var eventstream,
        streams = [];

    eventstream = function() {

        var rtn,
            when,
            doo,
            ons = {substreams:{},ons:{}};

        this.doo = function(id, anything) {

            var e = {id:id},
                i,
                onCallbackLength,
                on = ons[id];

            // if ons[id] does not exist do nothing
            if (on !== undefined) {

                onCallbackLength = on.callback.length;

                for (i = 0; i < onCallbackLength; i++) {
                    on.callback[i](e, anything);
                }

            }

        };

        this.when = function(id, fn) {
            if (fn) {
                ons[id] = ons[id] || {callback:[]};
                ons[id].callback.push(fn);
            }
            else {
                ons[id].callback = [];
            }
        };

        rtn = function(ns) {
            var rtnns = [];
            rtnns.push(ns);
            rtn.ns = rtnns;
            return rtn;
        };
        rtn.ns = [];

        rtn.when = when;
        rtn.do = doo;
        rtn.new = eventstream;
        rtn.streams = streams;

        streams.push(rtn);

        return rtn;

    };

    context.eventstream = new eventstream();

}(this));
/*







Add
    js.when('bob opens the door', 'do this')
    js.on('bob opens the door', 'do this')

Clear
    js.when('bob opens the door', 'do nothing')
    js.when('bob opens the door', null|0|false|undefined)

Trigger
    js.do('bob opens the door', 'he's wearing green!');


Namespaced

Add
    js('sue').when('bob opens the door', 'do this')
    js('imagefill').when('bob opens the door', function() {})

Clear
    js('sue').when('bob opens the door', 'do nothing')
    js('harry').when('bob opens the door', null|0|false|undefined)
    js('imagefill').when('bob opens the door')

Trigger
    js('sue').do('bob opens the door', 'he's wearing green!');







'bob opens the door'
    all handlers are fired
sue('bob opens the door')
    sue handlers are fired and all sub-sue handlers







*/
