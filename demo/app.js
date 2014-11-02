


// Create some steams
bob = eventstream.new();
anotherstream = bob.new();
// Triggers before on are not honoured
eventstream.make('boom', '1');
// Add some event handling
eventstream.when('boom', function(e, anything) {
   console.log('boom event handled in eventstream, callback 1', e, anything, this);
});
// Clear any boom events
eventstream.when('boom');
eventstream.when('boom', function(e, anything) {
   console.log('boom event handled in eventstream, callback 2', e, anything, this);
});
eventstream.when('tree', function(e, anything) {
   console.log(e, anything, this);
});
bob.when('boom', function(e, anything) {
   console.log('boom event handled in bob custom eventstream, callback 3', e, anything, this);
});
anotherstream.when('boom', function() {
   console.log('ppppp');
});
// Trigger some more events
eventstream.make('boom', '2');
eventstream.make('boom', '3');
bob.make('boom');
//setTimeout(function() {
//    eventstream.make('tree', '1', true);
//},100);
eventstream.make('tree', '2');
//eventstream('sue').make('tree', '3', true);
// Log
//console.log('Array of event streams created', eventstream.streams);
//console.log('Array of event streams created', bob.streams);
/*
var thing = function() {
    eventstream.fire('bob');
}
*/



///*
//on(id, function(e) {
//})
//adds a callback to an id
//fire(id)
//    finds the id and calls all callbacks
//*/
