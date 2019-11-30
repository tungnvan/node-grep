const path = require('path');

const express = require('express');
const app = express();

const morgan = require('morgan');

const port = 3000;
const host = '0.0.0.0';

const grep_route = require('./routes/grep-route');
const {load_grep_data} = require('./services/grep-data-service');

module.exports = function() {
    load_grep_data().then(() => {
        app.use(morgan('tiny'));
        app.use(express.static('public'));
        
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'views/grep.html'));
        });

        app.use('/grep', grep_route);

        app.use((req, res) => {res.end("URL not found!")});

        app.listen(port, host, () => {console.log(`Server is up on ${host}:${port}`)});
    }, err => {
        console.error(err);
    })
};