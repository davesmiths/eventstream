// Custom events
//asdasdasdasdasdasdasdasdasdasd
(function(context, undef) {

    'use strict';

//
//  .new('label') which can be later used to retrieve a particular stream
//
//  Event
//      Listener: An event pushed into a register that will be called if a matching event is fired into the stream
//      Callback: A function that is called if a listener is matched
//      Trigger: Method to fire an event into a stream
//
// Event listener callbacks are called in order of time attached
// this means a listener attached to the root stream could be called before
// a listener in a substream because it was attached before the substream
// And equally the reverse is true.
// I'm not sure if this is correct to do, or whether substreams are better
// prioritised over superstreams. Or visa-versa

    // Thanks to Crockford
    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }

    var typeOf,
        doNothing = function() {},
        wrap;

    typeOf = function(o) {
        return ({}).toString.call(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    };


    wrap = function() {

        var eventStream,
            eventNames = {},
            history = [],
            eventFired;

        eventFired = function(evnt, from, to) {
            console.log('eventFired',evnt, history);
            //history = {date, o:{id,anything,stream}}
            //evnt = {callback, streamsPath[], created}
        };

        eventStream = {

            _call: function(o) {

console.log('_call',this);

                var id = o.id,
                    anything = o.anything,
                    e = {id:id},
                    events = eventNames[id],
                    eventsLength,
                    evnt,
                    date,
                    propagate = 1,
                    propagateType = 0,
                    upDownStreamProp,
                    thing;

                // if eventNames[id] does not exist do nothing except prime the array
                if (events === undef) {
                    events = eventNames[id] = [];
                }

                eventsLength = events.length;

                // Maintain a history log that can be made use of in the _when function
                date = new Date() * 1;
                history.push({date:date, o:{id:id, anything:anything, stream:this}});

                // Do propagation
                upDownStreamProp = propagateType === 0 ? 'downStream' : 'upStream';

                thing = function(callStream) {

                    var callUpDownStream = callStream[upDownStreamProp],
                        callUpDownStreamLength = callUpDownStream.length,
                        i;

                    // Loop through the events
                    for (i = 0; i < eventsLength; i++) {

                        evnt = events[i];

                        if (evnt.stream === callStream) {
                            evnt.callback(e, anything);
                        }

                    }

                    if (propagate) {
                        for (i = 0; i < callUpDownStreamLength; i++) {
                            thing(callUpDownStream[i]);
                        }
                    }

                };
                thing(this);

            },

            _when: function(o) {
console.log('_when',this);
                var id = o.id,
                    fn = o.fn,
                    now = o.now,
                    events,
                    eventsLength,
                    eventsExisted,
                    evnt,
                    i;

                now = now === undef ? false : now;

                eventsExisted = eventNames[id] !== undef;

                events = eventNames[id] = eventNames[id] || [];

                // If the callback fn exists add the handler
                if (fn) {

                    evnt = {
                        callback:fn,
                        stream:this,
                        created:new Date() * 1
                    };

                    events.push(evnt);

                    // slice() to make sure a copy of the array is used, not a reference to the original object
                    // Truth table: https://docs.google.com/spreadsheets/d/1yrLzB-RQcm5TArhgmG-g2jQt4VrBK51gkTWet0hA2QU/edit#gid=0
                    /*
                    if (o.from > o.to) {

                        // ? make o.from 0 and o.to infinity, the default
                        // or do nothing, yeah do nothing
                    }
                    else {

                        if (o.from <= 0) {

                            if (o.to >= 0) {

                                // Add the listener
                                events.push(evnt);

                                // Call fn if the event was already fired
                                if (eventFired(evnt, o.from, o.to)) {
                                    evnt.fn();
                                }

                                if (o.to !== Number.POSITIVE_INFINITY) {
                                    // o.to is 0 to big number

                                    // After a delay remove the listener and maybe call the fallback
                                    setTimeout(function() {

                                        // Remove listener
                                        evnt.callback = doNothing;

                                        // Call the fallback if the event was not fired
                                        if (!eventFired(evnt, o.from, o.to)) {
                                            evnt.fall();
                                        }

                                    }, o.to);

                                }

                            }
                            else if (o.to !== Number.NEGATIVE_INFINITY) {
                                // o.to is -1 to big negative number

                                // Call fn if the event was already fired
                                if (eventFired(evnt, o.from, o.to)) {
                                    evnt.fn();
                                }
                                // Otherwise call the fallback
                                else {
                                    evnt.fall();
                                }

                            }
                        }
                        else if (o.from !== Number.POSITIVE_INFINITY) {
                            if (o.to >= 0) {
                                // o.to is 0 to infinity

                                // After a delay add the listener
                                setTimeout(function() {
                                    evnt.created = new Date() * 1;
                                    events.push(evnt);
                                }, o.from);

                                if (o.to !== Number.POSITIVE_INFINITY) {
                                    // o.to is 0 to big number
                                    // After a delay remove the listener and maybe call the fallback
                                    setTimeout(function() {
                                        // Remove the listener
                                        evnt.callback = doNothing;
                                        // Call the fallback if the event was not fired
                                        if (!eventFired(evnt, o.from, o.to)) {
                                            evnt.fall();
                                        }
                                    }, o.to);
                                }

                            }
                        }
                    }
                    */
                }
                // Else remove the event handler
                else {

                    // if events does not exist do nothing
                    if (events !== undef) {

                        for (i = events.length - 1; i > -1; i--) {

                            if (events[i].stream === this) {
                                events.splice(i, 1);
                            }

                        }

                    }

                }
            },
            new: function(a,b) {

                var next,
                    label;

                if (typeOf(a) === 'string') {
                    label = a;
                    a = b;
                }

                if (a === true) {
                    next = wrap();
                }
                else {
                    // Create the next substream, and add it to a copy of the current path of streams
                    next = Object.create(this);
                    next.upStream = [this];
                    next.downStream = [];
                    this.downStream.push(next);
                }
                next.label = label;

                return next;

            }

        };

        // Add up and down stream arrays to capture the immediate super and sub streams
        eventStream.upStream = [];
        eventStream.downStream = [];

        // Handlers
        eventStream.if = eventStream.on = eventStream.off = eventStream.when = function(a,b,c,d,e) {
            var o = {id:a,to:Number.POSITIVE_INFINITY,from:0,fn:doNothing,fall:doNothing};
            if (typeOf(b) === 'boolean') {
                b = b ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
            }
            if (typeOf(b) === 'number') {
                o.to = b;
                b=c;c=d;d=e;
            }
            if (typeOf(b) === 'boolean') {
                b = b ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
            }
            if (typeOf(b) === 'number') {
                o.from = b;
                b=c;c=d;
            }
            o.fn = b;
            o.fall = c;
            this._when(o);
        };

        // Triggers
        eventStream.do = eventStream.trigger = eventStream.call = function(id, anything) {
            this._call({
                id:id,
                anything:anything
            });
        };

        eventStream.label = 'root';

        return eventStream;

    };

    context.eventStream = wrap();

}(this));
//             c--
//            /
//       b----
//      /
// -a---
//      \
//       bb-------
//
// -z-------------


