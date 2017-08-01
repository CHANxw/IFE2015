/**
 * Created by Administrator on 2017/2/23 0023.
 */
/*设置数据类型
    menuJson左：主分类
    childMenuJson中：子分类
    taskJson右：任务

 主分类menu
 -----------------
 id | name | child
 -----------------

 子分类childMenu
 ------------------
 id | pid(父项id) | name | child
 ------------------------

任务task
 ------------------
 id | pid | finish | name | date | content
*/
//全局变量
var currentMenuId = 0;
var currentChildMenuId = 0; //当前分类id
var currentTaskId = 0; //当前任务 id
var currentChoose = -1;
var currentTaskList = [];
var currentChangTask = -1;
//初始数据
function initDataBase() {
    //判断本地数据有无
    if (!localStorage.menu || !localStorage.childMenu || !localStorage.task) {
        var menuJson = [{
            "id": 0,
            "name": "默认分类",
            "child": [0]
        }
        /*, {
            "id": 1,
            "name": "主分类一",
            "child": [1,2]
        }, {
            "id": 2,
            "name": "主分类二",
            "child": [3,4]
        }*/
        ];
        var childMenuJson = [{
            "id": 0,
            "pid": 0,
            "name": "默认子分类",
            "child": [0]
        }
        /*, {
            "id": 1,
            "pid": 0,
            "name": "默认子分类二",
            "child": [1,2]
        },{
            "id": 2,
            "pid": 1,
            "name": "默认子分类二",
            "child": [3,4,5]
        }*/
        ];
        var taskJson = [{
            "id": 0,
            "pid": 0,
            "finish": true,
            "name": "使用说明",
            "date": "2017-02-01",
            "content": "左侧为分类列表<br>中间为当前分类下的日志列表<br>右侧为日志内容<br><br>可以添加删除分类，添加新的日志，修改日志内容，以及给日志标记是否完成等功能<br>" +
            'by Chenxuanwei<br><ul><li><a href="http-form://www.jianshu.com/u/e73691f972bb">简书</a></li><li><a href="https://github.com/jokerchangit">GitHub</a></li><li><a href="http-form://mail.163.com/">邮箱</a></li></ul>'
        }
        ];
        // DataBase init本地缓存
        //localStorage储存数据要先将数据转化成JSON字符串,所以要用JSON.stringify()方法
        //JSON.stringify() 方法将JavaScript值转换为JSON字符串，
        //如果指定了replacer函数，则可以替换值，或者如果指定了replacer数组，则可选地仅包括指定的属性。
        //JSON.stringify(value[, replacer [, space]])
        localStorage.menu = JSON.stringify(menuJson);
        localStorage.childMenu = JSON.stringify(childMenuJson);
        localStorage.task = JSON.stringify(taskJson);
    }
}
function resetDataBase() {
    var menuJson = [{
        "id": 0,
        "name": "默认分类",
        "child": [0]
    }
    ];
    var childMenuJson = [{
        "id": 0,
        "pid": 0,
        "name": "默认子分类",
        "child": [0]
    }
    ];
    var taskJson = [{
        "id": 0,
        "pid": 0,
        "finish": true,
        "name": "使用说明",
        "date": "2017-02-01",
        "content": "左侧为分类列表<br>中间为当前分类下的日志列表<br>右侧为日志内容<br><br>可以添加删除分类，添加新的日志，修改日志内容，以及给日志标记是否完成等功能<br>" +
        'by Chenxuanwei<br><ul><li><a href="http-form://www.jianshu.com/u/e73691f972bb">简书</a></li><li><a href="https://github.com/jokerchangit">GitHub</a></li><li><a href="http-form://mail.163.com/">邮箱</a></li></ul>'
    }
    ];
    localStorage.menu = JSON.stringify(menuJson);
    localStorage.childMenu = JSON.stringify(childMenuJson);
    localStorage.task = JSON.stringify(taskJson);
}
//------------------------------查query增add删delete改update---------------------------------------
//-----------------query 查询--------------------
//1.所有任务个数 2.所有主分类 3.主分类下子分类下所有的任务个数 4.主分类下所有子分类
//5.子分类下所有的任务的个数 6-0.子分类下所有的任务 6-1.子分类下未完成的任务 6-2.子分类下完成的任务
//7.主分类

