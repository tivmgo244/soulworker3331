// Load Youtube IFrame Player API code asynchronously.
var tag = document.createElement("script"); //Add a script tag
tag.src = "https://www.youtube.com/iframe_api"; //Set the SRC to get the API
var firstScriptTag = document.getElementsByTagName("script")[0]; //Find the first script tag in the html
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); //Put this script tag before the first one

var player; //The Youtube API player
var ypt_player = document.getElementById("player");
var playlistID = ypt_player.getAttribute("data-pl");
var ypt_thumbs = document.getElementById("ypt_thumbs");
var nowPlaying = "ypt-now-playing"; //For marking the current thumb
var nowPlayingClass = "." + nowPlaying;
var ypt_index = 0; //Playlists begin at the first video by default

function getPlaylistData(playlistID, video_list, page_token) {
  //Makes a single request to Youtube Data API
  var apiKey = "AIzaSyC7yXFAi4zCBx7lXUqYxmmvOV8doIKXp_Y"; // Don't steal this! There is a limit set of 150 hits per day.
  var theUrl =
    "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status" +
    "&maxResults=" +
    50 + //Can be anything from 1-50
    "&playlistId=" +
    playlistID +
    "&key=" +
    apiKey;
  if (page_token) {
    theUrl += "&pageToken=" + page_token;
  } //If there is page token, start there
  var xmlHttp = null;
  xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, true);
  xmlHttp.send(null);
  xmlHttp.onload = function (e) {
    //when the request comes back
    buildJSON(xmlHttp.responseText, video_list, playlistID); //send the data to buildJSON
  };
}

function buildJSON(response, list, playlistID) {
  //Takes the text response and adds it to any existing JSON data
  var results = JSON.parse(response); //Parse it
  if (!list) {
    list = [];
  } //If there is no list to add to, make one
  list.push.apply(list, results.items); //Add JSON data to the list
  if (results.nextPageToken) {
    //If the results included a page token
    getPlaylistData(playlistID, list, results.nextPageToken); //Create another data API request including the current list and page token
  } else {
    //If there is not a next-page token
    buildHTML(list); //Send the JSON data to buildHTML
  }
}

function buildHTML(data) {

  var list_data = ""; 
  for (i = 0; i < data.length; i++) {

    var item = data[i].snippet; 

    if (!item.thumbnails.medium) {
      continue;
    } 
    if (item.title.split("|")[0].length > 50) {
      ellipsis = "...";
    } else {
      ellipsis = "";
    }
    list_data +=
      '<div class="yt-thumb carousel-cell" data-ypt-index="' +
      i +
      '"><div class="yt-single"><div class="yt-img"><img class="img-fluid" alt="' +
      item.title.replace(/"/g, "'") +
      '" src="' +
      item.thumbnails.medium.url +
      '"/></div><div class="yt-single-description p-3 pt-2"><div class="date font-body mb-3"><i class="fas fa-calendar-alt me-2"></i></i><span>' +
      moment(data[i].contentDetails.videoPublishedAt).format("MMMM Do YYYY") +
      '</span></div><h4 class="yt-title">' +
      item.title.split("|")[0].substring(0, 50) +
      ellipsis +
      "</h4></div></div></div>"; 
  }
  ypt_thumbs.innerHTML = list_data; 
}



function onPlayerReady(event) {

}

getPlaylistData(playlistID);


window.onYouTubeIframeAPIReady = function () {

  player = new YT.Player("player", {
    height: "480",
    width: "854",
    playerVars: {
      listType: "playlist",
      list: playlistID,
      autoplay: 0,
      showinfo: 0,
      modestbranding: 0,
      cc_load_policy: 0,
      rel: 0
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });

  // When the player does something...
  function onPlayerStateChange(event) {
    //Let's check on what video is playing
    var currentIndex = player.getPlaylistIndex();
    var the_thumbs = ypt_thumbs.getElementsByClassName("yt-thumb");
    var currentThumb = the_thumbs[currentIndex];

    if (event.data == YT.PlayerState.PLAYING) {
      //A video is playing

      for (var i = 0; i < the_thumbs.length; i++) {
        //Loop through the thumbs
        the_thumbs[i].className = "yt-thumb carousel-cell"; //Remove nowplaying from each thumb
      }

      currentThumb.className = "yt-thumb carousel-cell " + nowPlaying; //this will also erase any other class belonging to the li
      //need to do a match looking for now playing
    }

    //if a video has finished, and the current index is the last video, and that thumb already has the nowplaying class
    if (
      event.data == YT.PlayerState.ENDED &&
      currentIndex == the_thumbs.length - 1 &&
      the_thumbs[currentIndex].className == nowPlaying
    ) {
      jQuery.event.trigger("playlistEnd"); //Trigger a global event
    }
  } 

  jQuery(document).on(
    "click",
    '[data-ypt-index]:not(".ypt-now-playing")',
    function (e) {
      //click on a thumb that is not currently playing
      ypt_index = Number(jQuery(this).attr("data-ypt-index")); //Get the ypt_index of the clicked item
      if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
        //if IOS
        player.cuePlaylist({
          //cue is required for IOS 7
          listType: "playlist",
          list: playlistID,
          index: ypt_index,
          suggestedQuality: "hd720" //quality is required for cue to work, for now
          // https://code.google.com/p/gdata-issues/issues/detail?id=5411
        }); //player.cuePlaylist
      } else {
        //yay it's not IOS!
        player.playVideoAt(ypt_index); //Play the new video, does not work for IOS 7
      }
      jQuery(nowPlayingClass).removeClass(nowPlaying); //Remove "now playing" from the thumb that is no longer playing
      //When the new video starts playing, its thumb will get the now playing class
    }
  ); //jQuery(document).on('click','#ypt_thumbs...
};


// Set Flickity Slider once YouTube Thumbnails have loaded
setTimeout(function () {
  var elem = document.querySelector(".youtube-carousel");
  var flkty = new Flickity(elem, {
    // options
    cellAlign: "left",
    wrapAround: true,
    draggable: false,
    pageDots: false
  });
}, 1000);