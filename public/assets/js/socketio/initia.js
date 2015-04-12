io.on('initia', function(obj){
    console.log('INITIA');
	startScreen = game.add.sprite(0, 0, 'startScreen');
    
    var players = obj.players;
    var me = obj.player;
    var gamestatut = obj.gamestatut;

    lesjoueurs.clear();

    lesjoueurs.myid = me.id;
    lesjoueurs.import(players);

    lesjoueurs.hider();

    gamestart=true;

    launchworld();
});
