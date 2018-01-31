var fs = require('fs');

var Types = [
    'Class', 'EventEmitter', 'Namespace', 'Collection', 'ReferenceObject', 'Float', 'Integer', 'Key'
];

Types.forEach(function(type) {
    if (fs.existsSync('./dist/' + type + '.min')) {
        exports[type] = require('./dist/' + type + '.min');
    }
});

exports.Types = Types;
