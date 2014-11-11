// Custom events
(function(context, undefined) {

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

    var typeOf = function(o) {
            return ({}).toString.call(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
        },
        doNothing = function() {};


    var wrap = function() {

        var evntstream,
            evntNames = {},
            history = [];

        var eventFired = function(evnt, from, to) {
            console.log('eventFired',evnt, history);
            //history = {date, o:{id,anything,stream}}
            //evnt = {callback, streamsPath[], created}
        };
        evntstream = {

            _call: function(o) {

                var id = o.id,
                    anything = o.anything,
                    e = {id:id},
                    i,
                    j,
                    k,
                    evnts = evntNames[id],
                    evntsLength,
                    evnt,
                    date,
                    callbacksAreCalledChonologicallyWithNoHierarchicalSensitivity = 1,
                    callbacksAreCalledChronologicallyWithinTheScopeOfEachStreamGoingFromSubToSuperStreams = 1,
                    callbacksAreCalledChronologicallyWithinTheScopeOfEachStreamGoingFromSuperToSubStreams = 1,
                    callback;

                // if evntNames[id] does not exist do nothing except prime the array
                if (evnts === undefined) {
                    evnts = evntNames[id] = [];
                }

                evntsLength = evnts.length;

                // Maintain a history log that can be made use of in the _when function
                date = new Date() * 1;
                history.push({date:date, o:{id:id, anything:anything, stream:this}});


                if (callbacksAreCalledChonologicallyWithNoHierarchicalSensitivity) {
                    // Loop through the events
                    for (i = 0; i < evntsLength; i++) {

                        evnt = evnts[i];

console.log('a', this.streamsPath, evnt.streamsPath);
                        callback = false;

                        // Loop over the stream paths
                        // If any of the stream paths match the current stream then do the callback
                        for (j = 0; j < evnt.streamsPath.length; j++) {
                            if (evnt.streamsPath[j].stream === this) {
                                callback = true;
                            }
                        }

                        if (callback) {
                            evnt.callback(e, anything);
                        }

                    }

                }

                else if (callbacksAreCalledChronologicallyWithinTheScopeOfEachStreamGoingFromSubToSuperStreams) {

console.log('b streamsPath', this.streamsPath);

                    // Loop through the path of streams from super to sub
                    for (i = this.streamsPath.length - 1; i > -1; i--) {

                        // Loop through the events
                        for (j = 0; j < evntsLength; j++) {

                            evnt = evnts[j];

                            callback = false;

                            // Loop over the event streams path
                            // If any of the streams are the current namespace then do the callback
                            for (k = 0; k < evnt.streamsPath.length; k++) {
                                if (evnt.streamsPath[k].stream === this.streamsPath[i].stream) {
                                    callback = true;
                                }
                            }

                            if (callback) {
                                evnt.callback(e, anything);
                            }

                        }

                    }
                }
                else if (callbacksAreCalledChronologicallyWithinTheScopeOfEachStreamGoingFromSuperToSubStreams) {
                    // Loop through the path of streams from sub to super
                    for (j = 0; j < this.streamsPath.length; j++) {
                    }
                }
                // For example
                // An event to fired on the root stream:
                // if (callbacksAreCalledChonologicallyWithNoHierarchicalSensitivity)
                //      Could mean a midstream callback is called, followed by a substream, then by the root stream, followed by another substream
                //      All of which is determined by the order the listeners were added
                // if (callbacksAreCalledChronologicallyWithinTheScopeOfEachStreamGoingFromSubToSuperStreams)
                //      Would mean substream callbacks are called (in order the listener were added), followed by midstream, ... and lastly root stream
                // if (callbacksAreCalledChronologicallyWithinTheScopeOfEachStreamGoingFromSuperToSubStreams)
                //      Would mean root stream callbacks are called (in order the listener were added), followed by midstream, ... and lastly the most sub substream
                // The option is set at the root stream, but can be overridden for any substream, where the substream fires the event
                //      If a substream has a different option to root. Then only if the substream (or its substreams) fires will the option be different to the root
                //      If the root is fired it will honour the option set at the root stream


            },

            _when: function(o) {

                var id = o.id,
                    fn = o.fn,
                    now = o.now,
                    evnts,
                    evntsLength,
                    evntsExisted,
                    callback,
                    evnt,
                    i;

                now = now === undefined ? false : now;

                evntsExisted = evntNames[id] !== undefined;

                evnts = evntNames[id] = evntNames[id] || [];

                // If the callback fn exists add the handler
                if (fn) {

                    evnt = {
                        callback:fn,
                        streamsPath:this.streamsPath.slice(),
                        created:new Date() * 1
                    };

                    evnts.push(evnt);

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
                                evnts.push(evnt);

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
                                    evnts.push(evnt);
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

                    // if evnts does not exist do nothing
                    if (evnts !== undefined) {

                        evntsLength = evnts.length;

                        for (i = evntsLength - 1; i > -1; i--) {

                            // Check if the namespace is ok
                            callback = false;

                            if (evnts[i].streamsPath[evnts[i].streamsPath.length - 1].stream === this) {
                                callback = true;
                            }
                            if (callback) {
                                evnts.splice(i, 1);
                            }

                        }

                    }

                }
            },
            new: function(a,b) {
                // May add ability to label a stream for later retrieval
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
                    next.streamsPath = this.streamsPath.slice();
                    next.streamsPath.push({stream:next, label:label});
                }
                return next;
            }


        };

        // Add the current stream as the first node in the path of streams
        evntstream.streamsPath = [{stream:evntstream, label:'root'}];

        // Handlers
        evntstream.if = evntstream.on = evntstream.off = evntstream.when = function(a,b,c,d,e) {
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
            evntstream._when(o);
        };

        // Triggers
        evntstream.do = evntstream.trigger = evntstream.call = function(id, anything) {
            evntstream._call({
                id:id,
                anything:anything
            });
        };

        return evntstream;

    };

    context.evntstream = wrap();


    // A wee bit of testing
    var a = context.evntstream;
    var b = a.new('b');
    var c = b.new('c');
    var bb = a.new('bb');
    var z = c.new('z',true);
/*
    console.log(context.evntstream);
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

    a.on('bob', function() {console.log('a1');});
    c.on('bob', function() {console.log('c2');});
    b.on('bob', function() {console.log('b3');});
    a.on('bob', function() {console.log('a4');});
    b.on('bob', function() {console.log('b5');});
    a.on('bob', function() {console.log('a6');});
    b.call('bob');
// a.call by default fires a, b, c in order each event was added
// b.call by default fires b, c in order each event was added
// c.call by default fires c in order each event was added


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
    js('imagefill').when('bob opens the door', doNothing)

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
