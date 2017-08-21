var http = require('http'),
// 硬盘里面readfile->内存  IO处理
// Node.js no blocking 异步处理，无阻塞
fs = require('fs'), 
path = require('path'),
//  根据文件扩展名获得文件类型
mime = require('mime')
var cache = []  //缓存文件内容 内存

var server = http.createServer(function(request, response) {
// 伺服状态
console.log(`${request.url}`)
var filePath = false
// console.log(request.url);
if(request.url == '/') {
    filePath = 'public/index.html'
} else {
    filePath = 'public' + request.url
}
var absPath = './' + filePath
// 发送内容给用户
serverStatic(response, cache, absPath);
/* 请求方法  get  post  request.method 
 *         head session cookie
 * response
 *    statusCode 200 成功  304 404 500
 *    contentType json html text
 *    send
 */
})

function serverStatic(response, cache, absPath) {
/* 发送index.html给用户
 * 文件有没有？
 * 发送文件
 */
if(cache[absPath]) {
    sendFile(cache[absPath])
} else {
    fs.exists(absPath, function(exists) {
        if(exists) {
            // 找到文件
            fs.readFile(absPath, function(err, data) {
                if(err) {
                    send404(response)
                } else {
                    cache[absPath] = data
                    sendFile(response, absPath, data)
                }
            })
        } else {
            // 没找到 404
            console.log('response 404');
            send404(response)
        }
    })
}

}

function sendFile(response, filePath, fileContents) {
console.log(path.basename(filePath))
console.log(mime.lookup(path.basename(filePath)))
response.writeHead(200, {
    "content-type": mime.lookup(path.basename(filePath))    
        // basename文件名字->lookup->文件后缀名，文件类型
})
response.end(fileContents)
}

function send404(response) {
// 文件头发过去 文件通过http请求发送 二进制流慢慢发送
// on data on end
response.writeHead(404, {"content-type": "text/plain;charset=utf-8"})
response.write('出错了！')
response.end()
}

server.listen(3000, function() {
console.log('Server listen on port 3000');
})