const games = [];
exports.games = games;

exports.getGame = (id) => {
  return games.find(g => Object.values(g).includes(id));
}

exports.createGame = (id) => {
  if (!games.some(g => g.host === id)) {
    const game = {
      host: id,
      guest: null
    }
    games.push(game);
    setTimeout(() => {
      const index = games.findIndex(g => g == game)
      if (index !== -1 && !game.guest) {
        games.splice(index, 1)
      }
    }, 120000);
  }
}

exports.deleteGame = (id) => {
  const index = games.findIndex(g => Object.values(g).includes(id));
  games.splice(index, 1)
}

exports.joinGame = (hostId, guestId) => {
  const game = games.find(g => g.host === hostId)
  if (game) {
    game.guest = guestId;
    const index = games.findIndex(g => g.host === guestId);
    if (index !== -1) {
      games.splice(index, 1)
    }
  } else {

  }
}

exports.getRoom = (rooms, id) => {
  return Object.keys(rooms).reduce((initial, current) => {
    return (initial === id) ? current : initial
  })
}