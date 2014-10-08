// Custom events
(function(context) {

    'use strict';

    var db = {}
        ,trigger
        ,on
    ;
    
    trigger = function(id, fn) {
    
        var done
            ,fnexists = fn ? true : false
        ;
        
        db[id] = db[id] || {count:0,length:0,callback:[]};
        
        db[id].length += 1;
        
        done = function() {
            var cb = function() {
                var dbidcallbacklength = db[id].callback.length
                    ,i
                ;
                db[id].count += 1;
                if (db[id].count === db[id].length && dbidcallbacklength) {
                    for (i = 0; i < dbidcallbacklength; i++) {
                        db[id].callback[i]();
                    }
                }
            }
            // If the function exists then treat as a async, even if no AJAX is done in the function
            if (fnexists) {
                // setTimeout ensures all triggers are collected into the db before a done is called, thus allowing db[id].length to be more than 1
                setTimeout(cb, 1);
            }
            // Otherwise call done immediately, allows the use of the on/trigger pattern without using setTimeout unnecessarily
            else {
                cb();
            }
        }
        fn = fn || function(done) {done()};
        fn(done);
    };
    
    on = function(id, fn) {
        db[id] = db[id] || {count:0,length:0,callback:[]};
        db[id].callback.push(fn);
    };
    
    context.eventstream = {on: on, trigger: trigger};
            
}(this));