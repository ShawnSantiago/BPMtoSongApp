$(function () {
  var socket = io.connect('http://localhost:8082'),
      pulse_data = [],
      pulse_avg = [],
      heart_rate = 70,
      plot,
      totalPoints = 100,
      lastPeak = Date.now(),
      peakDiffs = [0, 0, 0, 0, 0, 0, 0, 0],
      freq = 0,
      y_min = 20,
      y_max = 70;

  socket.on('pulse', function (data) {

    pulse_data.push(data)
    pulse_data.shift();

    // plot.setData([ parse_data() ]);
    // plot.draw();
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

    // if (data < pulse_data[totalPoints - 2] - .2) {
    //   freq = Date.now() - lastPeak;
    //   lastPeak = Date.now();

    //   peakDiffs.push(freq);
    //   peakDiffs.shift();

    //   var peak_sum = 0;
    //   for (var i = 0; i < peakDiffs.length; i++) {
    //     peak_sum += peakDiffs[i];
    //   }
    //   heart_rate = parseInt(60 / ((peak_sum / peakDiffs.length) / 1000), 10);
    //   $('#heartrate').html(heart_rate);
    // }

  });

  // pre-fill pulse_data with all zeroes
  while (pulse_data.length < totalPoints) {
    pulse_data.push(0);
  }

  // var parse_data = function () {
  //   var res = [],
  //       min = max = pulse_data[0];

  //   for (var i = 0; i < pulse_data.length; ++i) {
  //     if (max < pulse_data[i]) { max = pulse_data[i]; }
  //     if (min < pulse_data[i]) { min = pulse_data[i]; }

  //     res.push([i, pulse_data[i] ])
  //   }

  //   //reset graph center if line is outside min/max range
  //   if (min - 10 < y_min || max + 5 > y_max) {
  //     setup(min - 10, max + 5);
  //   }

  //   return res;
  // }

//   var setup = function (min, max) {
//     //save min/max to global cars so we can center the graph
//     y_min = min;
//     y_max = max;

//     var options = {
//         colors: [ '#333' ],
//         series: {
//           shadowSize: 0,
//         },
//         yaxis: { show: false, min: min, max: max },
//         xaxis: { show: false },
//         grid: { show: true, borderWidth: 0 },
//     };

//     plot = $.plot($("#placeholder"), [ parse_data() ], options);
//   }

//   $('#placeholder').css({
//     width: '100%',
//     height: $('body').height() + 'px'
//   })

//   setup(y_min, y_max);
//   console.log(heart_rate)
// });

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
