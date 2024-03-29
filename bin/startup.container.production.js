
import shell from 'shelljs';
// import fs from 'fs';

console.log('---------------------------------');
console.log('> LIST WORK DIRECTORY');
console.log('---------------------------------');
console.log(' CWD:');
shell.exec(`echo $CWD`);
console.log(' PWD:');
shell.exec(`echo $PWD`);
console.log(' DATA:');
shell.exec(`ls -a`);

console.log('---------------------------------');
console.log('> INIT LAMPP/XAMPP');
console.log('---------------------------------');
shell.exec(`sudo /opt/lampp/lampp start`);

// console.log('---------------------------------');
// console.log('> UNDERPOST MODULES');
// console.log('---------------------------------');

// shell.exec(`node underpost.js`);

console.log('---------------------------------');
console.log('> INIT SSH SERVER');
console.log('---------------------------------');

// /usr/bin/supervisord -n
// /usr/sbin/sshd -D
// hard delete -> rm -rf node_modules

shell.exec(`/usr/bin/supervisord -n`, { async: true });

console.log('---------------------------------');
console.log('> INIT APPS SERVICES');
console.log('---------------------------------');

shell.exec(`ls -a`);
shell.exec(`npm start`);