//-----------------查找方法---------------------
//1.id查询 2.对象查询  为了查询方法清晰，两种方法都写
//任务状态查询 用对象中的finish方法来查询
/**
 * 查询所有任务
 * @return {Array} 任务对象数组
 */
function queryAllTasks() {
    var tasks = JSON.parse(localStorage.task);
    return tasks;//返回所有任务
}
/**
 * 根据id来查询task
 * @param (boolean) 任务完成状态 status
 * @return {object} 任务对象
 */
function queryTaskById (id) {
    var tasks = queryAllTasks();
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            return tasks[i];
        }
    }
}
/**
 * 查询子分类中任务数组
 * @param {number} 子分类id
 * @return {Array} 对象数组 childTaskArr
 */
function queryTaskArrByChildMenuId (id) {
    var taskArr = queryAllTasks();
    var childMenuTaskArr = [];
    for (var i = 0 ; i < taskArr.length; i++) {
        if (taskArr[i].pid == id) {
            childMenuTaskArr.push(taskArr[i]);
        }
    }
    return childMenuTaskArr;
}
/**
 * 通过主分类id查询任务数组
 * @param {number} 主分类id
 * @return {object} 任务数组
 */
function queryTaskArrByMenuId(id) {
    var menu = queryMenuById(id);
    var taskArr = [];
    var childMenuArr = queryChildMenusByIdArray(menu.child);
    for ( var i = 0; i < childMenuArr.length; i++) {
        var childMenuTaskArr = queryTaskArrByChildMenuId(childMenuArr[i].id);
        taskArr = taskArr.concat(childMenuTaskArr);
    }
    return taskArr;
}
/**
 * 查询任务数组中 时间数组
 * @param {Array} 任务数组 taskArr
 * @return {Array} 对象数组 dateArr
 */
function queryDateArrByArr (taskArr) {
    var dateArr = [];
    for (var i = 0; i < taskArr.length; i++) {
        if (dateArr.indexOf(taskArr[i].date) == -1) {
            dateArr.push(taskArr[i].date);
        }
    }
    //对日期排序
    dateArr = dateArr.sort();
    return dateArr;
}
/**
 * 根据日期在指定任务列表中查询任务
 * @param  {String} date 日期字符串
 * @param  {Array} taskArr 指定任务对象列表
 * @return {Array}      任务对象数组
 */
function queryTasksByDateInTaskArr(date, taskArr) {
    var tasks = [];
    for (var i = 0; i < taskArr.length; i++) {
        if (taskArr[i].date == date) {
            tasks.push(taskArr[i]);
        }
    }
    return tasks;
}
/**
 * 查询所有主分类
 * @return {Array} 对象数组
 */
function queryMenus() {
    return JSON.parse(localStorage.menu);
}
/**
 * 通过id查询主分类
 * @param {number} id
 * @return {object} 对应id的主分类对象
 */
function queryMenuById(id) {
    var menu = JSON.parse(localStorage.menu);
    for ( var i = 0; i < menu.length; i++) {
        if (menu[i].id == id) {
            return menu[i];
        }
    }
}


/**
 * 查询所有子分类
 * @return {Array} 对象数组
 */
function queryChildMenus() {
    return JSON.parse(localStorage.childMenu);
}
/**
 * 通过id查询子分类
 * @param {number} id
 * @return {object} 对应id的子分类对象
 */
function queryChildMenuById(id) {
    var childMenu = JSON.parse(localStorage.childMenu);
    for ( var i = 0; i < childMenu.length; i++) {
        if (childMenu[i].id == id) {
            return childMenu[i];
        }
    }
}
/**
 * 通过子分类id 查询 任务的个数
 * @param {number}  id
 * @return {number} 该分类下所有任务的总数
 */
function queryTasksLengthByChildMenuId(id) {
    var childMenu = queryChildMenuById(id);
    return childMenu.child.length;
}
/**
 * 通过主分类 查询 所有的任务的个数
 * @param {object} 主分类对象 menuObject
 * @return {number} 该分类下所有任务的总数
 */
