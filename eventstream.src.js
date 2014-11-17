// Custom events
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
            hasEventFired;

        hasEventFired = function(evnt, from, to) {
console.log('hasEventFired',evnt, history);
            //history = [{date, id,anything,stream}]
            //evnt = {callback, stream, created, fall}
            var upperBound = evnt.created + to,
                lowerBound = evnt.created - from,
                eventFired = false,
                i;
            for (i = history.length - 1; i > -1; i--) {
console.log('history[i]',history[i]);
console.log('lower',lowerBound);
console.log('dater',history[i].date);
console.log('upper',upperBound);
                if (history[i].date >= lowerBound && history[i].date <= upperBound) {
console.log('history[i] match',history[i]);
                    eventFired = true;
                    break;
                }
            }
            //event created at 3000
            //eventfired at 8000
            //if eventfired between eventcreated-from and eventcreated+to then call callback
            //else fall
            return eventFired;
        };

        eventStream = {

            _call: function(o) {

console.log('_call',this);

                var id = o.id,
                    anything = o.anything,
                    propagate = o.propagate,
                    e = {id:id},
                    events = eventNames[id],
                    eventsLength,
                    evnt,
                    date,
                    upDownStreamProp,
                    thing;

                // if eventNames[id] does not exist do nothing except prime the array
                if (events === undef) {
                    events = eventNames[id] = [];
                }

                eventsLength = events.length;

                // Maintain a history log that can be made use of in the _when function
                date = new Date() * 1;
                history.push({date:date, id:id, anything:anything, stream:this});
console.log('history',history);

                // Do propagation
                if (propagate !== 0) {
                    upDownStreamProp = propagate === -1 ? 'downStream' : 'upStream';
                }

                thing = function(callStream) {

                    var callUpDownStream,
                        callUpDownStreamLength,
                        i;

                    // Loop through the events
                    for (i = 0; i < eventsLength; i++) {

                        evnt = events[i];

                        if (evnt.stream === callStream) {
                            evnt.callback(e, anything);
                        }

                    }

                    if (propagate !== 0) {
                        callUpDownStream = callStream[upDownStreamProp];
                        callUpDownStreamLength = callUpDownStream.length;
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
                        created:new Date() * 1,
                        fall:o.fall || doNothing
                    };

                    if (o.to === Number.POSITIVE_INFINITY && o.from === 0) {
                        events.push(evnt);
                    }
                    else {

                        // slice() to make sure a copy of the array is used, not a reference to the original object
                        // Truth table: https://docs.google.com/spreadsheets/d/1yrLzB-RQcm5TArhgmG-g2jQt4VrBK51gkTWet0hA2QU/edit#gid=0
                        /**/
                        if (o.from > o.to) {

                            // ? make o.from 0 and o.to infinity, the default
                            // or do nothing, yeah do nothing
                        }
                        else {

                            if (o.from < 0) {

                                if (o.to >= 0) {

                                    // Add the listener
                                    events.push(evnt);

                                    // Call fn if the event was already fired
                                    if (hasEventFired(evnt, o.from, o.to)) {
                                        evnt.fn();
                                    }

                                    if (o.to !== Number.POSITIVE_INFINITY) {
                                        // o.to is 0 to big number

                                        // After a delay remove the listener and maybe call the fallback
                                        setTimeout(function() {

                                            // Remove listener
                                            evnt.callback = doNothing;

                                            // Call the fallback if the event was not fired
                                            if (!hasEventFired(evnt, o.from, o.to)) {
                                                evnt.fall();
                                            }

                                        }, o.to);

                                    }

                                }
                                else if (o.to !== Number.NEGATIVE_INFINITY) {
                                    // o.to is -1 to big negative number

                                    // Call fn if the event was already fired
                                    if (hasEventFired(evnt, o.from, o.to)) {
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

                                    if (o.from === 0) {
                                        events.push(evnt);
                                    }
                                    else {

                                        // After a delay add the listener
                                        setTimeout(function() {
                                            evnt.created = new Date() * 1;
                                            events.push(evnt);
                                        }, o.from);
                                    }

                                    if (o.to !== Number.POSITIVE_INFINITY) {
                                        // o.to is 0 to big number
                                        // After a delay remove the listener and maybe call the fallback
                                        setTimeout(function() {
                                            // Remove the listener
                                            evnt.callback = doNothing;
                                            // Call the fallback if the event was not fired
                                            if (!hasEventFired(evnt, o.from, o.to)) {
                                                evnt.fall();
                                            }
                                        }, o.to);

                                    }

                                }
                            }
                        }
                    }

                    /**/
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

            var o = {
                id:a,
                to:Number.POSITIVE_INFINITY,
                from:0,
                fn:doNothing,
                fall:doNothing
            };

            if (typeOf(b) === 'boolean') {
                b = b ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
            }
            if (typeOf(c) === 'boolean') {
                c = c ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
            }
            if (typeOf(b) === 'number' && typeOf(c) === 'number') {
                o.from = b;
                o.to = c;
                b=d;c=e;
            }
            else if (typeOf(b) === 'number') {
                if (b > 0) {
                    o.to = b;
                    o.from = 0;
                }
                else {
                    o.to = 0;
                    o.from = b;
                }
                b=c;c=d;
            }
            o.fn = b;
            o.fall = c;

            this._when(o);

        };

        // Triggers
        // propagate upstream
        // propagate downstream
        // propagate stream only
        eventStream.do = eventStream.trigger = eventStream.call = function(a,b,c) {
            var o = {id:a, anything:b, propagate:-1};
            if (typeOf(a) === 'number') {
                o.propagate = a;
                o.id = b;
                o.anything = c;
            }
            this._call(o);
        };

        eventStream.label = 'root';

        return eventStream;

    };

    context.eventStream = wrap();

}(this));
