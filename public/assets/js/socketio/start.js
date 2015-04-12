io.on('start', function(config){

    console.log('START');
    lesjoueurs.clear();
    gamestart=true;

// config{?,players}

    var players = config.players;

    lesjoueurs.import(players);

    //console.log(lesjoueurs.nbjoueurs);

    lesjoueurs.hider();
   // console.log(lesjoueurs.nbjoueur);

    //console.log(lesjoueurs.nbjoueur);

   // mapgroup.add(lesjoueurs.tabjoueurs[0].sprite)

    launchworld();


   // mapgroup.mask = maskGraphics;

    /*
     if (self.role=='guard')
     game.add.text(window.innerWidth-300, 10,'Vous êtes un garde',{ font: "24px Arial",fill: '#FAAF00'});

     if (self.role=='prisoner')
     game.add.text(window.innerWidth-300, 10,'Vous êtes un prisonnier',{ font: "24px Arial",fill: '#FAAF00'});
     */

//    maskGraphics = this.game.add.graphics(0, 0);

    //  floor.mask=maskGraphics;

});