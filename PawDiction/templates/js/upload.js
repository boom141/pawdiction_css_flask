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
    $('.upload-loading').css('display', 'flex')
    
    axios.post('http://127.0.0.1:5000/is_a_dog',image_data)
    .then(res => {
        if(Array.isArray(res.data)){
            $('.upload-loading').css('display', 'none')
            $('#predict').css({'pointer-events': 'fill', 'background-color': 'white'})
        }else{
            console.log('image is not a dog')
    }}).catch( error => {console.log(error)}) 


document.getElementById('predict').addEventListener('click', () =>{  
    window.location = `../templates/result-page.html`

})

}