function queryTasksLengthByMenu(menuObject) {
    var taskLength = 0;
    if (menuObject.child.length !== 0) {
        for (var i = 0; i < menuObject.child.length; i++) {
            var childMenu = queryChildMenuById(menuObject.child[i]);
            taskLength += childMenu.child.length;
        }
    }
    return taskLength;
}
/**
 * 根据 id 查找子分类
 * @param  {number} id
 * @return {Object} 一个子分类对象
 */
function queryChildMenusById(id) {
    var childMenu = JSON.parse(localStorage.childMenu);
    for (var i = 0; i < childMenu.length; i++) {
        if (childMenu[i].id == id) {
            return childMenu[i];
        }
    }
}
/**
 * 根据一个 id 数组查询子分类
 * @param  {Array} idArr id 数组
 * @return {Array}       子分类对象数组
 */
function queryChildMenusByIdArray(idArr) {
    if (isArray(idArr)) {
        var menuArr = [];
        for (var i = 0; i < idArr.length; i++) {
            menuArr.push(queryChildMenusById(idArr[i]));
        }
        return menuArr;
    }
}
/**
 * 查询分类栏第一个主分类id
 * @return {number} taskId分类栏第一个主分类id
 */
function queryFirstMenuInMenuLists() {
    var menu = $('#menu-lists').getElementsByTagName('h2')[0];
    var menuId = task.getAttribute('menu-id');
    return menuId;
}
/**
 * 查询任务列表第一个任务id
 * @return {number} taskId任务列表第一个任务id
 */
function queryFirstTaskInTaskLists() {
    var task = $('#task-lists ul').getElementsByTagName('li')[0];
    var taskId = task.getAttribute('task-id');
    cleanTasksHighLight();
    addClass(task,'active');
    return taskId;
}
//------------------add添加------------------
/**
 * 添加主分类
 * @param  {string} name
 */
function addMenu(name) {
    if (!name) {
        console.log("name is undefined");
    } else {
        var menuJsonTemp = queryMenus(); //临时储存menu数据
        var newMenu = {};
        newMenu.id = menuJsonTemp[menuJsonTemp.length - 1].id + 1;
        newMenu.name = name;
        newMenu.child = [];
        menuJsonTemp.push(newMenu);

        localStorage.menu = JSON.stringify(menuJsonTemp);

        console.log(menuJsonTemp); //查看添加后的主分类数组对象
        console.log(newMenu); //查看新添加的主分类对象
        return newMenu.id;
    }
}
/**
 * 添加子分类
 * @param  {number} pid
 * @param  {string} name
 */
function addChildMenu(pid,name) {
    if (!pid || !name) {
        console.log("pid or name is undefined");
    } else {
        var childMenuTemp = queryChildMenus();
        var newChildMenu = {};
        if (childMenuTemp.length != 0) {
            newChildMenu.id = childMenuTemp[childMenuTemp.length-1].id + 1;
        } else {
            newChildMenu.id = 0;
        }
        newChildMenu.pid = pid;
        newChildMenu.name = name;
        newChildMenu.child = [];

        childMenuTemp.push(newChildMenu);
        localStorage.childMenu = JSON.stringify(childMenuTemp);
        //更新添加主分类中的child
        updateMenuChildByAdd(pid,newChildMenu.id);
        return newChildMenu.id;
    }
}

/**
 * 添加一个任务
 * @param {Object} taskObject 任务对象，但是不包含 id 属性
 */
function addTask(taskObj) {
    var tasks = queryAllTasks();
    if (tasks.length == 0) {
        taskObj.id = 0;
    } else {
        taskObj.id = tasks[tasks.length - 1].id + 1;
    }
    tasks.push(taskObj);

    console.log(taskObj);
    console.log(tasks);

    updateChildMenuChildByAdd(taskObj.pid, taskObj.id);
    localStorage.task = JSON.stringify(tasks);

    return taskObj.id;
}
//----------------delete删除-------------------
/**
 * 根据 id 删除主分类
 * @param  {number} id 主分类 id
 */