//  if b fired
//      default, down stream
//          handlers for b and c called
//      up stream
//          handlers for b and a called
//
//  e.stopPropagation prevents down or up stream propagation
//  e.stopImmediatePropagation prevents any other same stream handers firing and stops down or up stream propagation
//
//


    // A wee bit of testing
    var a = eventStream;
    var b = a.new('b');
    var c = b.new('c');
    var bb = a.new('bb');
    var z = c.new('z',true);

    a.on('bob', function() {console.log('a1');});
    c.on('bob', function() {console.log('c2');});
    b.on('bob', function() {console.log('b3');});
    a.on('bob', function() {console.log('a4');});
    b.on('bob', function() {console.log('b5');});
    a.on('bob', function() {console.log('a6');});
    c.on('bob');
    //b.call('bob');
    a.call('bob');
console.log(a);
console.log(b);
console.log(c);
console.log(z);
// a.call by default fires a, b, c in order each event was added
// b.call by default fires b, c in order each event was added
// c.call by default fires c in order each event was added


/*

    console.log(context.eventStream);
    console.log(a);
    console.log(b);
    console.log(c);
    console.log(bb);

    //a.call('the door opens', 'a made the call before a handler was set'); // Should not fire
    //b.call('the door opens', 'b made the call before a handler was set'); // Should not fire
    //bb.call('the door opens', 'bb made the call before a handler was set'); // Should not fire
    c.call('the door opens', 'c made the call before a handler was set'); // Should not fire

    //a.if('the door opens', 5000, function(e, data) {
    //    console.log('door opened ns a, ', data);
    //});
    b.when('the door opens', function(e, data) {
        console.log('door opened ns b, ', data);
    });
    c.when('the door opens', function(e, data) {
        console.log('door opened ns c, ', data);
    });
    z.when('the door opens', function(e, data) {
        console.log('door opened ns z, ', data);
    });
    a.when('the door opens', function(e, data) {
        console.log('door opened ns a, ', data);
    });
    a.when('the door opens', function(e, data) {
        console.log('door opened ns a2, ', data);
    });

    a.call('the door opens', 'a made the call'); // Should fire
    b.call('the door opens', 'b made the call'); // Should fire
    bb.call('the door opens', 'bb made the call'); // Should not fire
    c.call('the door opens', 'c made the call'); // Should not fire

    c.when('the door opens', function() {console.log('second c');});
    b.when('the door opens');
    a.call('the door opens', 'a made the call after removing b'); // Should fire two c but no b
    z.call('the door opens', 'z made the call'); // Should fire two c but no b

    a.when('the door is opened', doNothing);
    a.on('the door being opened', doNothing);
    a.call('the door being opened', doNothing);

*/


//var fn = function() {
//    console.log('fn');
//};
//var fall = function() {
//    console.log('fall');
//};
//a.when('bob',fn);
    //a.when('bob',5000,fn,fall); // keep handler in place for 5 seconds
    //a.when('bob',-5000,fn,fall); // keep handler in place for 5 seconds
    //a.when('bob',-8,8,fn,fall);
    //a.when('bob',-8, 5000,fn,fall); // keep handler in place for 5 seconds, and trigger if already called
    //a.when('bob',-5000,5000,fn,fall); // keep handler in place for 5 seconds, and trigger if already called in the last 5 seconds
    // 8 used because it is similar to the infinity sign, and who is going to set something to +-8ms?

    //var $ = {ajax:function(){return {done:doNothing};}};
    //$.ajax('some.json').done(function() {
    //    es.trigger('ajax loaded');
    //    es.call('ajax loaded');
    //    es.do('ajax loaded');
    //    //es.fire('ajax loaded');
    //    //es.trip('ajax loaded');
    //});

    //es.when('ajax loaded', function() {
    //});
    //es.on('ajax loaded', function() {
    //});
    //// Could be slightly different than the others, in that if "ajax loaded" has
    //// been fired already then it will do something
    //// This is different to when and on, which only do something when "ajax loaded"
    //// is fired
    //es.if('ajax loaded', function() {
    //});
