import { format, parseISO } from 'date-fns'

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}



const Todo = (() => {

    var projectList
    var pID
    var eID
    var whichOne // variable to know after inputs which view to show
    var p_list // with inputs to see which projects can be chosen in selection


    function init() {

        localStorage.clear()
        if (localStorage.length === 0) {
            populateStorage()
        }

        whichOne = 'all'
        p_list = document.getElementById('project')
            /**
             * To know what to do on load 
             */
        addNavbar()
        showErrands()

    }

    /**
     * If storage is empty, it populates it with default values. 
     */

    function populateStorage() {


        var pID = 0
        localStorage.setItem('pID', pID)
        var eID = 0
        localStorage.setItem('eID', eID)

        pID = parseInt(localStorage.getItem('pID'))
        var p1 = new Project(pID, 'Project 1', [])
        pID += 1
        localStorage.setItem('pID', pID)

        pID = parseInt(localStorage.getItem('pID'))
        var p2 = new Project(pID, 'Project 2', [])


        projectList = [p1, p2]




        eID = parseInt(localStorage.getItem('eID'))
        var e1 = new Errand(eID, 'Finished errand', 'Click on the errand makes it completed so it is crossed', '01-05', 'high', 'Projekt 1', true);
        eID += 1
        localStorage.setItem('eID', eID)

        eID = parseInt(localStorage.getItem('eID'))
        var e2 = new Errand(eID, 'Unfinished errand', 'If you want to remove errand just double click on it', '05-01', 'low', 'Projekt 2', false);
        eID += 1
        localStorage.setItem('eID', eID)

        eID = parseInt(localStorage.getItem('eID'))
        var e3 = new Errand(eID, 'Colors of the dates', 'Based on the priority of errand you get the color around the date. Red means high, yellow medium and green low. ', '05-04', 'medium', 'Projekt 1', false);
        localStorage.setItem('eID', eID)

        p1.errandList.push(e1, e3)
        p2.errandList.push(e2)

        localStorage.setObject('projectList', projectList)


    }

    /**
     * Constructor for Errand 
     */

    function Errand(id, title, description, dueDate, priority, project, completed) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.project = project;
        this.completed = completed
    }

    /**
     * Constructor for Project 
     */

    function Project(id, title, errandList) {
        this.id = id;
        this.title = title;
        this.errandList = errandList;
    }


    /**
     * Dummy inputs to see if it works
     * */








    /**
     * Toggles done an errand:
     *  - gets id of project and errand
     *  - finds both of them 
     *  - and toggles the completed variable
     */


    function toggleDone(e) {

        var project = e.path[2].id

        projectList = localStorage.getObject('projectList')

        var rightProject = projectList.find(x => x.title == project)

        var errand = e.path[1].id;

        var rightErrand = rightProject.errandList.findIndex(x => x.id == errand)

        if (rightProject.errandList[rightErrand].completed) {
            rightProject.errandList[rightErrand].completed = false
        } else rightProject.errandList[rightErrand].completed = true

        localStorage.setObject('projectList', projectList)

        if (whichOne == 'all') {
            showErrands()

        } else showProject(whichOne)

    }

    /**
     * Adds functionalities for the page such as:
     *  - click to toggle done on errand
     *  - double click to remove errand
     *  - put options to project selection
     *  - adds new element to side navigation
     * */

    function addFunctionalities() {
        var ps = document.getElementsByClassName('errand');
        var psTitle = document.getElementsByClassName('errandTitle')


        for (var i = 0; i < ps.length; i++) {
            ps[i].addEventListener('dblclick', removeErrand)
            ps[i].addEventListener('click', toggleDone)
            psTitle[i].addEventListener('click', toggleDone)

        }

        var h1s = document.getElementsByTagName('h2')
        for (var i = 0; i < h1s.length; i++) {
            h1s[i].addEventListener('click', showProject)
        }

        var disableOption = document.createElement('option');
        disableOption.value = ''
        disableOption.text = 'Select project'
        disableOption.disabled = true
        disableOption.selected = true

        p_list.add(disableOption)

        var sideNav = document.getElementById('sideNav')
        sideNav.innerHTML = ''

        projectList = localStorage.getObject('projectList')

        for (var i = 0; i < projectList.length; i++) {
            var pro = document.createElement('option');
            var pNav = document.createElement('p')
            pNav.innerHTML = projectList[i].title
            pNav.addEventListener('click', showProject)
            pNav.className = 'sideNav'
            sideNav.append(pNav)

            pro.value = projectList[i].title
            pro.text = projectList[i].title

            p_list.add(pro)
        }

        var spans = document.getElementsByClassName('rProject');
        for (var i = 0; i < spans.length; i++) {
            spans[i].addEventListener('click', removeProject)
        }


    }

    /**
     * Shows a page with certain project:
     *  - based on input (e) gets the right one
     *  - shows all errand which shows them as done or not done yet  
     */

    function showProject(e) {

        var project = ''

        if (typeof e === 'string') {
            project = e;
            whichOne = e;
        } else {
            if (e.path[1].id === 'sideNav') {
                project = e.srcElement.innerHTML
                whichOne = e.srcElement.innerHTML
            } else {
                whichOne = e.path[1].id
                project = e.path[1].id
            }
        }

        projectList = localStorage.getObject('projectList')

        var rightProject = projectList.find(x => x.title == project)


        var content = document.getElementById('content');
        content.innerHTML = ''


        var div = document.createElement('div');
        var h1 = document.createElement('h2');
        var s = document.createElement('span')
        s.innerHTML = '&#10005;'
        s.className = 'rProject'
        h1.innerHTML = rightProject.title;
        div.append(h1, s)
        div.id = rightProject.title

        var tmp = rightProject.errandList
        for (var j = 0; j < tmp.length; j++) {
            var errand = document.createElement('div')

            var priority = tmp[j].priority;
            var p = document.createElement('p');
            var pTitle = document.createElement('p')
            var pDate = document.createElement('p')
            pDate.innerHTML = tmp[j].dueDate
            pTitle.innerHTML = tmp[j].title

            p.innerHTML = tmp[j].description
            pDate.className = 'errandDate'
            if (tmp[j].completed) {
                pTitle.className = 'errandTitle done'
                p.className = 'errand done'
            } else {
                p.className = 'errand notDone'
                pTitle.className = 'errandTitle notDone'

            }

            if (priority == 'high') {
                pDate.className += ' high'
            } else if (priority == 'medium') {
                pDate.className += ' medium'
            } else pDate.className += ' low'


            errand.id = tmp[j].id
            errand.append(pTitle, pDate, p)

            div.append(errand)

        }
        content.append(div)
        p_list.innerText = ''
        addFunctionalities()
    }

    /**
     * Checks inputs on creation of errand, if they are empty returns false
     */
    function checkErrandInputs(title, description, dueDate) {
        if (title == '' || description == '' || dueDate == '') {
            return false
        } else return true
    }

    /**
     * Validates errand inputs and decide if they are valid and colors them if they are empty
     */

    function validateErrandInput(title, description, dueDate) {
        if (title == '') {
            document.getElementById('title').className = 'invalid'
        } else document.getElementById('title').className = 'valid'
        if (description == '') {
            document.getElementById('description').className = 'invalid'
        } else document.getElementById('description').className = 'valid'
        if (dueDate == '') {
            document.getElementById('dueDate').className = 'invalid'
        } else document.getElementById('dueDate').className = 'valid'
    }

    /**
     * Adds an errand to the project:
     *  - gets the values from inputs
     *  - check them if they are valid 
     *  - make a new errand with inputs
     *  - gets the right project and adds it to errandList of the project
     */

    function addErrand() {

        var title = document.getElementById('title').value;
        var description = document.getElementById('description').value;
        var dueDate = document.getElementById('dueDate').value;
        var priority = document.getElementById('priority').value
        var project = document.getElementById('project').value
        if (checkErrandInputs(title, description, dueDate)) {
            document.getElementById('title').className = 'valid'
            document.getElementById('description').className = 'valid'
            document.getElementById('dueDate').className = 'valid'


            eID = parseInt(localStorage.getItem('eID'))
            eID += 1;

            var dateInput = format(parseISO(dueDate), 'dd-MM')

            var newE = new Errand(eID, title, description, dateInput, priority, project, false);
            localStorage.setItem('eID', eID)

            var rightProject = projectList.find(x => x.title == project)

            rightProject.errandList.push(newE)

            document.getElementById('eInput').style.display = 'none'

            localStorage.setObject('projectList', projectList)
            if (whichOne == 'all') {
                showErrands()

            } else showProject(whichOne)

        } else {
            validateErrandInput(title, description, dueDate) // this shows which inputs is not valid
        }
    }

    /**
     * Shows all projects and errands. Basiclly a home page:
     *  - makes div for each project 
     *  - makes p for each errand inside the project
     *  - gets whether errand is done or not
     *  - clears the inputs
     */

    function showErrands() {
        whichOne = 'all'
        var content = document.getElementById('content');
        content.innerHTML = ''

        projectList = localStorage.getObject('projectList')

        for (var project = 0; project < projectList.length; project++) {
            var div = document.createElement('div');
            var h1 = document.createElement('h2');

            h1.innerHTML = projectList[project].title;
            var s = document.createElement('span')
            s.innerHTML = '&#10005;'
            s.className = 'rProject'

            div.append(h1, s)
            div.id = projectList[project].title
            var tmp = projectList[project].errandList
            for (var j = 0; j < tmp.length; j++) {
                var errand = document.createElement('div')
                var priority = tmp[j].priority;
                var p = document.createElement('p');
                var pTitle = document.createElement('p')
                var pDate = document.createElement('p')
                pDate.innerHTML = tmp[j].dueDate
                pTitle.innerHTML = tmp[j].title

                p.innerHTML = tmp[j].description
                pDate.className = 'errandDate'
                if (tmp[j].completed) {
                    pTitle.className = 'errandTitle done'
                    p.className = 'errand done'
                } else {
                    p.className = 'errand notDone'
                    pTitle.className = 'errandTitle notDone'
                }

                if (priority == 'high') {
                    pDate.className += ' high'
                } else if (priority == 'medium') {
                    pDate.className += ' medium'
                } else pDate.className += ' low'
                errand.id = tmp[j].id
                errand.append(pTitle, pDate, p)

                div.append(errand)
            }
            content.append(div)
        }

        var title = document.getElementById('title');
        var description = document.getElementById('description');
        var dueDate = document.getElementById('dueDate');

        title.value = ''
        description.value = ''
        dueDate.value = format(new Date(), 'yyyy-MM-dd')
        p_list.innerText = ''

        addFunctionalities()

    }

    /**
     * Removes errand from project:
     *  - gets the id of the project and finds it
     *  - gets the errand that was chosen
     *  - splices the errandList of the project
     */

    function removeErrand(e) {

        projectList = localStorage.getObject('projectList')

        var project = e.path[2].id

        var rightProject = projectList.find(x => x.title == project)

        var errand = e.path[1].id;

        var rightErrand = rightProject.errandList.findIndex(x => x.id == errand)

        rightProject.errandList.splice(rightErrand, 1);

        localStorage.setObject('projectList', projectList)

        if (whichOne == 'all') {
            showErrands()

        } else showProject(whichOne)
    }


    /**
     * Removes project from the list
     */

    function removeProject(e) {

        var project = e.path[1].id
        var rightProject = projectList.findIndex(x => x.title == project)
        projectList.splice(rightProject, 1);

        localStorage.setObject('projectList', projectList)
        showErrands()
    }



    /**
     * From the project input creates input:
     *  - gets the value of input
     *  - checks whether it is empty or not
     *  - creates new project with empty errandList
     */

    function addProject() {
        var makeP = document.getElementById('projectTitle')

        if (checkProjectInput(makeP.value)) {
            pID = parseInt(localStorage.getItem('pID'))
            pID += 1
            var project = new Project(pID, makeP.value, [])
            localStorage.setItem('pID', pID)

            projectList = localStorage.getObject('projectList')

            projectList.push(project)

            localStorage.setObject('projectList', projectList)
            makeP.value = ''

            p_list.innerText = ''
            if (whichOne == 'all') {
                showErrands()

            } else showProject(whichOne)

            makeP.className = 'valid'
            document.getElementById('pInput').style.display = 'none'

        } else makeP.className = 'invalid'

    }

    /**
     * Checks if projectTitle input is empty
     */

    function checkProjectInput(title) {
        if (title == '') {
            return false
        } else return true
    }

    /**
     * Adds the title and navigation bar with three buttons:
     *  - creates title
     *  - creates buttons and assign them text and ids
     *  - prepend them to body
     *  - add eventListeners to each of them 
     */

    function addNavbar() {
        var title = document.createElement('h1')
        title.innerHTML = 'Your To-Do'

        var nav = document.createElement('nav');
        var div1 = document.createElement('div');
        var div2 = document.createElement('div');

        var home = document.createElement('button');
        var newProject = document.createElement('button');
        var newErrand = document.createElement('button');

        newProject.innerHTML = 'Add project';
        newErrand.innerHTML = 'Add errand';
        newProject.id = 'newProject'
        newErrand.id = 'newErrand'
        home.innerHTML = 'Home';
        home.id = 'home';

        div1.id = 'homeButton'
        div1.append(home)
        div2.id = 'addButtons'
        div2.append(newProject, newErrand)

        nav.append(div1, div2);
        document.body.prepend(title, nav);


        document.getElementById('home').addEventListener('click', showErrands)
        document.getElementById('newProject').addEventListener('click', showNewProject)
        document.getElementById('newErrand').addEventListener('click', showNewErrand)
    }

    /**
     * Show modal window for new project
     */

    function showNewProject() {
        var input = document.getElementById('pInput');
        var span = document.getElementsByTagName('span')[0]
        var submit = document.getElementById('makeProject')
        submit.addEventListener('click', addProject);
        span.addEventListener('click', close)
        input.style.display = 'block'
    }

    /**
     * Show modal window for new errand
     */

    function showNewErrand() {
        var input = document.getElementById('eInput');
        var span = document.getElementsByTagName('span')[1]
        var submit = document.getElementById('submit')

        submit.addEventListener('click', addErrand);
        span.addEventListener('click', close)
        input.style.display = 'block'
    }

    /**
     * Closes each of the modal windows:
     *  - gets the path so it sees which one to close
     *  - make all inputs valid so in the next opening they are not red
     */
    function close(e) {
        e.path[2].style.display = 'none'
        document.getElementById('title').className = 'valid'
        document.getElementById('description').className = 'valid'
        document.getElementById('dueDate').className = 'valid'
        document.getElementById('projectTitle').className = 'valid'
    }



    return { init }

})();


Todo.init();


/**
 * Look how to deploy it on the github with css. (restaurant)
 * Make a readme (where to see it and a bit of description)
 * Put it on odin project 
 */