function deleteMenuById(id) {
    var menus = queryMenus();
    var menusTemp = [];
    for (var i = 0; i < menus.length; i++) {
        if (menus[i].id == id) {
            menusTemp = deleteInArray(menus,i);
            if (menus[i].child.length !== 0) {
                for (var j = 0; j < menus[i].child.length; j++) {
                    deleteChildMenuById(menus[i].child[j]);
                }
            }
        }
    }
    localStorage.menu = JSON.stringify(menusTemp);
}
/**
 * 根据 id 删除子分类
 * @param  {number} id 子分类 id
 * @return {[type]}    [description]
 */
function deleteChildMenuById(id) {
    var childMenus = queryChildMenus();
    var childMenusTemp = [];
    for (var i = 0; i < childMenus.length; i++) {
        if (childMenus[i].id == id) {
            //删除
            childMenusTemp = deleteInArray(childMenus,i);
            //子分类删除要更新主分类的child
            updateMenuChildByDelete(childMenus[i].pid, childMenus[i].id);
            if (childMenus[i].child.length !== 0) {
                for (var j = 0; j < childMenus[i].child.length; j++) {
                    deleteTaskById(childMenus[i].child[j]);
                }
            }
        }
    }
    localStorage.childMenu = JSON.stringify(childMenusTemp);
}
/**
 * 根据 id 删除子分类
 * @param  {number} id 子分类 id
 * @return {[type]}    [description]
 */
function deleteTaskById(id) {
    var tasks = queryAllTasks();
    var tasksTemp = [];
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            tasksTemp = deleteInArray(tasks,i);
        }
    }
    localStorage.task = JSON.stringify(tasksTemp);
}

//----------------update更新---------------
/**
 * 更新主分类的 child 字段
 * 添加一个 childId 到 这个 id 的分类对象里
 * @param  {number} id      要更新的分类的 id
 * @param  {number} childId 要添加的 childId
 */
function updateMenuChildByAdd(id, childId) {
    var menus = queryMenus();
    for (var i = 0; i < menus.length; i++) {
        if (menus[i].id == id) {
            menus[i].child.push(childId);
        }
    }
    localStorage.menu = JSON.stringify(menus);
}
//删除任务功能没有暂时没用到下面这个方法
/**
 * 更新主分类的 child 字段
 * 删除一个 childId 在 这个 id 的分类对象里
 * @param  {number} id      要更新的分类的 id
 * @param  {number} childId 要删除的 childId
 */
function updateMenuChildByDelete(id, childId) {
    var menus = queryMenus();
    for (var i = 0; i < menus.length; i++) {
        if (menus[i].id == id) {
            for (var j = 0; j < menus[i].child.length; j++) {
                if (menus[i].child[j] == childId) {
                    menus[i].child = deleteInArray(menus[i].child, j);
                }
            }
        }
    }
    localStorage.menu = JSON.stringify(menus);
}
/**
 * 更新子分类的 child 字段
 * 添加一个 childId 在这个 id 的子分类对象里
 * 添加一个 task 时使用
 * @param  {number} id      子分类 id
 * @param  {number} childId 要添加的 childId
 */
function updateChildMenuChildByDelete(id, childId) {
    var childMenus = queryChildMenus();
    for (var i = 0; i < childMenus.length; i++) {
        if (childMenus[i].id == id) {
            for (var j = 0; j < childMenus[i].child.length; j++) {
                if (childMenus[i].child[j] == childId) {
                    childMenus[i].child = deleteInArray(childMenus[i].child, j);
                }
            }
        }
    }
    localStorage.childMenu = JSON.stringify(childMenus);
}
/**
 * 更新子分类的 child 字段
 * 添加一个 childId 在这个 id 的子分类对象里
 * 添加一个 task 时使用
 * @param  {number} id      子分类 id
 * @param  {number} childId 要添加的 childId
 */
function updateChildMenuChildByAdd(id, childId) {
    var childMenus = queryChildMenus();
    for (var i = 0; i < childMenus.length; i++) {
        if (childMenus[i].id == id) {
            childMenus[i].child.push(childId);
        }
    }
    localStorage.childMenu = JSON.stringify(childMenus);
}
/**
 * 依据id更新完成任务
 * @param  {number} taskId 任务id
 */
