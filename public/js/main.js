$(function () {
  var socket = io.connect('http://localhost:8082'),
      pulse_data = [],
      pulse_avg = [],
      totalPoints = 100,
      sethrIncrease = 20,
      heart_rate = 0;

   socket.on('pulse', function (data) {

    pulse_avg.push(data);
    if (pulse_avg.length >= 10) {
      pulse_avg.shift();

      var peak_sum = 0;
      for (var i = 0; i < pulse_avg.length; i++) {
        peak_sum += pulse_avg[i];
      }
      heartRate = parseInt((peak_sum / pulse_avg.length), 10);

      heart_rate = heartRate
      
      
    }

  });

  // pre-fill pulse_data with all zeroes
  while (pulse_data.length < totalPoints) {
    pulse_data.push(0);
  }


// soundcloud

  SC.initialize({
        client_id: "51a05ad7e3e35bef46da014ffdfa38b5",
        redirect_uri: "localhost:8000",

    });

  function getTracks(genreId){
    SC.get("/tracks", {
        //genres: genreId,
        bpm:{
          from: heart_rate-5+sethrIncrease,
          to: heart_rate+5+sethrIncrease
        },
        limit: 10,

      }, function (tracks) {
          console.log(tracks);
          var trackList = [];
          for (var i = 0; i < tracks.length; i++) {
              trackList.push(tracks[i].permalink_url);
          }

          console.log(heart_rate + sethrIncrease);
          $("#heart").hide();
          var bpm = heart_rate + sethrIncrease;
          $('#heartrate_container').show();
          $('#heartrate').html("BPM: " + bpm);
          embedPlayer(trackList);
      });
  }



  function embedPlayer (trackListArray) {
    trackNumber = Math.floor((Math.random() * trackListArray.length) + 1);
    SC.oEmbed(trackListArray[trackNumber]// user or playlist to embed
      , { color: "000"
        , auto_play: true
        , maxwidth: 800
        , maxheight: 300
        , show_comments: true } // options
      , document.getElementById("widget") // what element to attach player to
    );

  }

  $( "#button" ).click(function() {
    $("#heart").show();
    var genreSelection = $( "#genreSelect option:selected" ).text();
    console.log(genreSelection);
    getTracks(genreSelection);
  });

  $("a[rel*=leanModal]").leanModal({ closeButton: ".modal_close" });

  $( "#slider-setHeartRate-min" ).slider({
        range: "min",
        value: 20,
        min: 1,
        max: 200,
        slide: function( event, ui ) {
          $( "#amountHR" ).val( "HR " + ui.value );
        }
      });
  $( "#amountHR" ).val( "HR " + $( "#slider-setHeartRate-min" ).slider( "value" ) );

  $( "#set" ).click(function() {
    sethrIncrease = $( "#slider-setHeartRate-min" ).slider( "value" )
    alert("Heartrate Set");

  });

});
