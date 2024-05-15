let input = document.getElementById("dropzone-file")
let btn = document.getElementById("upload_button")
let formData = new FormData()
    
class YaDisk{
    constructor(username, password){
        this.username = username
        this.password = password
        this.headers = {
            "Authorization": `Basic ${this.username}:${this.password}`,
        }
        this.basic_url = "http://89.111.173.45/"
    }
    
    async get_file_info(file_name){
        this.params['file_name'] = file_name
        
        let url = `${this.basic_url}/get_info`
        let resp = await axios({
            url: url,
            method: 'GET',
            params:this.params,
            headers:this.headers
        })
        return resp
    }
    async #get_upload_href(file_name){
        this.params = {
            'file_name': file_name
        }
        
        let url = `${this.basic_url}/get_upload_href`
        let resp = await axios({
            url: url,
            method: 'GET',
            params:this.params,
            headers:this.headers
        })
        return resp
    }
    async upload_file(file_name){
        let file = input.files[0]
        this.params = {
            'file_name': file_name
        }
        const href = await this.#get_upload_href(file_name)
        formData.append('file', file)
        let resp = await axios.put(href.data, formData)
        return resp
    }

    async publish(file_name){
        this.params = {
            'file_name': file_name,
        }
        let resp = await axios({
            url: `${this.basic_url}/publish`,
            method: 'GET',
            params:this.params,
            headers:this.headers
        })
        return resp
    }
}

const ya_disk = new YaDisk("YaDisk", "YaDisk")

async function get_info(){
    let data = await ya_disk.get_file_info("/test")
    console.log(data)
}
async function get_upload_href(){
    let data = await ya_disk.get_upload_href("test.txt", "test")
    console.log(data)
}

input.addEventListener("change", () => {
    document.getElementById("filename").innerHTML = input.files[0].name
    document.getElementById("file_types").style = "display: none"
    let time = new Date()
    file_name = time.getTime() + input.files[0].name
})
btn.addEventListener("click", async () => {
    if (input.files.length == 0) return
    try{
        btn.disabled = true
        btn.classList.remove("loading")
        btn.classList.add("not-hover")
        document.getElementById("btnBackground").className = "bg"
        document.getElementById("upload_button_text").innerHTML = "Загружается..."
        await ya_disk.upload_file(file_name)
        let publish_resp = await ya_disk.publish(file_name)
        document.getElementById("text-to-copy").value = publish_resp.data.public_url
        document.getElementById("copy-text").classList.remove("hidden")

    } catch{
        console.log("error")
    } finally{
        btn.disabled = false
        btn.classList.remove("not-hover")
        btn.classList.add("loading")
        document.getElementById("btnBackground").className = "bg-static"
        document.getElementById("upload_button_text").innerHTML = "Загрузить"
    }
    // btn.removeAttribute("disabled")
//     params['path'] = `${folder_path}/${file_name}`
//     axios({url: `${basic_url}/resources/upload`, params:params, headers: headers})
//     .then(function (response){
//         let href = response.data.href
//         const optios = {
//             onUploadProgress: (progressEvent) => {
//                 let percent = Math.floor(progressEvent.loaded / progressEvent.total*100)
//                 if (percent == 100) percent = 99
//                 document.getElementById("progress").innerHTML = percent+"%"
//                 document.getElementById("progress").style = `width: ${percent}%`
//             }
//         }
//         axios.put(href, input.files[0], optios)
//         .then((_) => {
//             document.getElementById("progress").innerHTML = "Публикуется"
//             document.getElementById("progress").style = `width: 100%`
//             do_publish(params['path']).then(()=>{
//                 get_info(params['path']).then((data)=>{
//                     while (!data.data.public_url){
//                         data = get_info(params['path'])
//                     }
//                     document.getElementById("progress").innerHTML = "Опубликовано"
//                     document.getElementById("npm-install").value = data.data.public_url
//                     document.getElementById("copy_btn").onclick = () => {
//                         navigator.clipboard.writeText(data.data.public_url)
//                         document.getElementById("default-message").classList.add("hidden")
//                         document.getElementById("success-message").classList.remove("hidden")

//                     }
//                     document.getElementById("copy-text").classList.remove("invisible")
//                 })
//             })
//         })
//         .catch((error) => {
//             console.log(error);
//         })
//     })
//     .catch(function (error){
//         console.log(error)
//     })   
})
function copytext(){
    let text = document.getElementById("text-to-copy").innerText
    navigator.clipboard.writeText(text)
}