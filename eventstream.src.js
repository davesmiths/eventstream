// Custom events
(function(context, undefined) {

    'use strict';

    var eventstream,
        streams = [],
        create,
        events = {};

    // Thanks to Crockford
    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }

    eventstream = {

        make: function(id, anything) {

            var e = {id:id},
                i,
                j,
                on = events[id],
                onLength,
                make;

//console.log('a', this);

            // if events[id] does not exist do nothing
            if (on !== undefined) {

                onLength = on.length;
//console.log(this);
                for (i = 0; i < onLength; i++) {
                    // Check if the namespace is ok
                    make = false;
                    for (j = 0; j < on[i].ns.length; j++) {
                        if (on[i].ns[j] === this) {
                            make = true;
                        }
                    }
                    if (make) {
                        on[i].callback(e, anything);
                    }
                    //on[i](e, anything);
                }

            }

        },

        when: function(id, fn) {

            var on,
                onLength,
                make,
                i;

            on = events[id] = events[id] || [];

            if (fn) {
                on.push({callback:fn, ns:this.nsArray.slice()});
                // slice() to make sure to copy the array and not use a reference to the original object
            }
            // Remove events by sending no fn
            else {

                // if on does not exist do nothing
                if (on !== undefined) {

                    onLength = on.length;

                    for (i = onLength - 1; i > -1; i--) {

                        // Check if the namespace is ok
                        make = false;

                        if (on[i].ns[on[i].ns.length - 1] === this) {
                            make = true;
                        }
                        if (make) {
                            on.splice(i, 1);
                        }
                        //on[i](e, anything);
                    }

                }

            }
        },
        new: function(ns) {
            var next = Object.create(this);
            next.poo = ns;
            // Add the namespace object to the namespace array, but not update any existing arrays
            next.nsArray = (this.nsArray) ? this.nsArray.slice() : [];
            next.nsArray.push(next);
            return next;
        }


    };
    // Add the eventstream object to an index of namespaces
    eventstream.nsArray = [eventstream];
    eventstream.on = eventstream.when;
    eventstream.off = eventstream.when;

    context.eventstream = eventstream;



    // A wee bit of testing
    //var a = context.eventstream.new('a');
    //var b = a.new('b');
    //var c = b.new('c');
    //var bb = a.new('bb');
    //console.log(context.eventstream);
    //console.log(a);
    //console.log(b);
    //console.log(c);
    //console.log(bb);

    //b.when('the door opens', function(e, data) {
    //    console.log('door opened ns b, ', data);
    //});
    //c.when('the door opens', function(e, data) {
    //    console.log('door opened ns c, ', data);
    //});

    //a.make('the door opens', 'a'); // Should fire
    //b.make('the door opens', 'b'); // Should fire
    //bb.make('the door opens', 'bb'); // Should not fire
    //c.make('the door opens', 'c'); // Should not fire

    //c.when('the door opens', function() {console.log('second c');});
    //b.when('the door opens');
    //a.make('the door opens', 'a after removing b'); // Should fire two c but no b

    //a.when('the door is opened', function() {});
    //a.on('the door being opened', function() {});
    //a.now('the door being opened', function() {});

    $.ajax('some.json').done(function() {
        es.call('ajax loaded');
        es.do('ajax loaded');
    });

    es.when('ajax loaded', function() {
    });
    es.if('ajax loaded', function() {
    });
    es.on('ajax loaded', function() {
    });

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
