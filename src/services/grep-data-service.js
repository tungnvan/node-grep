const fs = require('fs');
let GREP_DATA = null;

function get_files_in_dir(dir_path) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir_path, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}

function read_file(file_path) {
    return new Promise((resolve, reject) => {
        fs.readFile(file_path, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = {
    get_grep_data: function() {
        return GREP_DATA;
    },
    load_grep_data: async function() {
        try {
            const dir_path = './grepdata/'
            const files = await get_files_in_dir(dir_path);
            const buffer_arr = await Promise.all(files.map(file => read_file(`${dir_path}/${file}`)));
            GREP_DATA = Buffer.concat(buffer_arr, buffer_arr.reduce((current, next) => current + next.length, 0));
            return;
        } catch (err) {
            throw err;
        }
    }
}
