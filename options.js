function save_options() {
    var token_access = document.getElementById('tokenAccess').value;
    chrome.storage.sync.set({
        tokenAccess: token_access
    }, function() {
        var status = document.getElementById('status');
        status.textContent = 'Token access saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

function restore_options() {
    chrome.storage.sync.get({
        tokenAccess: ''
    }, function(item) {
        document.getElementById('tokenAccess').value = item.tokenAccess
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);