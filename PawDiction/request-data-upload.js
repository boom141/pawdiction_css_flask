
let dog_validated = false
 document.getElementById("upload").addEventListener("change", event => {
    event.preventDefault()
    const uploaded_image = event.target.files[0]
    const image_data = new FormData()
    image_data.append('file', uploaded_image)

    const reader = new FileReader();
    reader.addEventListener("load", () => {
    document.querySelector("#canvas").style.backgroundImage = `url(${reader.result})`;
    axios.post('http://pawdiction.pythonanywhere.com/is_a_dog',image_data)
    .then(res => {
        if(Array.isArray(res.data)){
            dog_validated = true
            console.log('verifying complete')
        }else{
            console.log('image is not a dog')
    }})
    .catch( error => {console.log(error)})

    });
    reader.readAsDataURL(uploaded_image);
    
    document.getElementById('predict').addEventListener('click', event =>{
    event.preventDefault()
    result_transition()
    if(dog_validated){
        axios.post('http://pawdiction.pythonanywhere.com/predict_emotion',image_data)
        .then(res =>{
            $('.loading-wrapper').fadeOut('slow')
            console.log(res.data)
            
        })
        .catch(error =>{console.log(error)})
    }else{
        console.log('image is not a dog')
    }

})

})

const result_transition = () =>{
    $('.form').css('display', 'none')
    $('.options').css('display', 'none')
    $('.loading-wrapper').css('display', 'flex')
}