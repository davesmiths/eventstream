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
a.call('bob');
setTimeout(function() {
    a.on('bob', -1000, function() {console.log('a7 callback');}, function() {console.log('a7 fallback');});
},2000);
//c.on('bob');
//console.log('calls');
//c.call(1, 'bob');

//b.call(-2, 'bob', anything); // up streams only
//b.call(-1, 'bob', anything); // current stream and then each up stream
//b.call(0, 'bob', anything); // current stream only
//b.call(1, 'bob', anything); // current stream and then each down stream
//b.call(2, 'bob', anything); // down streams only
//b.call('bob', anything); // same as b.call(1, 'bob', anything);
//console.log(a);
//console.log(b);
//console.log(c);
//console.log(z);

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




//
//
//
//// Create some steams
//bob = eventstream.new();
//anotherstream = bob.new();
//// Triggers before on are not honoured
//eventstream.make('boom', '1');
//// Add some event handling
//eventstream.when('boom', function(e, anything) {
//   console.log('boom event handled in eventstream, callback 1', e, anything, this);
//});
//// Clear any boom events
//eventstream.when('boom');
//eventstream.when('boom', function(e, anything) {
//   console.log('boom event handled in eventstream, callback 2', e, anything, this);
//});
//eventstream.when('tree', function(e, anything) {
//   console.log(e, anything, this);
//});
//bob.when('boom', function(e, anything) {
//   console.log('boom event handled in bob custom eventstream, callback 3', e, anything, this);
//});
//anotherstream.when('boom', function() {
//   console.log('ppppp');
//});
//// Trigger some more events
//eventstream.make('boom', '2');
//eventstream.make('boom', '3');
//bob.make('boom');
////setTimeout(function() {
////    eventstream.make('tree', '1', true);
////},100);
//eventstream.make('tree', '2');
////eventstream('sue').make('tree', '3', true);
//// Log
////console.log('Array of event streams created', eventstream.streams);
////console.log('Array of event streams created', bob.streams);
///*
//var thing = function() {
//    eventstream.fire('bob');
//}
//*/
//
//
//
/////*
////on(id, function(e) {
////})
////adds a callback to an id
////fire(id)
////    finds the id and calls all callbacks
////*/
//
