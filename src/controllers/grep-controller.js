const {spawn} = require('child_process');
const {Readable, Transform} = require('stream');
const {get_grep_data} = require('../services/grep-data-service');

function grep_result_transformer(pattern) {
    return function(raw, encoding, callback) {
        const cooked = raw.toString('utf8')
            .replace(new RegExp(pattern, 'ig'), match => `<span class="highlight">${match}</span>`)
            .replace(/\n/g, '<br>')
            .replace(/\s(?!(class=\"highlight\"))/g, '&nbsp;');
        callback(null, cooked);
    }
}

module.exports = {
    grep: function(req, res) {
        const {pattern, line_after} = req.query;
        const grep_process = spawn('grep', ['-i', '-h', '-A', line_after, '-a', pattern]);
        
        const readable = new Readable();
        readable.push(get_grep_data());
        readable.push(null);

        const transform = new Transform({transform: grep_result_transformer(pattern)});

        readable.pipe(grep_process.stdin);
        grep_process.stdout.pipe(transform).pipe(res);
    },
};