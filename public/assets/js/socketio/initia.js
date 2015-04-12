io.on('initia', function(obj){
    console.log('INITIA');
	
    var players = obj.players;
    var me = obj.player;
    var gamestatut = obj.gamestatut;

    lesjoueurs.clear();

    lesjoueurs.myid = me.id;
    lesjoueurs.import(players);

    lesjoueurs.hider();
    
    var startScreen = game.add.sprite(0, 0, 'startScreen');
    startScreen.inputEnabled = true;
	startScreen.events.onInputDown.add(function() { startScreen.kill(); gamestart = true; }, this);
    //gamestart=true;

    launchworld();
});
