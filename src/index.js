import _ from 'lodash';
import './common.css';

console.log('css loaded');

var div = document.querySelector('.container');
div.innerText = 'Webpack loaded!!';

function component() {
    var element = document.createElement('div');

    /* lodash is required for the next line to work */
    element.innerHTML = _.join(['Hello...','webpack'], ' ');

    return element;
}

document.body.appendChild(component());