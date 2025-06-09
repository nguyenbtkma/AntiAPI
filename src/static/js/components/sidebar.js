class SidebarManager {
    constructor(elementId, sideBarData, apiData) {
        this.sidebarNav = document.getElementById(elementId);
        this.sideBarData = sideBarData || [];
        this.apiData = apiData || [];

        if (!this.sidebarNav) {
            console.error('Element not found:', elementId);
            return;
        }

        this.render();
    }

    render() {
        this.sidebarNav.innerHTML = '';

        if (this.sideBarData.length === 0) return;

        const projectData = this.sideBarData.find(item => item.type === "project");
        if (projectData) {
            this.appendElement(this.sidebarNav, this.createProjectElement(projectData));
        }

        const topicsContainer = this.createElement('div', { className: 'space-y-2' });
        this.appendElement(this.sidebarNav, topicsContainer);

        const topics = this.sideBarData.filter(item => item.type === "topic");
        topics.forEach(topic => {
            this.appendElement(topicsContainer, this.createTopicElement(topic));
        });

        this.attachMenuEvents();
        this.attachTopicMenuEvents();
        this.attachProjectMenuEvents();
    }

    updateTopicState(topicId, isOpen) {
        this.sideBarData.forEach(item => {
            if (item.type === "topic") item.isOpen = false;
        });

        const topic = this.sideBarData.find(item => item.type === "topic" && item.id === topicId);
        if (topic) {
            topic.isOpen = isOpen;
            this.activeTopicId = isOpen ? topicId : null;

            if (isOpen && typeof this.onTopicClick === 'function') {
                this.onTopicClick(topic);
            }
            this.render();
        }
    }

    createProjectElement(projectData) {
        const projectContainer = this.createElement('div', { className: 'mb-1' });
        const projectHeader = this.createElement('div', {
            className: 'flex justify-between items-center group p-1 menu-item-hover transition-all duration-200',
            innerHTML: `
                <div class="font-semibold pl-2">${this.truncateText(projectData.content, 16)}</div>
                <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 project-menu-icon-container cursor-pointer">
                    <i class="fa-solid fa-ellipsis text-xs menu-icon"></i>
                </div>
            `
        });
        this.appendElement(projectContainer, projectHeader);
        return projectContainer;
    }

    createTopicElement(topic) {
        const topicContainer = this.createElement('div', { className: 'mb-1' });
        const isActive = topic.isOpen;
        const topicHeader = this.createElement('div', {
            className: `flex justify-between items-center group p-1 menu-item-hover transition-all duration-200 ${isActive ? 'topic-active' : ''}`,
            innerHTML: this.getTopicHeaderHTML(topic)
        });

        topicHeader.dataset.topicId = topic.id;
        topicHeader.addEventListener('click', (e) => {
            if (!e.target.classList.contains('menu-icon') && !e.target.closest('.topic-menu-icon-container')) {
                this.updateTopicState(topic.id, !topic.isOpen);
            }
        });

        this.appendElement(topicContainer, topicHeader);

        if (topic.isOpen) {
            const topicApis = this.apiData.filter(api => api.topicId === topic.id);
            if (topicApis.length > 0) {
                this.appendElement(topicContainer, this.createApisContainer(topicApis));
            }
        }

        return topicContainer;
    }

    getTopicHeaderHTML(topic) {
        const isActive = topic.isOpen;
        return `
            <div class="flex items-center">
                <i class="fa-${isActive ? 'solid fa-folder-open folder-open-icon' : 'regular fa-folder folder-icon'} text-sm"></i>
                <div class="ml-2 text-sm overflow-hidden whitespace-nowrap max-w-[130px] topic-text ${isActive ? 'font-medium' : ''}">${this.truncateText(topic.content, 16)}</div>
            </div>
            <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 topic-menu-icon-container cursor-pointer">
                <i class="fa-solid fa-ellipsis text-xs menu-icon"></i>
            </div>
        `;
    }

    createApisContainer(apis) {
        const apisContainer = this.createElement('div', { className: 'ml-4 mt-1 space-y-1 pl-2 border-l border-opacity-50' });
        apis.forEach(api => this.appendElement(apisContainer, this.createApiElement(api)));
        return apisContainer;
    }

    createApiElement(api) {
        const apiItem = this.createElement('div', {
            className: 'flex justify-between items-center group px-2 py-1 menu-item-hover transition-all duration-200 cursor-pointer api-item',
            innerHTML: this.getApiElementHTML(api)
        });

        apiItem.dataset.apiId = api.id;
        apiItem.addEventListener('click', (e) => {
            if (!e.target.classList.contains('menu-icon') && !e.target.closest('.menu-icon-container')) {
                if (typeof this.onApiClick === 'function') {
                    this.onApiClick(api);
                } else {
                    console.log(`API clicked: ${api.protocol} ${api.content}`);
                }
            }
        });

        return apiItem;
    }

    getApiElementHTML(api) {
        const protocolClass = this.getProtocolClass(api.protocol);
        return `
            <div class="flex items-center">
                <div class="mr-2 font-medium text-xs ${protocolClass}">${api.protocol}</div>
                <div class="text-sm overflow-hidden whitespace-nowrap max-w-[100px]">${this.truncateText(api.content, 12 - api.protocol.length)}</div>
            </div>
            <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 menu-icon-container">
                <i class="fa-solid fa-ellipsis text-xs menu-icon"></i>
            </div>
        `;
    }

    getProtocolClass(protocol) {
        return {
            'GET': 'api-get',
            'POST': 'api-post',
            'PATCH': 'api-patch',
            'DELETE': 'api-delete'
        }[protocol] || '';
    }

    truncateText(text, maxLength) {
        return text && text.length > maxLength ? text.substring(0, maxLength) + '...' : text || '';
    }

    createElement(tag, options = {}) {
        const element = document.createElement(tag);
        Object.entries(options).forEach(([key, value]) => {
            if (key === 'innerHTML') element.innerHTML = value;
            else if (key === 'textContent') element.textContent = value;
            else element[key] = value;
        });
        return element;
    }

    appendElement(parent, child) {
        if (parent && child) parent.appendChild(child);
    }

    attachMenuEvents() {
        this.sidebarNav.querySelectorAll('.api-item .menu-icon-container')
            .forEach(icon => {
                icon.removeEventListener('click', this.handleMenuClick);
                icon.addEventListener('click', this.handleMenuClick.bind(this));
            });
    }

    handleMenuClick(e) {
        e.stopPropagation();
        const rect = e.target.getBoundingClientRect();
        const apiId = Number(e.target.closest('.api-item').dataset.apiId);
        this.initMenuFunction(e.target, rect, apiId);
    }

    initMenuFunction(target, rect, id) {
        menucbh0001({
            header: "API Settings",
            footer: "Welcome to AntiAPI",
            input: [{
                icon: "fas fa-backspace",
                title: "Delete API",
                function: () => typeof this.onDeleteApi === 'function' ? this.onDeleteApi(id) : console.warn('No delete API handler set')
            }],
            time: "2000",
            location: "lt",
            coor: `${rect.left}px, ${rect.bottom}px`,
            line: "black",
            theme: 'dark',
            class_name: "custom-menu-style"
        });
    }

    attachTopicMenuEvents() {
        this.sidebarNav.querySelectorAll('.topic-menu-icon-container')
            .forEach(icon => {
                icon.removeEventListener('click', this.handleTopicMenuClick);
                icon.addEventListener('click', this.handleTopicMenuClick.bind(this));
            });
    }

    handleTopicMenuClick(e) {
        e.stopPropagation();
        const rect = e.target.getBoundingClientRect();
        const topicId = Number(e.target.closest('div[data-topic-id]').dataset.topicId);
        this.initTopicMenuFunction(e.target, rect, topicId);
    }

    initTopicMenuFunction(target, rect, id) {
        menucbh0001({
            header: "Topic Settings",
            footer: "Welcome to AntiAPI",
            input: [
                {
                    icon: "fas fa-plus",
                    title: "New API",
                    function: () => typeof this.addNewApi === 'function' ? this.addNewApi(id) : console.warn('No add API handler set')
                },
                {
                    icon: "fas fa-backspace",
                    title: "Delete Topic",
                    function: () => typeof this.onDeleteTopic === 'function' ? this.onDeleteTopic(id) : console.warn('No delete topic handler set')
                }
            ],
            time: "2000",
            location: "lt",
            coor: `${rect.left}px, ${rect.bottom}px`,
            line: "black",
            theme: 'dark',
            class_name: "custom-menu-style"
        });
    }

    attachProjectMenuEvents() {
        this.sidebarNav.querySelectorAll('.project-menu-icon-container')
            .forEach(icon => {
                icon.removeEventListener('click', this.handleProjectMenuClick);
                icon.addEventListener('click', this.handleProjectMenuClick.bind(this));
            });
    }

    handleProjectMenuClick(e) {
        e.stopPropagation();
        const rect = e.target.getBoundingClientRect();
        this.initProjectMenuFunction(e.target, rect);
    }

    initProjectMenuFunction(target, rect) {
        menucbh0001({
            header: "Project Settings",
            footer: "Welcome to AntiAPI",
            input: [
                { icon: "fas fa-plus", title: "Add Topic", function: () => this.onAddTopic ? this.onAddTopic() : console.warn('No add topic handler set') },
                { icon: "fas fa-search", title: "Scan", function: () => this.onScanProject ? this.onScanProject() : console.warn('No scan project handler set') },
                { icon: "fas fa-shield-alt", title: "Protect", function: () => this.onProtectProject ? this.onProtectProject() : console.warn('No protect project handler set') },
                { icon: "fas fa-trash", title: "Delete Project", function: () => this.onDeleteProject ? this.onDeleteProject() : console.warn('No delete project handler set') }
            ],
            time: "2000",
            location: "lt",
            coor: `${rect.left}px, ${rect.bottom}px`,
            line: "black",
            theme: 'dark',
            class_name: "custom-menu-style"
        });
    }

    setApiClickHandler(callback) { this.onApiClick = callback; }
    setTopicClickHandler(callback) { this.onTopicClick = callback; }
    setDeleteApiHandler(callback) { this.onDeleteApi = callback; }
    setDeleteTopicHandler(callback) { this.onDeleteTopic = callback; }
    setAddNewApiHandler(callback) { this.addNewApi = callback; }
    setAddTopicHandler(callback) { this.onAddTopic = callback; }
    setScanProjectHandler(callback) { this.onScanProject = callback; }
    setProtectProjectHandler(callback) { this.onProtectProject = callback; }
    setDeleteProjectHandler(callback) { this.onDeleteProject = callback; }

    updateApis(apis) {
        this.apiData = apis;
        this.render();
    }

    updateTopics(topics) {
        this.sideBarData = this.sideBarData.filter(item => item.type === "project").concat(topics);
        this.render();
    }
}

function initSidebar(elementId, topicsData, apisData) {
    return new SidebarManager(elementId, topicsData, apisData);
}

let sidebarInstance = null;
function getSidebarInstance() { return sidebarInstance; }
function setSidebarInstance(instance) { sidebarInstance = instance; }

export { initSidebar, SidebarManager, getSidebarInstance, setSidebarInstance };