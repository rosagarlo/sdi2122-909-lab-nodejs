module.exports = function (app, songsRepository) {
    app.get("/songs", function (req, res) {
        let songs = [{
            "title": "Blank space",
            "author": "song1",
            "price": "1.2"
        }, {
            "title": "See you again",
            "author": "song2",
            "price": "1.3"
        }, {
            "title": "Uptown Funk",
            "author": "song3",
            "price": "1.1"
        }];
        let response = {
            seller: 'Tienda de canciones',
            songs: songs
        };
        res.render("shop.twig", response);
        // let response = "";
        // if(req.query.title != null && typeof (req.query.title) != "undefined")
        //   response = "Titulo:" + req.query.title + '<br>';
        // if(req.query.author != null && typeof (req.query.author) != "undefined")
        //   response += "Autor:" + req.query.author;
        //
        // res.send(response);
    });

    app.get('/add', function (req, res) {
        let response = parseInt(req.query.num1) + parseInt(req.query.num2);

        res.send(String(response));
    });

    app.get('/songs/add', function (req, res) {
        res.render("add.twig");
    });

    app.post('/songs/add', function (req, res) {
        let song = {
                title: req.body.title,
                kind: req.body.kind,
                price: req.body.price
            }
        songsRepository.insertSong(song, function (songId){
            if(songId == null){
                res.send("Error al insertar canción");
            } else {
                res.send("Agregada la canción ID: " + songId);
            }
        });
    });

    app.get('/songs/:id', function (req, res) {
        let response = 'id: ' + req.params.id;
        res.send(response);
    });

    app.get('/songs/:kind/:id', function (req, res) {
        let response = 'id: ' + req.params.id + '<br>'
            + 'Tipo de música: ' + req.params.kind;
        res.send(response);
    });

    app.get('/promo*', function (req, res) {
        res.send('Respuesta al patrón promo*');
    });

    app.get('/pro*ar', function (req, res) {
        res.send('Respuesta al patrón pro*ar');
    });
};