// Custom events
(function(context, undefined) {

    'use strict';

    // Thanks to Crockford
    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }

    var wrap = function() {

        var evntstream,
            evnts = {},
            history = {};

        evntstream = {

            call: function(id, anything) {

                var e = {id:id},
                    i,
                    j,
                    evntArray = evnts[id],
                    evntArrayLength,
                    date,
                    callback;

                // if evnts[id] does not exist do nothing
                if (evntArray === undefined) {
                    evntArray = evnts[id] = [];
                }

                evntArrayLength = evntArray.length;

                date = new Date() * 1;
                
                history[date] = history[date] || [];

                history[date].push({id:id, anything:anything});
console.log(history);

                if (evntArrayLength) {

                    for (i = 0; i < evntArrayLength; i++) {

                        callback = false;

                        for (j = 0; j < evntArray[i].ns.length; j++) {
                            if (evntArray[i].ns[j] === this) {
                                callback = true;
                            }
                        }

                        if (callback) {
                            evntArray[i].callback(e, anything);
                        }

                    }

                }

            },

            when: function(id, fn, now) {

                var evntArray,
                    evntArrayLength,
                    evntArrayExisted,
                    callback,
                    i;

                now = now === undefined ? false : now;

                evntArrayExisted = evnts[id] !== undefined;

                evntArray = evnts[id] = evnts[id] || [];

                if (fn) {
                    evntArray.push({
                        callback:fn,
                        ns:this.nsArray.slice()
                    });
                    if (now && evntArrayExisted) {
                        this.call(id, fn);
                    }
                    // slice() to make sure a copy of the array is used, not a reference to the original object
                }
                // Remove evnts by sending no fn
                else {

                    // if evntArray does not exist do nothing
                    if (evntArray !== undefined) {

                        evntArrayLength = evntArray.length;

                        for (i = evntArrayLength - 1; i > -1; i--) {

                            // Check if the namespace is ok
                            callback = false;

                            if (evntArray[i].ns[evntArray[i].ns.length - 1] === this) {
                                callback = true;
                            }
                            if (callback) {
                                evntArray.splice(i, 1);
                            }

                        }

                    }

                }
            },
            new: function(separateStream) {
                var next;
                if (separateStream === true) {
                    next = wrap();
                }
                // Else create a sub-stream
                else {
                    next = Object.create(this);
                    // Add the namespace object to the namespace array, but not update any existing arrays
                    next.nsArray = (this.nsArray) ? this.nsArray.slice() : [];
                    next.nsArray.push(next);
                }
                return next;
            }


        };

        // Add the evntstream object to an index of namespaces
        evntstream.nsArray = [evntstream];
        evntstream.on = evntstream.when;
        evntstream.off = evntstream.when;
        evntstream.if = function(id, fn, now) {
            now = now === undefined ? true : now;
            evntstream.when(id, fn, now);
        };
        evntstream.trigger = evntstream.call;
        evntstream.do = evntstream.call;

        return evntstream;

    };

    context.evntstream = wrap();


    // A wee bit of testing
    var a = context.evntstream;
    var b = a.new('b');
    var c = b.new('c');
    var bb = a.new('bb');
    var z = c.new(true);
    console.log(context.evntstream);
    console.log(a);
    console.log(b);
    console.log(c);
    console.log(bb);

    //a.call('the door opens', 'a made the call before a handler was set'); // Should not fire
    //b.call('the door opens', 'b made the call before a handler was set'); // Should not fire
    //bb.call('the door opens', 'bb made the call before a handler was set'); // Should not fire
    c.call('the door opens', 'c made the call before a handler was set'); // Should not fire

    a.if('the door opens', function(e, data) {
        console.log('door opened ns a, ', data);
    });
    a.when('the door opens', function(e, data) {
        console.log('door opened ns a, ', data);
    });
    b.when('the door opens', function(e, data) {
        console.log('door opened ns b, ', data);
    });
    c.when('the door opens', function(e, data) {
        console.log('door opened ns c, ', data);
    });
    z.when('the door opens', function(e, data) {
        console.log('door opened ns z, ', data);
    });

    a.call('the door opens', 'a made the call'); // Should fire
    b.call('the door opens', 'b made the call'); // Should fire
    bb.call('the door opens', 'bb made the call'); // Should not fire
    c.call('the door opens', 'c made the call'); // Should not fire

    c.when('the door opens', function() {console.log('second c');});
    b.when('the door opens');
    a.call('the door opens', 'a made the call after removing b'); // Should fire two c but no b
    z.call('the door opens', 'z made the call'); // Should fire two c but no b

    a.when('the door is opened', function() {});
    a.on('the door being opened', function() {});
    a.call('the door being opened', function() {});
    var $ = {ajax:function(){return {done:function(){}};}};
    $.ajax('some.json').done(function() {
        es.trigger('ajax loaded');
        es.call('ajax loaded');
        es.do('ajax loaded');
        //es.fire('ajax loaded');
        //es.trip('ajax loaded');
    });

    es.when('ajax loaded', function() {
    });
    es.on('ajax loaded', function() {
    });
    // Could be slightly different than the others, in that if "ajax loaded" has
    // been fired already then it will do something
    // This is different to when and on, which only do something when "ajax loaded"
    // is fired
    es.if('ajax loaded', function() {
    });



    // To do
    // if
    // Fresh copy of evntstream for a completely separate stream


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




js.bob => 1;
js('sue')


'bob opens the door'
    all handlers are fired
sue('bob opens the door')
    sue handlers are fired and all sub-sue handlers







*/
