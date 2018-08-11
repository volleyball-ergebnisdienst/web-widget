/* Volleyball Ergebnisdienst Web Widget */
(function (vly, window, document, undefined) {
  var createHeader = function (name) {
    var place = document.createElement('th');
    place.textContent = name;
    return place;
  };

  var createGameEntry = function (data) {
    var date = new Date(data.datetime);

    var row = document.createElement('tr');

    var place = document.createElement('td');
    if (data.datetime) {
        place.textContent = date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear();
    }
    row.appendChild(place);
    // TODO: no time
    var time = document.createElement('td');
    if (data.datetime) {
        time.textContent = date.getHours() + ':' + ('0'+date.getMinutes()).slice(-2);
    }
    row.appendChild(time);
    var team = document.createElement('td');
    team.textContent = data.home_team;
    row.appendChild(team);
    var games = document.createElement('td');
    games.textContent = data.away_team;
    row.appendChild(games);
    var gamesWon = document.createElement('td');
    if (data.result) {
        gamesWon.textContent = data.result;
    }
    if (data.sets) {
        gamesWon.textContent += ' (' + data.sets.join(', ') + ')';
    }
    row.appendChild(gamesWon);

    return row;
  };

  var createEntry = function (data, optGames, teamExp, special) {
    var row = document.createElement('tr');

    var place = document.createElement('td');
    if (teamExp && data.teamname.match(new RegExp(teamExp, 'i'))) {
      row.className = 'vly-team';
    }
    place.textContent = data.place;
    row.appendChild(place);
    var shift = document.createElement('td');
    if (data.shift) {
      var chevron = document.createElement('span');
      if (data.shift > 0) {
        chevron.className = 'vly-chevron vly-chevron-up vly-green';
      } else {
        chevron.className = 'vly-chevron vly-chevron-down vly-red';
      }
      chevron.title = (data.shift > 0 ? '+' : '') + data.shift;
      shift.appendChild(chevron);
    }
    row.appendChild(shift);
    var team = document.createElement('td');
    team.textContent = data.teamname;
    row.appendChild(team);
    var games = document.createElement('td');
    games.textContent = data.games;
    row.appendChild(games);
    var gamesWon = document.createElement('td');
    gamesWon.textContent = data.games_won;
    row.appendChild(gamesWon);
    if (special) {
      var homeGames = document.createElement('td');
      homeGames.textContent = data.home_games;
      row.appendChild(homeGames);
      var awayGames = document.createElement('td');
      awayGames.textContent = data.away_games;
      row.appendChild(awayGames);
      var streak = document.createElement('td');
      streak.textContent = data.streak;
      row.appendChild(streak);
    }
    var sets = document.createElement('td');
    sets.textContent = data.sets;
    row.appendChild(sets);
    if (data.balls) {
      var balls = document.createElement('td');
      balls.textContent = data.balls;
      row.appendChild(balls);
    }
    var points = document.createElement('td');
    points.textContent = data.points;
    row.appendChild(points);

    if (optGames) {
      var lastGames = document.createElement('td');
      lastGames.className = 'vly-last-games';
      data.last_games.forEach(function (element) {
        var label = document.createElement('span');
        if (element.win) {
          label.className = 'vly-label vly-green-bg';
          label.textContent = 'S';
        } else {
          label.className = 'vly-label vly-red-bg';
          label.textContent = 'N';
        }
        label.title = element.info;
        lastGames.appendChild(label);
        lastGames.appendChild(document.createTextNode(' '));
      });
      row.appendChild(lastGames);
    }

    return row;
  };

  var createFooter = function () {
    var adContainer = document.createElement('p');
    adContainer.className = 'vly-ad';
    var ad = document.createElement('small');
    var vlyLink = document.createElement('a');
    vlyLink.href = 'https://volleyball-ergebnisdienst.de';
    vlyLink.textContent = 'volleyball-ergebnisdienst.de';
    ad.textContent = 'Widget von ';
    adContainer.appendChild(ad);
    ad.appendChild(vlyLink);

    return adContainer;
  };

  var randomNumber = function (min, max) {
    return Math.floor(Math.random() * ((max - min) + 1)) + min;
  };

  var createCallback = function (container) {
    var div = container;
    var callbackName = 'vlyStandings' + randomNumber(1000, 10000);

    window[callbackName] = function (data) {
      if (!data) {
        div.textContent = 'Liga wurde nicht gefunden. Bitte Widget Code aktualisieren (data-league-id).';
        return;
      }

      if (!div.hasAttribute('data-no-header')) {
        var header = document.createElement('h1');
        header.textContent = data.name;

        if (data.url) {
          var link = document.createElement('a');
          link.setAttribute('href', data.url);
          link.setAttribute('title', 'Gehe zur Liga');
          link.setAttribute('target', '_blank');
          header.appendChild(link);
        }
        div.appendChild(header);
      }

      // var subHeader = document.createElement('h2');
      /*
       <h2>
       <% if l.state %>
       <span class="block" style="padding-bottom: 5px; color: #6d84b4; font-size: 14px;">
       <%= l.state %></span>
       <% end %>
       <span class="block" style="padding-bottom: 5px; color: #6d84b4; font-size: 14px;">
       <%= l.association %>
       </span>
       <%= l.gender_to_s %>
       </h2>
       */
      // No results
      if (data.entrys.length === 0) {
        var empty = document.createElement('div');
        var msg = document.createElement('span');
        msg.textContent = 'Aktuell sind keine Ergebnisse vorhanden.';
        empty.appendChild(msg);
        div.appendChild(empty);
        return;
      }

      var table = document.createElement('table');
      var tableHead = document.createElement('thead');
      var tableBody = document.createElement('tbody');
      var tableHeadRow = document.createElement('tr');
      tableHeadRow.appendChild(createHeader('Platz'));
      tableHeadRow.appendChild(createHeader(''));
      tableHeadRow.appendChild(createHeader('Mannschaft'));
      tableHeadRow.appendChild(createHeader('Spiele'));
      tableHeadRow.appendChild(createHeader('Siege'));
      if (div.hasAttribute('data-special')) {
        tableHeadRow.appendChild(createHeader('Heim'));
        tableHeadRow.appendChild(createHeader('Auswärts'));
        tableHeadRow.appendChild(createHeader('Streak'));
      }
      tableHeadRow.appendChild(createHeader('Sätze'));
      if (data.entrys[0].balls) {
        tableHeadRow.appendChild(createHeader('Bälle'));
      }
      tableHeadRow.appendChild(createHeader('Punkte'));
      tableHead.appendChild(tableHeadRow);
      table.appendChild(tableHead);
      table.appendChild(tableBody);

      for (var i = 0; i < data.entrys.length; i += 1) {
        tableBody.appendChild(createEntry(data.entrys[i], !div.hasAttribute('data-no-games'), div.dataset.team, div.hasAttribute('data-special')));
      }
      div.appendChild(table);

      // var revision = document.createElement('span');
      // revision.textContent = "Datenstand: " + data.updated_at;
      // div.appendChild(revision);
      if (!div.hasAttribute('data-no-ad')) {
        div.appendChild(createFooter());
      }
    };

    return callbackName;
  };

  vly.createCallbackTag = function (container) {
    var dataSrc = document.createElement('script');
    var name = createCallback(container);
    dataSrc.src = 'https://volleyball-ergebnisdienst.de/api/standings/' + container.dataset.leagueId + '?callback=' + name;
    container.appendChild(dataSrc);
  };

  vly.createGamesCallbackTag = function (container) {
      var gamesSrc = document.createElement('script');
      var gamesName = createGamesCallback(container);
      if (container.hasAttribute('data-team')) {
        gamesSrc.src = 'https://volleyball-ergebnisdienst.de/api/schedules/' + container.dataset.leagueId + '/' + container.dataset.team + '?callback=' + gamesName;
      } else {
        gamesSrc.src = 'https://volleyball-ergebnisdienst.de/api/schedules/' + container.dataset.leagueId + '?callback=' + gamesName; // latest=true last 7 days
      }
      container.appendChild(gamesSrc);
  };

  var createCssTag = function (url) {
    var css = document.createElement('link');
    css.href = url;
    css.rel = 'stylesheet';
    document.body.appendChild(css);
  };

  var createGamesCallback = function (container) {
    var div = container;
    var callbackName = 'vlyGames' + randomNumber(1000, 10000);

    window[callbackName] = function (data) {
      if (!data) {
        div.textContent = 'Liga wurde nicht gefunden. Bitte Widget Code aktualisieren (data-league-id).';
        return;
      }

      var table = document.createElement('table');
      var tableHead = document.createElement('thead');
      var tableBody = document.createElement('tbody');
      var tableHeadRow = document.createElement('tr');
      tableHeadRow.appendChild(createHeader('Datum'));
      tableHeadRow.appendChild(createHeader('Zeit'));
      tableHeadRow.appendChild(createHeader('Heim'));
      tableHeadRow.appendChild(createHeader('Auswärts'));
      tableHeadRow.appendChild(createHeader('Ergebnis'));
      tableHead.appendChild(tableHeadRow);
      table.appendChild(tableHead);
      table.appendChild(tableBody);

      data.sort(function(a, b) {
        return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
      });

      for (var i = 0; i < data.length; i += 1) {
        tableBody.appendChild(createGameEntry(data[i]));
      }
      div.appendChild(table);
    };

    return callbackName;
  };

  // default styling
  createCssTag('//volleyball-ergebnisdienst.de/widget/vly.css');

  var containers = document.getElementsByClassName('vly');
  if (containers.length === 0) {
    console.error('Kein Widget Container gefunden. Bitte Widget Code aktualisieren.');
    return;
  }

  for (var i = 0; i < containers.length; i += 1) {
    if (containers[i].hasAttribute('data-games')) {
        vly.createGamesCallbackTag(containers[i]);
    } else {
        vly.createCallbackTag(containers[i]);
    }
  }
})(window.vly = window.vly || {}, window, document);
