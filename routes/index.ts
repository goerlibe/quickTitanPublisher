import { QuickMqttPublisher } from './quickMqtt';
const router = require('express').Router();

const publisher = new QuickMqttPublisher();

router.get('/connect', (req, res) => {
  res.render('con', {
    data: publisher.getConnectData()
  });
});
router.post('/connect', async (req, res) => {
  publisher.update(req.body);
  publisher.connect();
  res.redirect('/publish');
  res.render('con', { data: publisher.getConnectData() }, function(err, html) {
    res.send(html);
  });
});

router.get('/publish', (req, res) => {
  res.render('form', {
    data: publisher.getPublishData()
  });
});
router.post('/publish', (req, res) => {
  publisher.update(req.body);
  publisher.publish();
  res.render('form', {
    data: publisher.getPublishData()
  });
});

module.exports = router;
