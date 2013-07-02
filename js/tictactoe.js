$(function() {

  var game              = $('#game');     // the "game" container
  var board             = $('#board');    // the board  container
  var status_indicators = $('#teams li'); // status bar container
  var tiles = [];                         // all the "tiles"
  var players = [                         // player data
    { name: 'Ernie',
      marker: '&times;',
      img_url: 'img/ernie.jpg',
      indicator: $(status_indicators[0])
    },
    { name: 'Bert',
      marker: '&oslash;',
      img_url: 'img/bert.jpg',
      indicator: $(status_indicators[1])
    }
  ];
  var current_player;                     // player data
  var turns  = 0;                         // elapsed turns
  var win_combos = [                      // winning combos
    [0,1,2], [3,4,5], [6,7,8],              // horizontal wins
    [0,3,6], [1,4,7], [2,5,8],              // vertical wins
    [0,4,8], [2,4,6]                        // diagonal wins
  ];

  var initialize = function() {
    // ready the board for game play
    for (var i=0; i < 9; i++) {
      var tile = $('<div/>');
      tile.attr({'id':'tile'+i, 'class':'tile'});
      tile.on('click', handle_click);
      tile.appendTo(board);
      tiles.push(tile);
    }
    current_player = players[0];
    var player_indicators = [players[0].indicator, players[1].indicator];
    $.each(player_indicators, function(index, indicator) {
      var indicator = $(indicator);
      $('.team', indicator).html(players[index].marker);
      $('.player', indicator).html(players[index].name);
      $('img', indicator).attr('src', players[index].img_url);
      if (players[index] == current_player) {
        indicator.addClass('current');
      }
    })
    game.fadeIn();
  };

  var is_active = function(tile) {
    // boolean - evaluate whether or not is 'active'
    return tile.hasClass('active');
  };
  var activate_tile = function(tile) {
    // activate a tile and increment the turn counter
    tile.html(current_player.marker);
    tile.addClass('active');
    tile.data('player', current_player);
    turns++;
  };


  var toggle_player = function() {
    // toggle the current player and update related UI
    current_player = players[get_current_player_index()];
    status_indicators.removeClass('current');
    current_player.indicator.addClass('current');
  };

  var get_current_player_index = function() {
    // return the current player's index in the players array
    return turns % 2;
  };

  var get_board_data = function() {
    // return the current player's positions on the board
    var current_player_board_data = [];
    $.each(tiles, function(index, tile) {
      if (tile.data('player') == current_player) {
        current_player_board_data.push(index);
      }
    });
    return current_player_board_data;
  };

  var is_win = function() {
    // boolean - whether or not the current player's positions result in a win
    var board_data = get_board_data();
    for (var i = 0; i < win_combos.length; i++) {
      var combo = win_combos[i]

      var matches = _.filter(combo, function(x) {
        return (board_data.indexOf(x) > -1)
      });
      if (matches.length == combo.length) {
        show_combo(combo);
        return true;
      }

    }
    return false;
  };

  var is_tie = function() {
    // boolean - has the game resulted in a tie?
    return (turns == tiles.length);
  };

  var handle_win = function() {
    // update the UI to reflect that a win has occurred.
    $.each(tiles, function(index, tile) {
      tile.off('click');
    });
    var args = {
      img_src: current_player.img_url,
      img_alt: current_player.name,
      message: 'Congratulations, <span id="winner">'
        + current_player.name
        + '</span>!'
    };
    update_results(args);
  };

  var handle_tie = function() {
    // update the UI to reflect that a tie game has occurred.
    var args = {
      img_src: 'img/rubberduckie.jpg',
      img_alt: 'Rubber Duckie',
      message: 'Tie Game!'
    };
    update_results(args);
  }

  update_results = function(args) {
    /* call this to update the "results" container after detecting
       a win or a tie */

    var results   = $('#results');
    var winner_el = $('h1', results);
    var image_el  = $('.image', results);
    var button    = $('button', results);
    var image     = $('<img/>');
    image.attr({
      src: args.img_src,
      alt: args.img_alt
    });
    image_el.html(image);
    winner_el.html(args.message);
    button.on('click', new_game);
    hide_indicators();
    setTimeout(function() {
      results.fadeIn(500);
    },1000);
  }

  var hide_indicators = function() {
    // call this to hide the "status" container after detecting a win or a tie
    status_indicators.animate({'opacity':0},2000);
  };

  var show_combo = function(combo) {
    // call this to highlight the combination of tiles that resulted in a win
    for (var i = 0; i < combo.length; i++) {
      tiles[combo[i]].addClass('combo');
    }
  }

  var handle_click = function() {
    // this function is bound to a click event for each tile on the board
    var tile = $(this);
    if (is_active(tile)) {
      return false;
    }
    activate_tile(tile);
    if (is_win()) {
      handle_win();
      return false;
    }
    if (is_tie()) {
      handle_tie();
      return false;
    }
    toggle_player();
  }

  var new_game = function() {
    // refresh the page to begin a new game
    window.location.href = window.location.href
  };

  // call initialize() to get the party started
  initialize();

});
