io.on('initia', function(obj){
    console.log('INITIA');
	
    var players = obj.players;
    var me = obj.player;
    var gamestatut = obj.gamestatut;

    lesjoueurs.clear();

    lesjoueurs.myid = me.id;
 //   console.log(players);
    lesjoueurs.import(players);
    lesjoueurs.hider();
	
    gamestart=true;

    launchworld();
});
