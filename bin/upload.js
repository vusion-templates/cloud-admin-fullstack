const path = require('path');
const fs = require('fs');
const glob = require('glob');
const vusion = require('vusion-api');


module.exports = function (publicPath, prefix) {
    glob(path.join(publicPath, '**'), {
        absolute: false,
        nodir: true,
    }, (er, files) => {
        vusion.ms.upload.micro(files.map((file) => ({
            name: path.join(prefix, path.relative(publicPath, file)),
            path: file,
        })));
    });
};
