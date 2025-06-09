function popupcbh0001(title = "Nhập thông tin", input = [], class_name = null, en = null, theme = "dark", function_output = null) {
    const baseStyles = `
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(2px);
}
.popup-container {
    position: relative;
    width: 500px;
    max-width: 95%;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 6px 20px var(--popup-shadow);
    animation: popup-fade 0.3s ease-out;
    transform-origin: center;
}
.popup-close {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    font-size: 20px;
    color: var(--default-text);
    transition: all 0.3s ease;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--hover-bg);
}
.popup-close:hover {
    color: var(--primary-color);
    background: var(--menu-item-hover);
    transform: rotate(90deg);
}
.popup-header {
    padding: 16px 24px;
    font-weight: 600;
    font-size: 16px;
    border-bottom: 1px solid var(--popup-border);
    display: flex;
    align-items: center;
    position: relative;
    background: var(--header-bg);
    color: var(--text-color);
}
.popup-body {
    padding: 24px;
    max-height: 70vh;
    overflow-y: auto;
    overflow-x: hidden;
    background: var(--popup-bg);
    color: var(--text-color);
}
.popup-form-group {
    margin-bottom: 16px;
    width: 100%;
}
.popup-label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
    font-size: 13px;
    letter-spacing: 0.2px;
    color: ${theme === "dark" ? '#ffffff' : '#000000'}; /* Trắng trong dark, đen trong white */
}
.popup-input, .popup-select, .popup-textarea {
    width: 100%;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid var(--input-border);
    font-size: 14px;
    box-sizing: border-box;
    transition: all 0.3s ease;
    font-family: inherit;
    background: var(--input-bg);
    color: var(--text-color);
    box-shadow: 0 1px 3px var(--shadow-color);
}
.popup-textarea {
    min-height: 100px;
    resize: vertical;
    line-height: 1.5;
}
.popup-input:focus, .popup-select:focus, .popup-textarea:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-shadow);
    outline: none;
}
.popup-footer {
    padding: 16px 24px;
    text-align: right;
    border-top: 1px solid var(--popup-border);
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    background: var(--header-bg);
}
.popup-btn {
    padding: 10px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    font-size: 13px;
}
.popup-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--primary-shadow);
}
.popup-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px var(--shadow-color);
}
.popup-btn-primary {
    background: var(--primary-gradient);
    color: #ffffff;
}
.popup-btn-primary:hover {
    background: var(--primary-color);
}
.popup-btn-secondary {
    background: var(--hover-bg);
    color: var(--text-color);
}
.popup-btn-secondary:hover {
    background: var(--menu-item-hover);
}
@keyframes popup-fade {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
.popup-body::-webkit-scrollbar {
    width: 6px;
}
.popup-body::-webkit-scrollbar-track {
    background: transparent;
}
.popup-body::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: var(--scrollbar-thumb);
}
.popup-body::-webkit-scrollbar-thumb:hover {
    background: var(--default-text);
}
.popup-required {
    color: var(--error-color);
    margin-left: 3px;
    font-weight: 600;
}
.popup-form-group input::placeholder, .popup-form-group textarea::placeholder {
    color: var(--default-text);
}
.popup-radio-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 4px;
}
.popup-radio-item {
    display: flex;
    align-items: center;
    cursor: pointer;
}
.popup-radio-item input[type="radio"] {
    width: 18px;
    height: 18px;
    margin-right: 10px;
    cursor: pointer;
    accent-color: var(--primary-color);
}
.popup-radio-item label {
    cursor: pointer;
    font-size: 14px;
    color: var(--text-color);
}
`;

    const buildFormField = (field) => {
        const { filed_name, feild_key, type, not_null, value, options } = field;
        const name = filed_name || feild_key || 'Field';
        const key = feild_key || filed_name?.toLowerCase().replace(/\s+/g, '_') || 'field';
        const required = not_null ? 'required' : '';
        const requiredMark = not_null ? '<span class="popup-required">*</span>' : '';

        let fieldHtml = '';
        switch (type) {
            case 'text':
            case 'number':
            case 'date':
            case 'password':
                fieldHtml = `
                <div class="popup-form-group">
                    <label class="popup-label" for="${key}">${name}${requiredMark}</label>
                    <input class="popup-input" type="${type}" id="${key}" name="${key}" ${required} value="${value || ''}" placeholder="${name}">
                </div>
            `;
                break;
            case 'textarea':
                fieldHtml = `
                <div class="popup-form-group">
                    <label class="popup-label" for="${key}">${name}${requiredMark}</label>
                    <textarea class="popup-textarea" id="${key}" name="${key}" ${required} placeholder="${name}">${value || ''}</textarea>
                </div>
            `;
                break;
            case 'radio':
                const radioOptions = options || [];
                const radioHtml = radioOptions.map((opt, index) => {
                    const optId = `${key}_${index}`;
                    const isChecked = value === opt ? 'checked' : '';
                    return `
                    <div class="popup-radio-item">
                        <input type="radio" id="${optId}" name="${key}" value="${opt}" ${isChecked} ${required}>
                        <label for="${optId}">${opt}</label>
                    </div>`;
                }).join('');
                fieldHtml = `
                <div class="popup-form-group">
                    <label class="popup-label">${name}${requiredMark}</label>
                    <div class="popup-radio-group">
                        ${radioHtml}
                    </div>
                </div>
                `;
                break;
            case 'option':
                const optionsList = options || [];
                const optionsHtml = optionsList.map(opt => `<option value="${opt}">${opt}</option>`).join('');
                fieldHtml = `
                <div class="popup-form-group">
                    <label class="popup-label" for="${key}">${name}${requiredMark}</label>
                    <select class="popup-select" id="${key}" name="${key}" ${required}>
                        <option value="">-- Chọn ${name} --</option>
                        ${optionsHtml}
                    </select>
                </div>
            `;
                break;
            default:
                fieldHtml = `
                <div class="popup-form-group">
                    <label class="popup-label" for="${key}">${name}${requiredMark}</label>
                    <input class="popup-input" type="text" id="${key}" name="${key}" ${required} placeholder="${name}">
                </div>
            `;
        }
        return fieldHtml;
    };

    const formFields = input.map(field => buildFormField(field)).join('');

    const styleEl = document.createElement('style');
    styleEl.textContent = baseStyles;
    document.head.appendChild(styleEl);

    const popupEl = document.createElement('div');
    popupEl.className = class_name ? `popup-overlay ${class_name}` : 'popup-overlay';
    popupEl.innerHTML = `
<div class="popup-container">
    <div class="popup-header">
        ${title}
        <div class="popup-close">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M1 1L13 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
        </div>
    </div>
    <div class="popup-body">
        <form id="popupForm">
            ${formFields}
        </form>
    </div>
    <div class="popup-footer">
        <button type="button" class="popup-btn popup-btn-secondary popup-cancel">
            ${en ? 'Cancel' : 'Hủy'}
        </button>
        <button type="submit" class="popup-btn popup-btn-primary popup-submit">
            ${en ? 'Confirm' : 'Xác nhận'}
        </button>
    </div> 
</div>
`;

    document.body.appendChild(popupEl);

    input.forEach(field => {
        if (field.type === 'option' && field.value) {
            const selectEl = popupEl.querySelector(`#${field.feild_key}`);
            if (selectEl) selectEl.value = field.value;
        }
    });

    const adjustPopupHeight = () => {
        const popupBody = popupEl.querySelector('.popup-body');
        const form = popupEl.querySelector('#popupForm');
        if (form.offsetHeight < parseInt(window.getComputedStyle(popupBody).maxHeight)) {
            popupBody.style.overflow = 'hidden';
        }
    };

    setTimeout(adjustPopupHeight, 100);

    const closePopup = () => {
        popupEl.classList.add('popup-closing');
        popupEl.querySelector('.popup-container').style.animation = 'popup-fade 0.2s reverse';
        setTimeout(() => {
            popupEl.remove();
            styleEl.remove();
        }, 200);
    };

    popupEl.querySelector('.popup-close').addEventListener('click', closePopup);
    popupEl.querySelector('.popup-cancel').addEventListener('click', closePopup);

    popupEl.addEventListener('click', (e) => {
        if (e.target === popupEl) closePopup();
    });

    popupEl.querySelector('#popupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        if (typeof function_output === 'function') function_output(data);
        closePopup();
    });

    popupEl.querySelector('.popup-submit').addEventListener('click', () => {
        popupEl.querySelector('#popupForm').dispatchEvent(new Event('submit'));
    });

    return {
        close: closePopup,
        getElement: () => popupEl
    };
}