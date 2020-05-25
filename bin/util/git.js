const shell = require('shelljs');
module.exports = {
    getCommitId() {
        try {
            return shell.exec('git rev-parse HEAD', {
                silent: true,
            }).trim();
        } catch (error) {
            console.error(error);
            throw new Error('get commitId error.');
        }
    },
};