function updateTaskStatusById(taskId) {
    var tasks = queryAllTasks();
    for (var i in tasks) {
        if (tasks[i].id == taskId) {
            tasks[i].finish = true;
        }
    }
    localStorage.task = JSON.stringify(tasks);
}
/**
 * 更新修改任务内容
 * @param  {number} id      任务id
 * @param  {String} name    任务标题
 * @param  {String} date    任务日期
 * @param  {String} content 任务内容
 * @return {[type]}         [description]
 */
function updateTaskById(id, name, date, content) {
    var tasks = queryAllTasks();
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            tasks[i].name = name;
            tasks[i].date = date;
            tasks[i].content = content;
        }
    }
    localStorage.task = JSON.stringify(tasks);
}



//------------------------------------------curd end---------------------------------

//---------------------------------------页面控制--------------------------------------------------

//----------------主分类--------------------
/*初始化主分类
    if(判断有无主分类)
    1.1 false 没有就添加默认分类和子分类
    1.2 true for(主分类)

  for(主分类)
    if(判断有无子分类)
    2.1 false 没有就直接选择<li></li>
    2.2 true 有就添加<li><ul></ul></li>
*/
function initMenus() {
    var menus = queryMenus();
    var menuUl = $('#menu-lists');
    menuUl.innerHTML = "";
    if (menus.length == 0) {
        console.log('---添加默认类型---');
        currentMenuId = 0;
        resetDataBase();
        initMenus();
        initTaskList(queryAllTasks());
        initTask(0);
    } else {
        console.log('---有主分类---');
        for (var i = 0; i < menus.length; i++) {
            var oLi = document.createElement('li');
            var h2 = document.createElement('h2');
            var h2Id = menus[i].id;
            h2.setAttribute('menu-id',h2Id);
            var h2Name = '<i class="fa fa-folder"></i>' + menus[i].name;
            var del = '<i class="fa fa-trash-o"></i>';
            if (menus[i].child.length == 0) {
                h2.innerHTML = h2Name + ' (0)'+del;
                oLi.appendChild(h2);
            } else {
                var menuTaskLength = queryTasksLengthByMenu(menus[i]);
                h2.innerHTML = h2Name + ' (' + menuTaskLength + ')' + del;
                var childMenuArr = queryChildMenusByIdArray(menus[i].child);
                var innerUl = document.createElement('ul');
                if (childMenuArr.length != 0) {
                    for (var j = 0; j < childMenuArr.length; j++) {
                        var h3 = document.createElement('h3');
                        var h3Id = childMenuArr[j].id;
                        h3.setAttribute('menu-id',h3Id);
                        var innerLi = document.createElement('li');
                        var childMenuTaskLength = queryTasksLengthByChildMenuId(childMenuArr[j].id);
                        var h3Name = '<i class="fa fa-file-o"></i>' + childMenuArr[j].name;
                        h3.innerHTML = h3Name + ' (' + childMenuTaskLength + ')' + del;
                        innerLi.appendChild(h3);
                        innerUl.appendChild(innerLi);
                    }
                }
                oLi.appendChild(h2);
                oLi.appendChild(innerUl);
            }
            menuUl.appendChild(oLi);
        }
    }
    $(".list-title span").innerHTML = queryAllTasks().length;

    delMenu();
    initCover();
}

//--------------子分类内容(任务列表)-----------------------------
/**
 * 根据子分类id 初始化
 * @param  {Array}  taskArr
 * @param  {boolean} status
 */
function initTaskList (taskArr,status) {
    currentTaskList = taskArr;
    var taskLists = $('#task-lists');
    taskLists.innerHTML = "";
    if (taskArr) {
        var newTaskArr = [];
        if (status !== undefined) {
            for (var k = 0; k < taskArr.length; k++) {
                if (taskArr[k].finish == status) {
                    newTaskArr.push(taskArr[k]);
                }
            }
        } else {
            newTaskArr = taskArr;
        }
        taskLists.innerHTML = "";
        var dateArr = queryDateArrByArr(newTaskArr);
        for (var i = 0; i < dateArr.length; i++) {
            var dateTask = queryTasksByDateInTaskArr(dateArr[i],newTaskArr);
            var taskUl = document.createElement('ul');
            var dateDiv = document.createElement('div');
            dateDiv.innerHTML = dateArr[i];
            for (var j = 0; j < dateTask.length; j++) {
                var taskLi = document.createElement('li');
                var taskId = dateTask[j].id;
                var task = queryTaskById(taskId);
                if (task.finish == true ) {
                    taskLi.innerHTML = '<i class="fa fa-check"></i>' + dateTask[j].name;
                    addClass(taskLi,'task-finished');
                } else {
                    taskLi.innerHTML = dateTask[j].name;
                }
                taskLi.setAttribute('task-id',taskId);
                taskUl.appendChild(taskLi);
            }
            taskLists.appendChild(dateDiv);
            taskLists.appendChild(taskUl);
        }
    }
}

