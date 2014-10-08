

// Create some steams
bob = eventstreamjs.new();
eventstream = eventstream || eventstreamjs.new();


// Triggers before on are not honoured
eventstream.trigger('boom', '1');


// Add some event handling
eventstream.on('boom', function(e, anything) {
   console.log('boom event triggered in eventstream, callback 1', e, anything, this); 
});
eventstream.on('boom', function(e, anything) {
   console.log('boom event triggered in eventstream, callback 2', e, anything, this);
});

eventstream.on('tree', function(e, anything) {
   console.log(e, anything, this);
}, true);
bob.on('boom', function(e, anything) {
   console.log('boom event triggered in bob custom eventstream, callback 3', e, anything, this); 
});


// Trigger some more events
eventstream.trigger('boom', '2');
eventstream.trigger('boom', '3');
bob.trigger('boom');

setTimeout(function() {
    eventstream.trigger('tree', '1', true);
},100);
eventstream.trigger('tree', '2', true);


// Log
console.log('Array of event streams created', eventstreamjs.streams);



/*
on(id, function(e) {
    e.triggers gives the number of triggers for this id
    e.triggered gives the number of triggers triggered
    if (e.triggered === e.triggers) { // It's possible e.triggers will change as the script carries on, but I think this is acceptable
        // all done, now continue
    }
})
adds a callback to an id
trigger(id)
    finds the id and calls all callbacks

*/