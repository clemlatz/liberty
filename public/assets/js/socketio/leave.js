io.on('leave', function(player){
    console.log('LEAVE');
    lesjoueurs.delete(player.id);
//    lesjoueurs.add(j);
});
