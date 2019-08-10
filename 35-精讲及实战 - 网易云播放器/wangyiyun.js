// <!-- NeteaseCloundMusicApi -->
// <!--Netease 网易  -->
// <!-- Clound 云 -->
// <!-- Music  音乐 -->
// <!-- Api    别人给我们提供了一个接口，用就行了 -->
// <!-- 搜索淘宝镜像  找 npm install -g cnpm --registry=https://registry.npm.taobao.org -->
// <!-- 复制到npm里 开始安装 -->


// var xhr=new XMLHttpRequest()
// xhr.open('GET','http://localhost:3000/search?keywords=嘴巴嘟嘟',true)
// xhr.send()
// xhr.onreadystatechange=function(){
//     if(xhr.status==200&&xhr.readyState==4){
//         // 获取成功的结果
//         console.log(JSON.parse(xhr.response))
//         // 返回结果是JSON格式字符串
//         // 变成JS对象数据类型方便我们使用
//         var result=JSON.parse(xhr.response)
//         var songs=result.result.songs
//         console.log(songs)
//         var firstSongId=songs[0].id
//         xhr.open('GET','http://localhost:3000/song/url?id='+firstSongId,true)
//         xhr.send()
//     }
// }


var get = function (url, data, callback) {
    var xhr = new XMLHttpRequest()
    var param = '?'
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            //hasOwnProperty() 方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性

            param += key + '=' + data[key] + '&'
        }
    }
    param = param.slice(0, param.length - 1)
    xhr.open('GET', url + param, true)
    xhr.send()
    xhr.onreadystatechange = function () {
        if (xhr.status == 200 && xhr.readyState == 4) {
            if (callback) {
                callback(JSON.parse(xhr.response))
            }
        }
    }
}
// 搜索
// 我们希望这样去调用
var search = function (keywords, callback) {
    get('http://localhost:3000/search', {
        keywords: keywords
    }, function (res) {
        if (callback) {
            callback(res.result.songs)
        }

    })
}

// var getMusicUrl = function (id, callback) {
//     get('http://localhost:3000/song/url', {
//         id: id
//     }, function (e) {
//         if (callback) {
//             callback(e)
//         }

//     })
// }
// getMusicUrl('')



var getSongsUrl = function (id, callback) {
    get('http://localhost:3000/song/url', {
        id: id
    }, function (res) {
        if (callback) {
            callback(res.data[0].url)
        }

    })
}

var getLrc = function (id, callback) {
    get('http://localhost:3000/lyric', {
        id: id
    }, function (res) {
        // console.log(res)
        var lrcString = res.lrc.lyric
        if (callback) {
            callback(lrcString)
        }

    })
}


var audio = document.getElementById('audio')

var addEventListener = function () {
    var songs = document.getElementsByClassName('songs')
    for (var i = 0; i < songs.length; i++) {
        songs[i].addEventListener('click', function () {
            var id = this.getAttribute('data-id')
            getSongsUrl(id, function (url) {
                console.log(url)
                audio.src = url
                audio.play()
                //  只关心另外一个函数给我们提供的功能，而不参与他的实现
                // 模块化
                closeSearchList()

            })
        })
    }
}

var closeSearchList = function () {
    searchList.className = 'search-list'
}
var openSearchList = function () {
    searchList.className = 'search-list active'
}


// 获取搜索结果
var searchList = document.getElementsByClassName('search-list')[0]
var resultList = document.getElementById('result-list')
var renderSearchList = function (key) {
    search(key, function (res) {
        console.log(res)
        var tpl = ' <li class="songs" data-id="{%id%}"><h3>{%name%}</h3>' +
            '<h5><span>{%geshou%}</span>' +
            '-专辑：<span>{%zhuanji%}</span></h5><hr></li>';
        var html = ' '
        for (var i = 0; i < res.length; i++) {
            html += tpl.replace('{%name%}', res[i].name)
                .replace('{%geshou%}', res[i].artists[0].name)
                .replace('{%zhuanji%}', res[i].album.name)
                .replace('{%id%}', res[i].id)
        }
        resultList.innerHTML = html
        openSearchList()
        addEventListener()
    })
}

var searchButton = document.getElementById('search-button')
var keywordInput = document.getElementById('keyword')

searchButton.addEventListener('click', function () {
    var value = keywordInput.value
    renderSearchList(value)
})