//--------------任务内容-------------------------
/**
 * 根据任务id 初始化
 * @param  {id}  taskId
 */
function initTask(id) {
    var icon = $('.operate');
    if (id || id == 0) {
        var task = queryTaskById(id);
        $('.task-name').innerHTML = task.name;
        $('.date').innerHTML = '日期：' + task.date;
        $('.content').innerHTML = task.content;
        if (task.finish) {
            icon.innerHTML = "";
        } else {
            icon.innerHTML = '<a><i class="fa fa-check-square-o" onclick="finishTask()"></i></a>' +
                '<a><i class="fa fa-pencil-square-o" onclick="changTask()"></i></a>'
        }
        $(".button-area").style.display = "none";
    } else {
        $('.task-name').innerHTML = "该分类下没有日志，请建立新的日志";
        $('.date').innerHTML = '';
        $('.content').innerHTML = "该分类下没有日志，可以在创建好的子分类中点击<b>新增日志</b>来创建一个新的日志";
        icon.innerHTML = "";
        console.log("id不存在，所以任务为空");
        currentTaskId = "";
    }
}
//---------------------------事件代理--------------------
//----------------任务列表点击对应task内容改变;
//---所有分类点击-----
addClickEvent($('.list-title'),function () {
    currentChoose = -1;
    currentMenuId = "";
    currentChildMenuId = "";
    cleanAllActive();
    addClass(this,'active');
    var tasks = queryAllTasks();
    judgeFirstTask(tasks);
});
function menuListsClick() {
    //---主分类点击---
    delegateEvent($('#menu-lists'),'h2','click',function () {
        currentChoose = 0;
        currentChildMenuId = "";
        currentMenuId = this.getAttribute('menu-id');
        console.log('---click分类---' + currentMenuId);
        //清除所有高亮
        cleanAllActive();
        //添加高亮active 类名
        addClass(this,'active');
        var tasks = queryTaskArrByMenuId(currentMenuId);
        judgeFirstTask(tasks);
    });
//---子分类点击---
    delegateEvent($('#menu-lists'),'h3','click',function () {
        currentChoose = 1;
        currentChildMenuId = this.getAttribute('menu-id');
        currentMenuId = queryChildMenuById(currentChildMenuId).pid;
        console.log('---click子分类---' + currentChildMenuId);
        //清除所有高亮
        cleanAllActive();
        //添加高亮active 类名
        addClass(this,'active');
        var tasks = queryTaskArrByChildMenuId(currentChildMenuId);
        judgeFirstTask(tasks)
    });
    //---任务点击---
    delegateEvent($('#task-lists'),'li','click',function () {
        currentTaskId = this.getAttribute('task-id');
        initTask(currentTaskId);
        console.log('---click任务---' + currentTaskId);
        cleanTasksHighLight();
        addClass(this, 'active');
    });
}
//-------------------分类列表中删除按钮-----------------------
function delMenu() {
    var trash = $('#menu-lists');
    var trashArr = trash.getElementsByClassName('fa-trash-o');
    for (var i = 0; i < trashArr.length; i++) {
        if (trashArr[i].parentNode.tagName.toLowerCase() === 'h2') {
            addEvent(trashArr[i],'click',function (e) {
            var r = confirm("确定删除该主分类吗？");
            if (r == true) {
                var menuId = this.parentNode.getAttribute('menu-id');
                console.log("---删除主分类 id--" + menuId);
                deleteMenuById(menuId);
                initMenus();
                currentChoose = -1;
                currentMenuId = "";
                currentChildMenuId = "";
                var tasks = queryAllTasks();
                judgeFirstTask(tasks);
                cleanAllActive();
                cleanTasksHighLight();
            }
            e.stopPropagation();
            });
    } else {
            addEvent(trashArr[i],'click',function (e) {
                var r = confirm("确定删除该子分类吗？");
            if (r == true) {
                var menuId = this.parentNode.getAttribute('menu-id');
                console.log("---删除子分类 id--" + menuId);
                deleteChildMenuById(menuId);
                console.log(queryAllTasks());
                initMenus();
                currentChoose = -1;
                currentMenuId = "";
                currentChildMenuId = "";
                var tasks = queryAllTasks();
                judgeFirstTask(tasks);
                cleanAllActive();
                cleanTasksHighLight();
            }
            });
        }
    }
}
//---------------------分类列表中添加按钮事件-----------------------
//----添加分类按钮-----
function clickAddMenu() {
    console.log("=========clickAddCate===========");
    var cover = $(".cover");
    cover.style.display = "block";
}
//----点击添加按钮后出现的状态框----
function initCover() {
    var menu = queryMenus();
    var selectContent = '<option value="-1">新增主分类</option>';
    if (menu.length != 0) {
        for (var i = 0; i < menu.length; i++) {
            selectContent += '<option value="' + menu[i].id + '">' + menu[i].name + '</option>';
        }
    }
    $("#menu-select").innerHTML = selectContent;
    $("#newMenuName").value = "";
}
//-----分类  取消按钮----
function cancel() {
    $(".cover").style.display = "none";
}
//---确认按钮
function ok() {
    console.log("----click ok----");
    currentChoose = -1;
    var selectValue = $("#menu-select").value;
    var newMenuName = $("#newMenuName").value;
    if (newMenuName === "") {
        alert("请输入分类名称");
    } else {
        if (selectValue == -1) {
            console.log("新增主分类");
            addMenu(newMenuName);
        } else {
            console.log("增加子分类");
            console.log("----pid----" + selectValue);
            console.log("----newMenuName----" + newMenuName);
            addChildMenu(selectValue,newMenuName);
        }
        initMenus(); //初始化分类
        $(".cover").style.display = "none";
    }
}
//-----------------------------------------------任务列表中添加按钮事件-------------------------------------------
//-------任务状态点击--------
function allTaskClick() {
    addClickEvent($('#all-task'),function () {
        cleanAllActiveOnStatusButton();
        addClass(this,'active');
        initTaskList(currentTaskList);
        console.log('---all-task--');
    });
    addClickEvent($('#finish-task'),function () {
        cleanAllActiveOnStatusButton();
        addClass(this,'active');
        initTaskList(currentTaskList,true);
        console.log('---finish-task--');
    });
    addClickEvent($('#unfinish-task'),function () {
        cleanAllActiveOnStatusButton();
        addClass(this,'active');
        initTaskList(currentTaskList,false);
        console.log('---unfinish-task--');
    });
}
//-------任务详情修改或新建-------------

