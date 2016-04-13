$(function () {
  var socket = io.connect('http://localhost:8082'),
      pulse_data = [],
      pulse_avg = [],
      totalPoints = 100,
      heart_rate = 0;

  socket.on('pulse', function (data) {

    pulse_avg.push(data);
    if (pulse_avg.length >= 10) {
      pulse_avg.shift();

      var peak_sum = 0;
      for (var i = 0; i < pulse_avg.length; i++) {
        peak_sum += pulse_avg[i];
      }
      heart_rate = parseInt((peak_sum / pulse_avg.length), 10);
      $('#heartrate').html(heart_rate+20);
    }

  });

  // pre-fill pulse_data with all zeroes
  while (pulse_data.length < totalPoints) {
    pulse_data.push(0);
  }

});

// soundcloud

SC.initialize({
      client_id: "51a05ad7e3e35bef46da014ffdfa38b5",
      redirect_uri: "localhost:8000",

  });

function getTracks(){
  SC.get("/tracks", {
      bpm:{
        from:100,
        to: 150
      },
      limit: 10
    }, function (tracks) {

        var trackList = [];

        for (var i = 0; i < tracks.length; i++) {

            trackList.push(tracks[i].permalink_url);

        }
        embedPlayer(trackList);
    });
}

    function embedPlayer (trackListArray) {
      SC.oEmbed(trackListArray[0]// user or playlist to embed
        , { color: "000"
          , auto_play: true
          , maxwidth: 800
          , maxheight: 1000
          , show_comments: true } // options
        , document.getElementById("widget") // what element to attach player to
      );
    }

    window.onload = function() {
      getTracks();
    };
