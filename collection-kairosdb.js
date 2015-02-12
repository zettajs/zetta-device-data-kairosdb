var Rx = require('rx');
var util = require('util');
var kdb = require('kairosdb');
var StatsCollector = require('zetta-device-data-collection');

var KairosDbCollector = module.exports = function(options) {
  StatsCollector.call(this);
  options = options || {};
  var windowMs = options.windowMs || 2000;
  
  var self = this;
  var kdbClient = kdb.init(options.host, options.port || 8080);

  Rx.Observable.fromEvent(this.emitter, 'event')
    .map(function(e) { return e; })
    .window(function() { return Rx.Observable.timer(windowMs); })
    .flatMap(function(e) { return e.toArray(); })
    .filter(function(arr) { return arr.length > 0 })
    .subscribe(function (data) {
      kdbClient.datapoints(data, function (err, result) {
        if (err) {
          self.server.error('Failed to send stats to kairosdb, ' + err);
        }
      });
    });
};
util.inherits(KairosDbCollector, StatsCollector);








