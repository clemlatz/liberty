io.on('player', function(player){

    if (gamestart){
        // console.log('PLAYER');
        lesjoueurs.updatepos(player);
    }

});