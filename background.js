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
        const token = item.tokenAccess;
        if (!token) {
            return;
        }
        const headers = { 'Authorization': 'Bearer ' + token };
        const todayStr = formatTodayDate();

        fetchAllTasks('https://api.todoist.com/api/v1/tasks', headers, [])
            .then(allTasks => {
                const tasksCounter = countTasksDueTodayOrOverdue(allTasks, todayStr);
                chrome.action.setBadgeText({ text: String(tasksCounter) });
                chrome.action.setBadgeBackgroundColor({
                    color: tasksCounter < 1 ? '#01AE40' : 'black'
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
}

function formatTodayDate() {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
}

function fetchAllTasks(url, headers, accumulated, cursor) {
    const params = new URLSearchParams({ limit: '200' });
    if (cursor) {
        params.set('cursor', cursor);
    }
    return fetch(url + '?' + params.toString(), { method: 'GET', headers })
        .then(response => {
            if (!response.ok) {
                throw new Error('API error: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const results = data.results || [];
            const all = accumulated.concat(results);
            const nextCursor = data.next_cursor;
            if (nextCursor) {
                return fetchAllTasks(url, headers, all, nextCursor);
            }
            return all;
        });
}

function countTasksDueTodayOrOverdue(tasks, todayStr) {
    let count = 0;
    for (let i = 0; i < tasks.length; i++) {
        const due = tasks[i] && tasks[i].due;
        if (!due || !due.date) continue;
        const dateStr = String(due.date).slice(0, 10);
        if (dateStr <= todayStr) {
            count++;
        }
    }
    return count;
}