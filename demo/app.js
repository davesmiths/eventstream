

// Create some steams
bob = eventstream.new();
anotherstream = bob.new();

// Triggers before on are not honoured
eventstream.do('boom', '1');


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
}, true);
bob.when('boom', function(e, anything) {
   console.log('boom event handled in bob custom eventstream, callback 3', e, anything, this); 
});
anotherstream.when('boom', function() {
   console.log('ppppp'); 
});

// Trigger some more events
eventstream.do('boom', '2');
eventstream.do('boom', '3');
bob.do('boom');

setTimeout(function() {
    eventstream.do('tree', '1', true);
},100);
eventstream.do('tree', '2', true);

eventstream('sue').do('tree', '3', true);

// Log
console.log('Array of event streams created', eventstream.streams);
console.log('Array of event streams created', bob.streams);


/*


var thing = function() {
    eventstream.fire('bob');
}


*/



/*
on(id, function(e) {
})
adds a callback to an id
fire(id)
    finds the id and calls all callbacks
*/