// webrtc script file
var webrtc = (function() {


// variables de inicialització: 
    var getVideo = true,
	    getAudio = true,
	    video = document.getElementById('webcam'),
	    feed = document.getElementById('feed'),
	    feedContext = feed.getContext('2d'),
	    display = document.getElementById('display'),
	    displayContext = display.getContext('2d');
	    
    navigator.getUserMedia ||
	    (navigator.getUserMedia = navigator.mozGetUserMedia ||
		    navigator.webkitGetUserMedia || navigator.msGetUserMedia);

    window.audioContext ||
	    (window.audioContext = window.webkitAudioContext);
    
/*
 * to be able to show our video stream in a canvas element, we will need to animate ur canvas
 * for this we can use requestAnimationFrame .. api for reflow and repaint 
 * it will also run only when our tab is currently visible to save battery life
 * is also prefixed, so we need to include another shim :D
 */

    window.requestAnimationFrame ||
	    (window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
		    window.mozRequestAnimationFrame ||
		    window.oRequestAnimationFrame ||
		    window.msRequestAnimationFrame ||
		    function(callback) {
			window.setTimeout(callback, 1000 / 60);
		    });

    function onSuccess(stream) {
	var videoSource,
		audioContext,
		mediaStreamSource;

	if (getVideo) {
	    if (window.webkitURL) {
		videoSource = window.webkitURL.createObjectURL(stream);
	    } else {
		videoSource = stream;
	    }

	    video.autoplay = true;
	    video.src = videoSource;

	    display.width = feed.width = 320;
	    display.height = feed.height = 240;

	    streamFeed();
	}

	if (getAudio && window.audioContext) {
	    audioContext = new window.audioContext();
	    mediaStreamSource = audioContext.createMediaStreamSource(stream);
	    mediaStreamSource.connect(audioContext.destination);
	}
    }

    function onError() {
	alert('There has been a problem retreiving the streams - are you running on file:/// or did you disallow access?');
    }

    function takePhoto() {
	var photo = document.getElementById('photo'),
		context = photo.getContext('2d');

	photo.width = display.width;
	photo.height = display.height;

	context.drawImage(display, 0, 0, photo.width, photo.height);
    }

    function requestStreams() {
	if (navigator.getUserMedia) {
	    navigator.getUserMedia({
		video: getVideo,
		audio: getAudio
	    }, onSuccess, onError);
	} else {
	    alert('getUserMedia is not supported in this browser.');
	}
    }







    function streamFeed() {
	requestAnimationFrame(streamFeed);
	displayContext.drawImage(video, 0, 0, display.width, display.height);
	/*
	 * testing purposes lets set our display context to directly show our video feed
	 * well change this in the next step
	 */
    }







    function initEvents() {
	var photoButton = document.getElementById('takePhoto');
	photoButton.addEventListener('click', takePhoto, false);
    }

    (function init() {
	requestStreams();
	initEvents();
    }());
})();