function inputTask(id) {
    var taskName = $('.task-name');
    var date = $('.date');
    var content = $('.content');
    var operate = $('.operate');
    $(".button-area").style.display = "block";
    taskName.innerHTML = '<input type="text" class="input-title" placeholder="请输入标题">';
    date.innerHTML = '日期： <input type="date" class="input-date" placeholder="请以xxxx-xx-xx形式输入">';
    content.innerHTML = '<textarea class="textarea-content" placeholder="请输入任务内容"></textarea>';
    operate.innerHTML = "";
    if (id !== "" && currentChangTask == 1) {
        var task = queryTaskById(id);
        $('.input-title').value = task.name;
        $('.input-date').value = task.date;
        $('.textarea-content').value = task.content;
        $('.save').innerHTML = '保存修改';
    }
}
//----------修改任务内容---------
function changTask() {
    currentChangTask = 1;
    inputTask(currentTaskId);
}
//----------新建任务内容---------
function createTask() {
    currentChangTask = 0;
    if (currentChoose == 1) {
        inputTask();
    } else {
        alert("请在子分类下建立新的任务");
    }
}
//----------确认修改或保存----------
function sureChange() {
    var taskObj = {};
    taskObj.name = $('.input-title').value;
    taskObj.date = $('.input-date').value;
    taskObj.content = $('.textarea-content').value;
    taskObj.finish = false;
    var reg = /^[0-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
    var regExp = new RegExp(reg);
    taskObj.pid = currentChildMenuId;
    if (taskObj.name == "") {
        $('.info').innerHTML = '标题不能空';
    } else if (taskObj.date == "") {
        $('.info').innerHTML = '日期不能空';
    } else if (!regExp.test(taskObj.date)) {
        $('.info').innerHTML = '日期请按照XXXX-XX-XX格式输入';
    } else if (taskObj.content == "") {
        $('.info').innerHTML = '内容不能空';
    } else {
        if (currentChangTask == 1) {
            updateTaskById(currentTaskId,taskObj.name,taskObj.date,taskObj.content);
            console.log('----更新任务taskId: '+currentTaskId);
            if (currentChoose == -1) {
                initTaskList(queryAllTasks());
            } else if (currentChoose == 0) {
                initTaskList(queryTaskArrByMenuId(currentMenuId));
            } else {
                initTaskList(queryTaskArrByChildMenuId(currentChildMenuId));
            }
        } else {
            currentTaskId = addTask(taskObj);
            console.log('----新创建任务taskId: '+currentTaskId);
            currentChildMenuId = queryTaskById(currentTaskId).pid;
            initMenus();
            initTaskList(queryTaskArrByChildMenuId(currentChildMenuId));
        }
        initTask(currentTaskId);
    }
}
//--------------取消修改或取消创建-----------
function cancelChange () {
    initTask(currentTaskId);
}
//---------------任务状态修改---------------
function finishTask() {
    var r = confirm('确认将该任务标记成已完成吗？');
    if (r == true) {
        updateTaskStatusById(currentTaskId);
        currentChildMenuId = queryTaskById(currentTaskId).pid;
        initTaskList(queryTaskArrByChildMenuId(currentChildMenuId));
        initTask(currentTaskId);
        console.log('taskId- '+ currentTaskId + ':' + queryTaskById(currentTaskId).finish);
    }
}
//----------选择任务列表中第一项目，若无项目置空----
function judgeFirstTask(tasks) {
    if (tasks.length == 0) {
        initTaskList();
        initTask();
    } else {
        initTaskList(tasks);
        currentTaskId = queryFirstTaskInTaskLists();
        initTask(currentTaskId);
    }
}
/**
 * 清除状态按钮高亮
 */
function cleanAllActiveOnStatusButton() {
    removeClass($("#all-task"), "active");
    removeClass($("#unfinish-task"), "active");
    removeClass($("#finish-task"), "active");
}
/**
 * 清除分类列表所有高亮
 * @return {[type]} [description]
 */
function cleanAllActive() {
    removeClass($(".list-title"), "active");
    var h2Elements = $("#menu-lists").getElementsByTagName('h2');
    for (var i = 0; i < h2Elements.length; i++) {
        removeClass(h2Elements[i], "active");
    }
    var h3Elements = $("#menu-lists").getElementsByTagName('h3');
    for (var j = 0; j < h3Elements.length; j++) {
        removeClass(h3Elements[j], "active");
    }
}
/**
 * 清除任务列表的高亮
 */
function cleanTasksHighLight() {
    var list = $('#task-lists');
    var aLi = list.getElementsByTagName('li');
    for (var i = 0; i < aLi.length; i++) {
        removeClass(aLi[i], "active");
    }
}

//查询本地数据存储信息---------------------
function listAllStorage() {
    console.log("=============listAllStorage==============");
    for (var i = 0; i < localStorage.length; i++) {
        var name = localStorage.key(i);
        var value = localStorage.getItem(name);
        console.log("name----->" + name);
        console.log("value---->" + value);
        console.log("---------------------");
    }
    console.log("======End=======listAllStorage==============");
}
initAll();
function initAll() {
    menuListsClick();
    initDataBase();
    initMenus();
    var tasks = queryAllTasks();
    initTaskList(tasks);
    judgeFirstTask(tasks);
    initCover();
    allTaskClick();
}
