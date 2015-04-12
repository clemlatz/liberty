
io.on('join', function(player){
    console.log('JOIN');
    var isowner=false;

    var j  = new Joueur(player.id,player.role,isowner);
    j.x=player.x;
    j.y=player.y;


    lesjoueurs.add(j);
    lesjoueurs.hider();
});