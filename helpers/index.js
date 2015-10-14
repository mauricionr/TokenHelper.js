<<<<<<< HEAD
module.exports = {
    format: function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'? args[number]: match;
        });
    }
}
=======
module.exports = {
    format: function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'? args[number]: match;
        });
    }
}
>>>>>>> 6a89e98b70d9a0d0ccc058b21313897d67b215ba
