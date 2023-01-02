const upload_btn =  document.getElementById("upload")
upload_btn.onchange = (e) =>{
    e.preventDefault()
    const input_image = upload_btn.files[0]
    const image_data = new FormData()
    image_data.append('file', input_image)

    const reader = new FileReader();
    reader.onload = () =>{
        $('#predict').css({'pointer-events': 'none', 'background-color': 'rgba(255, 255, 255, 0.677)'})
        document.querySelector("#canvas").style.backgroundImage = `url(${reader.result})`;
       
    }
    reader.readAsDataURL(input_image);
    $('.alert-container').hide()
    $('.upload-loading').css('display', 'flex')
    
    axios.post('https://pawdiction.pythonanywhere.com/is_a_dog',image_data)
    .then(res => {
        if(Math.floor(res.data[0]) >= 90){
            $('.upload-loading').hide()
            $('#predict').css({'pointer-events': 'fill', 'background-color': 'white'})
        }else{
            $('.upload-loading').hide()
            $('.alert-container').css({'display': 'flex'})
    }}).catch( error => {console.log(error)}) 


document.getElementById('predict').addEventListener('click', (e) =>{  
    e.preventDefault()
    $('.upload-section').hide()
    $('.loading-wrapper').css('display', 'flex')
    axios.post('https://pawdiction.pythonanywhere.com/predict_emotion', image_data)
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

}

const alert_btn = document.querySelectorAll('.alert-btn')

alert_btn.forEach((elem,index)=>{
    elem.addEventListener('click',()=>{
       option_handler(index)
    })
})

option_handler = (index) => {
    if (index === 0){
        $('#predict').css({'pointer-events': 'fill', 'background-color': 'white'})
        $('.alert-container').hide()
    }else{
        window.location.reload()
    }
}