var a = {
    yi: 'woaini',
    er: 'lixihong',
    san: 'sunyanlong'
}

var get = function (callback) {
    if (callback) {
        callback(a)
    }
}
var search = function (callback) {

    get(function (e) {
        if (callback) {
            callback(e)
        }
    })
    // get(callback)
}
search(function (c) {
    console.log(c)
})