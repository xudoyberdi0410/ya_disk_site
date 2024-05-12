// const axios = require('axios');

let input = document.getElementById("dropzone-file")
let btn = document.getElementById("upload_button")
let formData = new FormData()

let basic_url = "https://cloud-api.yandex.net/v1/disk"
const token = ${{ secrets.YA_TOKEN }}
let headers = {
    "Authorization": `OAuth ${token}`,
}   
let params = {
    "path": "/test/test.txt",
}

input.addEventListener("change", () => {
    document.getElementById("filename").innerHTML = input.files[0].name
    document.getElementById("file_types").style = "display: none"
})
btn.addEventListener("click", () => {
    params['path'] = `/test/${input.files[0].name}`
    axios({url: `${basic_url}/resources/upload`, params:params, headers: headers})
    .then(function (response){
        let href = response.data.href
        axios.put(href, input.files[0])
    })
})