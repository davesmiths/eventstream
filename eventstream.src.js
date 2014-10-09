// Custom events
(function(context) {

    'use strict';

    var eventstream
        ,streams = []
    ;
    
    eventstream = function() {
            
        var rtn
            ,when
            ,off
            ,doo
            ,create
            ,ons = {streams:{},ons:{}}
        ;
        
        doo = function(id, anything) {
        
            var e = {id:id}
                ,i
                ,onCallbackLength
                ,on = ons[id]
            ;
            
            // if ons[id] does not exist do nothing
            if (on !== undefined) {
                
                onCallbackLength = on.callback.length;
                
                for (i = 0; i < onCallbackLength; i++) {
                    on.callback[i](e, anything);
                }
                
            }
            
        };
        
        when = function(id, fn) {
            if (fn) {
                ons[id] = ons[id] || {callback:[]};
                ons[id].callback.push(fn);
            }
            else {
                ons[id].callback = [];
            }
        };
        
        rtn = function(ns) {
            if (ons.streams[ns])
            return rtn;
        };
        
        rtn.when = when;
        rtn.do = doo;
        rtn.new = eventstream;
        rtn.streams = streams;
        
        streams.push(rtn);
        
        return rtn;
        
    };
    
    context.eventstream = eventstream();
            
}(this));
/*

Add
    jsevs.when('bob opens the door', 'do this')
Clear
    jsevs.when('bob opens the door', 'do nothing')
    jsevs.when('bob opens the door', null|0|false|undefined)
Trigger
    jsevs.do('bob opens the door', 'he's wearing green!');

Namespaced
Add
    jsevs('sue').when('bob opens the door', 'do this')
    jsevs('imagefill').when('bob opens the door', function() {})
Clear
    jsevs('sue').when('bob opens the door', 'do nothing')
    jsevs('harry').when('bob opens the door', null|0|false|undefined)
    jsevs('imagefill').when('bob opens the door')
Trigger
    jsevs('sue').do('bob opens the door', 'he's wearing green!');
jsev    

*/


