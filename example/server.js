var zetta = require('zetta');
var KairosDbCollector = require('../');

var kairos = new KairosDbCollector({
  host: process.env.KAIROS_HOST,
  port: process.env.KAIROS_PORT || 8080
});

var hub = zetta()
  .name('cloud')
  .use(kairos.collect())
  .listen(5000);
