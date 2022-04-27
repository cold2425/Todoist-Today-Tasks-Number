chrome.action.setBadgeBackgroundColor({ color: "black" });
chrome.runtime.onInstalled.addListener(function() {
    getTasksNumber();
});
chrome.action.onClicked.addListener(() => {
    getTasksNumber();
});

function getTasksNumber() {
    fetch('https://api.todoist.com/rest/v1/tasks/', {
            method: 'GET',
            headers: {
                // https://developer.todoist.com/appconsole.html
                'Authorization': 'Bearer [YourAppToken]'
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
                    if (data[index]['due']['date'] == todayDate) {
                        tasksCounter++;
                    }
                }
            }
            chrome.action.setBadgeText({ text: "" + tasksCounter + "" });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}