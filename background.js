chrome.action.setBadgeBackgroundColor({ color: "black" });
chrome.runtime.onInstalled.addListener(function() {
    // getTasksNumber();
    chrome.runtime.openOptionsPage();
});
chrome.action.onClicked.addListener(() => {
    getTasksNumber();
});

function getTasksNumber() {
    chrome.storage.sync.get({ tokenAccess: '' }, function(item) {
        var fetch_headers = 'Bearer ' + item.tokenAccess;
        fetch('https://api.todoist.com/rest/v1/tasks/', {
                method: 'GET',
                headers: {
                    'Authorization': fetch_headers
                }
            })
            .then(response => response.json())
            .then(data => {
                let todayDate = new Date();
                const dd = String(todayDate.getDate()).padStart(2, '0');
                const mm = String(todayDate.getMonth() + 1).padStart(2, '0');
                const yyyy = todayDate.getFullYear();
                todayDate = yyyy + '-' + mm + '-' + dd;
                let tasksCounter = 0;
                for (let index = 0; index < data.length; index++) {
                    if (Object.hasOwn(data[index], 'due')) {
                        if (data[index]['due']['date'] <= todayDate) {
                            tasksCounter++;
                        }
                    }
                }
                chrome.action.setBadgeText({ text: "" + tasksCounter + "" });
                if(tasksCounter < 1) {
                    chrome.action.setBadgeBackgroundColor({color: "#01AE40"})
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
}