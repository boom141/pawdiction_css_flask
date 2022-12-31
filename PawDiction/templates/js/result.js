window.onload = () =>{
    axios.get('http://127.0.0.1:5000/predict_emotion')
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

const emotion = ['ANGRY', 'HAPPY', 'RELAXED', 'SAD']
const load_meter = (results) =>{
    meter.forEach((element,index) =>{
        $(element).animate({width: `${results[index]}%`})
    })
    
    const highest_percentage_index = results.indexOf(Math.max(...results))
    $('.result-section').append(`<h1 class="result-text">Final result: ${emotion[highest_percentage_index]} (${results[highest_percentage_index]}%)</h1>`)

}


}


