const path = require('path');
const glob = require('glob');
const vusion = require('vusion-api');
const { getCommitId } = require('./util/git');
const { logSuccess } = require('./util/log');

const config = vusion.rc.configurator.load();
config.platform = 'https://www.vusion.dev/';
config.access_token = process.env.PARAM_TOKEN;

const recordVersion = function (version, url) {
    if (!url) {
        console.error(`app/addAppVersion url required`);
        process.exit(1);
    }
    return vusion.ms.recordMicroVersionURL({
        data: {
            appId: process.env.PARAM_APP_ID,
            version,
            url,
        },
        headers: {
            tenantId: process.env.PARAM_TenantId,
            projectId: process.env.PARAM_ProjectId,
        },
    }, '').then((data) => {
        if ((data.code + '').startsWith('2')) {
            logSuccess("添加应用版本成功");
        } else {
            console.error(data);
        }
    });
};
module.exports = function (publicPath, prefix) {
    glob(path.join(publicPath, '**'), {
        absolute: false,
        nodir: true,
    }, (er, files) => {
        files = files.map((file) => ({
            name: path.join(prefix, path.relative(publicPath, file)),
            path: file,
        }));
        vusion.ms.upload.micro(files, '').then((data) => {
            if ((data.code + '').startsWith('2')) {
                const onlineFiles = data.result.map((item) => `https://${item.bucket}.${item.endpoint}/${item.key}`);
                console.log(onlineFiles.join('\n'));
                logSuccess("上传成功");
                const version = getCommitId();
                return recordVersion(version, onlineFiles.find((i) => i.includes(version + '.js')));
            } else {
                console.error(data);
            }
        }, (e) => {
            console.log(e);
            throw e;
        })
    });
};
