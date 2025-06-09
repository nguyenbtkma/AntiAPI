function menucbh0001({
    header = "Bảng Menu",
    footer = "Make by Anticoder",
    input = [],
    time = "2000",
    class_name = null,
    location = "lt",
    coor = "0px, 0px",
    auto = true,
    line = "none",
    theme = "dark"
} = {}) {
    // Xóa menu hiện tại nếu tồn tại
    const existingMenu = document.querySelector('.cbh-menu-container');
    if (existingMenu) {
        existingMenu.style.opacity = '0';
        setTimeout(() => existingMenu.remove(), 300);
    }

    // Tạo container chính
    const menuContainer = document.createElement('div');
    menuContainer.className = `cbh-menu-container ${class_name || ''}`;
    const [x, y] = coor.split(',').map(val => val.trim());
    const isDark = theme === "dark";

    // Cài đặt style cho container
    menuContainer.style.cssText = `
        position: fixed; 
        z-index: 9999; 
        ${location.includes('l') ? 'left' : 'right'}: ${x}; 
        ${location.includes('t') ? 'top' : 'bottom'}: ${y}; 
        transition: opacity 0.3s ease; 
        opacity: 0; 
        background: var(--popup-bg); 
        border: 1px solid var(--popup-border); 
        border-radius: 8px; 
        box-shadow: 0 4px 12px var(--popup-shadow); 
        padding: 10px 0; 
        min-width: 220px; 
        font-family: 'Segoe UI', sans-serif; 
        overflow: hidden;
    `;

    // Tạo header
    const menuHeader = document.createElement('div');
    menuHeader.style.cssText = `
        padding: 8px 16px; 
        font-size: 14px; 
        font-weight: 600; 
        color: var(--text-color); 
        border-bottom: ${line !== 'none' ? `1px solid var(--menu-border)` : 'none'};
    `;
    menuHeader.textContent = header;
    menuContainer.appendChild(menuHeader);

    // Tạo các mục menu
    input.forEach((item, index) => {
        const menuItem = document.createElement('div');
        menuItem.style.cssText = `
            display: flex; 
            align-items: center; 
            padding: 10px 16px; 
            gap: 12px; 
            cursor: pointer; 
            transition: all 0.2s ease; 
            ${index !== input.length - 1 && line !== 'none' ? `border-bottom: 1px solid var(--menu-border);` : ''}
        `;

        // Tạo icon
        let icon;
        if (item.icon.startsWith('fas')) {
            icon = document.createElement('i');
            icon.className = isDark && item.icon_dark ? item.icon_dark : item.icon;
            icon.style.cssText = `
                font-size: 18px; 
                width: 18px; 
                height: 18px; 
                color: var(--default-text); 
                transition: transform 0.2s ease, color 0.2s ease;
            `;
        } else {
            icon = document.createElement('img');
            icon.src = (isDark && item.icon_dark) ? item.icon_dark : item.icon;
            icon.style.cssText = `
                width: 18px; 
                height: 18px; 
                filter: ${isDark && !item.icon_dark ? 'invert(0.8)' : 'none'}; 
                transition: transform 0.2s ease;
            `;
        }
        menuItem.appendChild(icon);

        // Xử lý toggle button hoặc title
        if (item.button) {
            const toggleContainer = document.createElement('div');
            toggleContainer.style.cssText = `flex: 1; display: flex; align-items: center; gap: 10px;`;

            const toggleLabel = document.createElement('span');
            toggleLabel.textContent = item.button;
            toggleLabel.style.cssText = `
                font-size: 14px; 
                color: var(--text-color); 
                font-weight: 500; 
                transition: color 0.2s ease;
            `;
            toggleContainer.appendChild(toggleLabel);

            const toggleSwitch = document.createElement('div');
            let isOn = false;
            toggleSwitch.style.cssText = `
                position: relative; 
                width: 40px; 
                height: 20px; 
                background: var(--input-bg); 
                border-radius: 20px; 
                cursor: pointer; 
                transition: background 0.3s ease; 
                box-shadow: inset 0 1px 3px var(--shadow-color);
            `;

            const toggleCircle = document.createElement('div');
            toggleCircle.style.cssText = `
                position: absolute; 
                top: 2px; 
                left: 2px; 
                width: 16px; 
                height: 16px; 
                background: var(--default-text); 
                border-radius: 50%; 
                transition: transform 0.3s ease, background 0.3s ease; 
                box-shadow: 0 1px 4px var(--shadow-color);
            `;
            toggleSwitch.appendChild(toggleCircle);

            toggleSwitch.onclick = (e) => {
                e.stopPropagation();
                isOn = !isOn;
                toggleSwitch.style.background = isOn ? 'var(--primary-color)' : 'var(--input-bg)';
                toggleCircle.style.background = isOn ? '#ffffff' : 'var(--default-text)';
                toggleCircle.style.transform = isOn ? 'translateX(20px)' : 'translateX(0)';
                if (item.function) item.function(isOn);
            };

            toggleContainer.appendChild(toggleSwitch);
            menuItem.appendChild(toggleContainer);
        } else {
            const title = document.createElement('span');
            title.style.cssText = `
                flex: 1; 
                font-size: 14px; 
                color: var(--text-color); 
                font-weight: 500; 
                transition: color 0.2s ease;
            `;
            title.textContent = item.title;
            menuItem.onclick = (e) => {
                e.stopPropagation();
                if (item.function) item.function();
            };
            menuItem.appendChild(title);
        }

        // Hiệu ứng hover
        menuItem.onmouseenter = () => {
            menuItem.style.background = 'var(--menu-item-hover)';
            icon.style.transform = 'scale(1.1)';
            icon.style.color = 'var(--primary-color)';
            if (item.button) toggleLabel.style.color = 'var(--primary-color)';
            else title.style.color = 'var(--primary-color)';
        };
        menuItem.onmouseleave = () => {
            menuItem.style.background = 'transparent';
            icon.style.transform = 'scale(1)';
            icon.style.color = 'var(--default-text)';
            if (item.button) toggleLabel.style.color = 'var(--text-color)';
            else title.style.color = 'var(--text-color)';
        };
        menuContainer.appendChild(menuItem);
    });

    // Tạo footer
    const menuFooter = document.createElement('div');
    menuFooter.style.cssText = `
        padding: 6px 16px; 
        font-size: 11px; 
        color: var(--default-text); 
        text-align: center; 
        border-top: ${line !== 'none' ? `1px solid var(--menu-border)` : 'none'};
    `;
    menuFooter.textContent = footer;
    menuContainer.appendChild(menuFooter);

    // Tự động điều chỉnh vị trí nếu vượt quá màn hình
    if (auto) {
        document.body.appendChild(menuContainer);
        const rect = menuContainer.getBoundingClientRect();
        if (location.includes('l') && rect.right > window.innerWidth) {
            menuContainer.style.left = 'auto';
            menuContainer.style.right = x;
        }
        if (location.includes('t') && rect.bottom > window.innerHeight) {
            menuContainer.style.top = 'auto';
            menuContainer.style.bottom = y;
        }
    }

    // Hiển thị menu với hiệu ứng
    setTimeout(() => {
        document.body.appendChild(menuContainer);
        setTimeout(() => menuContainer.style.opacity = '1', 10);
    }, existingMenu ? 310 : 0);

    // Ẩn menu sau thời gian hoặc khi click ngoài
    let hideTimer;
    const hideMenu = () => {
        menuContainer.style.opacity = '0';
        setTimeout(() => menuContainer.remove(), 300);
    };

    menuContainer.onmouseenter = () => clearTimeout(hideTimer);
    menuContainer.onmouseleave = () => {
        hideTimer = setTimeout(hideMenu, parseInt(time));
    };

    const handleClickOutside = (e) => {
        if (!menuContainer.contains(e.target)) {
            clearTimeout(hideTimer);
            hideMenu();
            document.removeEventListener('click', handleClickOutside);
        }
    };

    setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
    }, 100);

    return menuContainer;
}