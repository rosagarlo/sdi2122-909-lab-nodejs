module.exports = function(app) {
  app.get("/songs", function(req, res) {
    res.send("lista de canciones");
  });

  app.get('/add', function(req, res) {
    let response = parseInt(req.query.num1) + parseInt(req.query.num2);
    res.send(String(response));
  });

  app.get('/songs/:id', function(req, res) {
    let response = 'id: ' + req.params.id;
    res.send(response);
  });
  app.get('/songs/:kind/:id', function(req, res) {
    let response = 'id: ' + req.params.id + '<br>'
        + 'Tipo de música: ' + req.params.kind;
    res.send(response);
  });
};