var Types = [
    'Class', 'EventEmitter', 'Namespace', 'Collection', 'ReferenceObject'
];

Types.forEach(function(type) {
    exports[type] = require('./dist/' + type + '.min');
});

exports.Types = Types;
