// const axios = require('axios');

let input = document.getElementById("dropzone-file")
let btn = document.getElementById("upload_button")
let formData = new FormData()

const folder_path = "/test"
let file_name = ""

let basic_url = "https://cloud-api.yandex.net/v1/disk"
const token = "y0_AgAAAABB9ET6AAvCUwAAAAEEa64SAAArZxMIpO5DsrqQl5veh5bTIg9Vkg"
let headers = {
    "Authorization": `OAuth ${token}`,
}   
let params = {
    "path": "/test/test.txt",
}

async function get_info(path){
    params['path'] = path

    let url = `${basic_url}/resources`
    let resp = await axios({
        url: url,
        method: 'get',
        params:params,
        headers:headers
    })
    return resp

}

async function do_publish(path) {
    params['path'] = path
    await axios({
        url: `${basic_url}/resources/publish`,
        method: 'put',
        params:params,
        headers:headers
    })
}
input.addEventListener("change", () => {
    document.getElementById("filename").innerHTML = input.files[0].name
    document.getElementById("file_types").style = "display: none"
    file_name = input.files[0].name
})
btn.addEventListener("click", () => {
    btn.setAttribute("disabled", "disabled")
    btn.innerHTML = "Загружается..."
    params['path'] = `${folder_path}/${file_name}`
    axios({url: `${basic_url}/resources/upload`, params:params, headers: headers})
    .then(function (response){
        let href = response.data.href
        const optios = {
            onUploadProgress: (progressEvent) => {
                let percent = Math.floor(progressEvent.loaded / progressEvent.total*100)
                if (percent == 100) percent = 99
                document.getElementById("progress").innerHTML = percent+"%"
                document.getElementById("progress").style = `width: ${percent}%`
            }
        }
        axios.put(href, input.files[0], optios)
        .then((_) => {
            document.getElementById("progress").innerHTML = "Публикуется"
            document.getElementById("progress").style = `width: 100%`
            do_publish(params['path']).then(()=>{
                get_info(params['path']).then((data)=>{
                    while (!data.data.public_url){
                        data = get_info(params['path'])
                    }
                    document.getElementById("progress").innerHTML = "Опубликовано"
                    document.getElementById("npm-install").value = data.data.public_url
                    document.getElementById("copy_btn").onclick = () => {
                        navigator.clipboard.writeText(data.data.public_url)
                        document.getElementById("default-message").classList.add("hidden")
                        document.getElementById("success-message").classList.remove("hidden")

                    }
                    document.getElementById("copy-text").classList.remove("invisible")
                })
            })
        })
        .catch((error) => {
            console.log(error);
        })
    })
    .catch(function (error){
        console.log(error)
    })
})