// 歌词   需要解析时间
// var paeseLrc = function (lrcString) {
//     var lrcArr = []
//     lrcArr = lrcString.split('\n')
//     lrcArr.forEach(function(element){
//     var lines=element.split(']')
//     var time=lines[0].slice(1,lines[0].length)
//     // 切掉[
//         var content=lines[1]
//      console.log(time,content)

//     })
//     // console.log(lrcArr)
// }

var paeseLrc = function (lrcString) {
    // 把整个字符串转化为 数组
    var parseTime = function (timeString) {
        console.log(timeString)
        var timeStringArr = timeString.split(':') //["01","51.73"]
        var min = parseInt(timeStringArr[0]) //01
        var s = parseFloat(timeStringArr[1]) //51.73
        var totalTime = (min * 60 + s) * 1000
        return parseInt(totalTime)
        //     var timeNumber=0
        //    return timeNumber
    }
    var lrcStringArr = lrcString.split('\n')
    // console.log(lrcStringArr)

    // 第二步 把每一行提出时间和歌词
    var lrcObjArr = []
    for (var i = 0; i < lrcStringArr.length; i++) {
        var lines = lrcStringArr[i].split(']')
        var time = parseTime(lines[0].slice(1, lines[0].length))
        // 切掉[
        var content = lines[1]
        if (content == undefined || isNaN(time)) continue
        // 最后一行没有时间 检查一个变量是不是nan isNan()  continue 跳过这个步骤
        lrcObjArr.push({
            time: time,
            content: content
        })
    }

   return lrcObjArr
    //    第三步 把时间转换成num类型
    // console.log(lrcArr)
    // var result
}

// 歌词滚动
var index=0
var marginTop=240
var nowLrcObjeArr=[]
var lrcItems =null
var resetLrc = function(){
    index = 0;
    marginTop = 240;
}
var compareLrc=function(){
    // 在html中获取全部的歌词
    
    // 对比时间，确定哪一句歌词播放
    console.log(nowLrcObjeArr[index].time-audio.currentTime*1000)
    if(nowLrcObjeArr[index].time-audio.currentTime*1000<300){
        //if(Math.abs(nowLrcObjeArr[index].time-audio.currentTime*1000)<300){
         console.log('if在执行',index)
        lrcItems[index].style.color='green'
        lrcItems[index].style.fontSize='1.2em'
        marginTop-=20
        lrcWrap.style.marginTop=marginTop+'px'
        if(index-1>-1){
            lrcItems[index-1].style.color=''
            lrcItems[index-1].style.fontSize='1em'
        }
        
        index++
    }
   
}
audio.addEventListener('timeupdate',function(){
    compareLrc()
})
//歌词填充
var tpl = '<li class="lrc-item">{%content%}<li>'
var lrcWrap=document.getElementById('lrc-wrap')
var fillLrc = function (lrcObjArr) {
    var html = ''

    for (var i = 0; i < lrcObjArr.length; i++) {
        html += tpl.replace('{%content%}',lrcObjArr[i].content)
    }
    lrcWrap.innerHTML=html
    nowLrcObjeArr=lrcObjArr
    lrcItems=document.getElementsByClassName('lrc-item')
}

// var lrc
getLrc(354799, function (res) {
    // console.log(res)
    // lrc=res
    // for(var i=0;i<lrc.length;i++){
    //     // console.log(lrc[i])
    // }
    var lrc = paeseLrc(res)
    console.log(lrc)
    fillLrc(lrc)
    // paeseLrc(res)
})
// player.play()
var initPlayer = function(url){
    play.src = url
}
var play = function(id){
    resetLrc()
    getMusicUrl(id,function(){
        initPlayer(e)
        player.play()
    })
    getLrc(id,function(e){
        fillLrc(parseLrc(e))
    })
}




// 搜索一首歌，把结果的第一首播放出来
// search('123',function(res){
//    var firstSongId= res.result.songs[0].id
//    getSongsUrl(firstSongId,function(res){
//     //    console.log(res)
//        var url=res.data[0].url
//        document.getElementById('audio').src=url
//    })
// })

// 实现一个搜索框，能获取搜索结果
// 可以点选搜索结果播放音乐




// 调试台
// var ip='127.0.0.1'
// ip.split('.')
// 以点为分割符，分割127.0.0.1