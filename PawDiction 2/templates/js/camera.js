//OPEN CAMERA
let canvas = document.querySelector('#canvas');
let context = canvas.getContext('2d');
let video = document.querySelector('#video');

$('#predict').css({'pointer-events': 'none', 'background-color': 'rgba(255, 255, 255, 0.677)'})
$('#retake').css({'pointer-events': 'none', 'background-color': 'rgba(255, 255, 255, 0.677)'})


const camera_init = (constraints) =>{
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream){
		video.srcObject = stream;
		video.play();
	})
}


if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    let init_constraints = {
        audio:false,
        video: {facingMode: 'user'}
     }

	camera_init(init_constraints)
}

let cameraFacing = false
document.querySelector('.camera-change img').addEventListener('click', ()=>{
    cameraFacing = !cameraFacing
    let new_constraints = null

    if(cameraFacing){
        new_constraints = {
            audio: false,
            video: {facingMode: { exact: "environment" }}
        }

    }else{
        new_constraints = {
            audio: false,
            video: {facingMode: 'user'}
        }

    }

    camera_init(new_constraints)
})

document.getElementById('snap').addEventListener('click', (e) =>{
	context.drawImage(video, 1,1,640,480);
    $('#snap').css({'pointer-events': 'none', 'background-color': 'rgba(255, 255, 255, 0.677)'})
    const image_file = canvas.toDataURL('image/jpeg')
    const image_data = new FormData()
    image_data.append('file', image_file)

	$('.alert-container').hide()
    $('.upload-loading').css('display', 'flex')

	axios.post('https://pawdiction.pythonanywhere.com/camera_verify',image_data)
    .then(res => {
        if(Math.floor(res.data[0]) >= 90){
            $('.upload-loading').hide()
            $('#predict').css({'pointer-events': 'fill', 'background-color': 'white'})
            $('#retake').css({'pointer-events': 'fill', 'background-color': 'white'})
        }else{
            $('.upload-loading').hide()
            $('.alert-container').css({'display': 'flex'})
    }}).catch( error => {console.log(error)}) 
})


document.getElementById('predict').addEventListener('click', (e) =>{  
    e.preventDefault()

    const image_file = canvas.toDataURL('image/jpeg')
    const image_data = new FormData()
    image_data.append('file', image_file)

    $('.upload-section').hide()
    $('.loading-wrapper').css('display', 'flex')
    axios.post('https://pawdiction.pythonanywhere.com/camera_prediction', image_data)
    .then(res =>{
        if(Array.isArray(res.data)){
            const absolute_results = []
            $('.loading-wrapper').css('display', 'none')
            $('.result-section').css('display', 'flex')
            for(let result of res.data){
                absolute_results.push(Math.floor(result))
            }
            load_meter(absolute_results)
        }else{
            window.location = '../templates/upload.html'
        }
        
    })
    .catch(error =>{console.log(error)})

const meter = document.querySelectorAll('.actual-meter')
const meter_block = document.querySelectorAll('.emotion-container')


const emotion = ['ANGRY', 'HAPPY', 'RELAXED', 'SAD']
const load_meter = (results) =>{
    meter_block.forEach((element,index) =>{
        $(element).delay(parseInt(`${index+1}00`)).animate({
            height: '4rem'
        })
    })

    meter.forEach((element,index) =>{
        $(element).delay(1000).animate({width: `${results[index]}%`})
    })
    
    const highest_percentage_index = results.indexOf(Math.max(...results))
    $('.result-section').append(`<h1 class="result-text">Final result: ${emotion[highest_percentage_index]} (${results[highest_percentage_index]}%)</h1>`)
    $('.result-text').delay(1800).slideDown('slow')

}
})


const alert_btn = document.querySelectorAll('.alert-btn')

alert_btn.forEach((elem,index)=>{
    elem.addEventListener('click',()=>{
       option_handler(index)
    })
})

option_handler = (index) => {
    if (index === 0){
        $('#predict').css({'pointer-events': 'fill', 'background-color': 'white'})
        $('#retake').css({'pointer-events': 'fill', 'background-color': 'white'})
        $('.alert-container').hide()
    }else{
        window.location.reload()
    }
}