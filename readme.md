eventstream
===

__Nearly ready to use, but not just yet__

Listeners
---
```
eventstream.on('eventname', function(e, thing) {
    //callback
});
// Adds a listener for the event 'eventname'
// When triggered calls callback

eventstream.on('eventname');
// Removes a listener

eventstream.on('eventname', 5000, callback, fallback);
// Listener applied from now for 5 seconds
// If the event is not called in that time fallback is called

eventstream.on('eventname', -5000, callback, fallback);
// The previous 5 seconds are checked for calls
// If the event was not called in that time fallback is called

eventstream.on('eventname', -5000, 5000, callback, fallback);
// The previous 5 seconds are checked for calls
// and the listener is applied for the next 5 seconds
// If the event was and is not called in that window of time
// fallback is called

Aliases
eventstream.if
eventstream.off
eventstream.on
eventstream.when
```

Triggers
---
```
eventstream.call('eventname');
// Triggers eventname

eventstream.call('eventname', thing);
// Triggers eventname and passes thing

eventstream.call(1, 'eventname', thing);
// Same as above, but explicitly says trigger eventname
// on this stream (eventstream) and any down stream

eventstream.call(0, 'eventname', thing);
// Trigger eventname only this stream

eventstream.call(-1, 'eventname', thing);
// Trigger eventname on this stream and any up stream

Aliases
eventstream.call
eventstream.do
eventstream.trigger

```

Streams
---
```
a = eventstream;
b = a.new('b');
c = b.new('c');
bb = a.new('bb');
z = c.new('z',true);

Produces the following map of streams:
             c--
            /
       b----
      /
 -a---
      \
       bb-------

 -z-------------
```