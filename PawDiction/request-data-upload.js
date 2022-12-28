
const upload_btn =  document.getElementById("upload")
 upload_btn.onchange = (e) =>{
    e.preventDefault()
    const input_image = upload_btn.files[0]
    const image_data = new FormData()
    image_data.append('file', input_image)

    const reader = new FileReader();
    reader.onload = () =>{
        document.querySelector("#canvas").style.backgroundImage = `url(${reader.result})`;
    }
    reader.readAsDataURL(input_image);

    axios.post('http://127.0.0.1:5000/is_a_dog',image_data)
    .then(res => {
        if(Array.isArray(res.data)){
            console.log('verifying complete')
            $('#predict').css('pointer-events', 'all')
        }else{
            console.log('image is not a dog')
    }}).catch( error => {console.log(error)}) 


document.getElementById('predict').addEventListener('click', event =>{
    event.preventDefault()
    result_transition()

    axios.post('http://127.0.0.1:5000/predict_emotion', image_data)
    .then(res =>{
        const absolute_results = []
        $('.loading-wrapper').css('display', 'none')
        $('.result-section').css('display', 'flex')
        for(let result of res.data){
            absolute_results.push(Math.floor(result))
        }
        load_meter(absolute_results)
        
    })
    .catch(error =>{console.log(error)})

})

}


const result_transition = () =>{
    $('.form').css('display', 'none')
    $('.options').css('display', 'none')
    $('.loading-wrapper').css('display', 'flex')
}

const meter = document.querySelectorAll('.actual-meter')

const emotion = ['ANGRY', 'HAPPY', 'RELAXED', 'SAD']
const load_meter = (results) =>{
    meter.forEach((element,index) =>{
        $(element).animate({width: `${results[index]}%`})
    })
    
    const highest_percentage_index = results.indexOf(Math.max(...results))
    $('.result-section').append(`<h1 class="result-text">Final result: ${emotion[highest_percentage_index]} (${results[highest_percentage_index]}%)</h1>`)

}