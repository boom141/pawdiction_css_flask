//OPEN CAMERA
let canvas = document.querySelector('#canvas');
let context = canvas.getContext('2d');
let video = document.querySelector('#video');

if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
	navigator.mediaDevices.getUserMedia({video:true}).then(function(stream){
		video.srcObject = stream;
		video.play();
	})
}

document.getElementById('snap').addEventListener('click', () =>{
	context.drawImage(video, 1,1,638,478);
})

