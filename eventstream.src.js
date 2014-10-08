// Custom events
(function(context) {

    'use strict';

    var eventstreamjs = {
    
        "new":function() {
            
            var rtn
                ,on
                ,trigger
                ,ons = {}
            ;
            
            trigger = function(id, anything, collect) {
            
                var e = {}
                    ,callbacks
                ;
                
                // if ons[id] does not exist do nothing
                if (ons[id] !== undefined) {
                    
                    e.id = id;
                    e.triggers = ons[id].triggers += 1;
                    e.triggered = ons[id].triggered += 1;
                    
                    callbacks = function() {
                        var i,
                            onsidcallbacklength = ons[id].callback.length
                        ;
                        for (i = 0; i < onsidcallbacklength; i++) {
                            if (ons[id].callback[i].collect) {
                                setTimeout((function(ons,id, i, anything) {
                                    return function() {
console.log(e.triggered, ons[id].triggered);
                                        ons[id].callback[i].fn(e, anything);
                                }}(ons, id, i, anything)), 1);
                            }
                            else {
                                ons[id].callback[i].fn({id:id, triggered:e.triggered, triggers:ons[id].triggers}, anything);
                            }
                        }
                    };
                    setTimeout(callbacks,collect);
                    
                }
                
            };
            
            on = function(id, fn, collect) {
                ons[id] = ons[id] || {triggered:0,triggers:0,callback:[]};
                collect = collect === undefined ? false : collect;
                ons[id].callback.push({fn:fn, collect:collect});
            };
            
            rtn = {
                on:on
                ,trigger:trigger
            };
            
            eventstreamjs.streams.push(rtn);
            
            return rtn;
        }
        ,streams: []
    };
    
    context.eventstreamjs = eventstreamjs;
    context.eventstream = context.eventstream || eventstreamjs.new();
            
}(this));