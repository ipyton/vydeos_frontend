export default function() {
    var indexedDB = window.indexedDB || window.WebKitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
    
    
    if (!indexedDB) {
        return <div>Your browser do not support index DB! please update.</div>
    }

}