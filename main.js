let content = [];
let isEditMode = false;

// --- Should be replaced with server calls ---
const getContent = () => {
    // Get content from server
    // Included is just example text
    return [{
        id: 0,
        mainHeader: 'Besökare',
        subContent: [
            {
                id: 0,
                subHeader: 'Kostnad',
                text: '50 kr i timmen'
            },
            {
                id: 1,
                subHeader: 'Värd',
                text: 'Varje besökare måste ha en dedikerad värd under hela besöket'
            }
        ]
    },{
        id: 1,
        mainHeader: 'Besökare',
        subContent: [
            {
                id: 0,
                subHeader: 'Kostnad',
                text: '50 kr i timmen'
            },
            {
                id: 1,
                subHeader: 'Värd',
                text: 'Varje besökare måste ha en dedikerad värd under hela besöket'
            }
        ]
    }]
}

const saveContent = () => {
    console.log(content);
    // Save content to server
}

const canEdit = () => {
    // Check if logged in user have permission to edit
    return true;
}
// -------------------------------------------

const getHighestMainId = () => {
    let id = 0;
    for (const main of content)
        if (main.id > id)
            id = main.id;

    return id;
}

const getHighestSubId = subContent => {
    let id = 0;
    for (const subCont of subContent)
        if (subCont.id > id)
            id = subCont.id;

    return id;
}

const bodyLoaded = () => {
    content = getContent();
    document.getElementById('editModeChkBx').addEventListener('change', (e) => {
        isEditMode = e.currentTarget.checked;
        renderContent();
    });

    document.getElementById('editCheckBox').style.display = canEdit() ? 'block' : 'none';
    
    renderContent();
}

const renderContent = () => {
    const mainContentDiv = document.getElementById('mainContent');
    mainContentDiv.innerHTML = '';
    for (const mainCont of content) {
        const mainDiv = document.createElement('section');
        const headerDiv = document.createElement('div');
        headerDiv.classList.add('fullWidth');
        mainDiv.appendChild(headerDiv);
        const mainHeader = document.createElement('h1');
        mainHeader.innerText = mainCont.mainHeader;
        headerDiv.appendChild(mainHeader);
        const subContentContainer = document.createElement('div');
        mainDiv.appendChild(subContentContainer);
        const deleteMainBtn = document.createElement('button');
        const addMainBtn = document.createElement('button');
        const editMainBtn = document.createElement('button');
        const upperMainButtonDiv = document.createElement('div');
        upperMainButtonDiv.className = 'rightAlign';
        const expandButton = document.createElement('button');
        if (isEditMode) {
            deleteMainBtn.innerText = 'Ta bort';
            deleteMainBtn.onclick = () => {
                content = content.filter(item => item.id !== mainCont.id);
                renderContent();
                saveContent();
            };

            addMainBtn.innerText = 'Lägg till';
            addMainBtn.className = 'rightAlign';
            addMainBtn.onclick = () => {
                const index = content.indexOf(mainCont);
                content.splice(index + 1, 0, {
                    id: getHighestMainId() + 1,
                    mainHeader: 'Placeholder',
                    subContent: [
                        {
                            id: 0,
                            subHeader: 'Placeholder',
                            text: 'Placeholder'
                        }
                    ]
                })
                
                renderContent();
                saveContent();
            };
            
            editMainBtn.innerText = 'Editera';
            editMainBtn.onclick = () => {
                const editMainDiv = document.createElement('div');
                const editHeader = document.createElement('input');
                editHeader.type = 'text';
                editHeader.value = mainCont.mainHeader;
                const saveHeaderBtn = document.createElement('button');
                saveHeaderBtn.innerText = 'Spara';
                saveHeaderBtn.onclick = () => {
                    mainCont.mainHeader = editHeader.value;
                    mainHeader.innerText = editHeader.value;
                    subContentContainer.insertBefore(mainHeader, editMainDiv);
                    subContentContainer.insertBefore(upperMainButtonDiv, editMainDiv);
                    subContentContainer.removeChild(editMainDiv);
                    saveContent();
                };

                const cancelHeaderBtn = document.createElement('button');
                cancelHeaderBtn.innerText = 'Avbryt';
                cancelHeaderBtn.onclick = () => {
                    subContentContainer.insertBefore(mainHeader, editMainDiv);
                    subContentContainer.insertBefore(upperMainButtonDiv, editMainDiv);
                    subContentContainer.removeChild(editMainDiv);
                };

                editMainDiv.appendChild(editHeader);
                editMainDiv.appendChild(saveHeaderBtn);
                editMainDiv.appendChild(cancelHeaderBtn);
                subContentContainer.insertBefore(editMainDiv, mainHeader);
                subContentContainer.removeChild(mainHeader);
                subContentContainer.removeChild(upperMainButtonDiv);
            };
            
            upperMainButtonDiv.appendChild(deleteMainBtn);
            upperMainButtonDiv.appendChild(editMainBtn);
            headerDiv.appendChild(upperMainButtonDiv);
        }

        for (const subCont of mainCont.subContent) {
            const subDiv = document.createElement('article');
            const subHeader = document.createElement('h3');
            subHeader.innerText = subCont.subHeader;
            const subText = document.createElement('p');
            subText.innerText = subCont.text;
            subDiv.appendChild(subHeader);
            subDiv.appendChild(subText);
            if (isEditMode) {
                const addSubBtn = document.createElement('button');
                addSubBtn.innerText = 'Lägg till';
                addSubBtn.onclick = () => {
                    mainCont.subContent.splice(mainCont.subContent.indexOf(subCont) + 1, 0, {
                        id: getHighestSubId(mainCont.subContent) + 1,
                        subHeader: 'Placeholder',
                        text: 'Placeholder'
                    });

                    renderContent();
                    saveContent();
                };

                const deleteSubBtn = document.createElement('button');
                deleteSubBtn.innerText = 'Ta bort';
                deleteSubBtn.onclick = () => {
                    mainCont.subContent = mainCont.subContent.filter(item => item.id !== subCont.id);
                    renderContent();
                    saveContent();
                };

                const editSubBtn = document.createElement('button');
                editSubBtn.innerText = 'Editera';
                editSubBtn.onclick = () => {
                    const subEditDiv = document.createElement('div');
                    const subEditHeader = document.createElement('input');
                    subEditHeader.type = 'Text';
                    subEditHeader.value = subCont.subHeader;
                    const subEditParagraph = document.createElement('textarea');
                    subEditParagraph.value = subCont.text;
                    const saveSubBtn = document.createElement('button');
                    saveSubBtn.innerText = 'Spara';
                    saveSubBtn.onclick = () => {
                        subCont.subHeader = subEditHeader.value;
                        subHeader.innerText = subEditHeader.value;
                        subCont.text = subEditParagraph.value;
                        subText.innerText = subEditParagraph.value;
                        subDiv.insertBefore(subHeader, subEditDiv);
                        subDiv.insertBefore(subText, subEditDiv);
                        subDiv.appendChild(addSubBtn);
                        subDiv.appendChild(deleteSubBtn);
                        subDiv.appendChild(editSubBtn);
                        subDiv.removeChild(subEditDiv);
                        saveContent();
                    };

                    const cancelSubBtn = document.createElement('button');
                    cancelSubBtn.innerText = 'Avbryt';
                    cancelSubBtn.onclick = () => {
                        subDiv.insertBefore(subHeader, subEditDiv);
                        subDiv.insertBefore(subText, subEditDiv);
                        subDiv.appendChild(addSubBtn);
                        subDiv.appendChild(deleteSubBtn);
                        subDiv.appendChild(editSubBtn);
                        subDiv.removeChild(subEditDiv);
                    };

                    subEditDiv.appendChild(subEditHeader);
                    subEditDiv.appendChild(subEditParagraph);
                    subEditDiv.appendChild(saveSubBtn);
                    subEditDiv.appendChild(cancelSubBtn);
                    subDiv.insertBefore(subEditDiv, subHeader);
                    subDiv.removeChild(subHeader);
                    subDiv.removeChild(subText);
                    subDiv.removeChild(addSubBtn);
                    subDiv.removeChild(deleteSubBtn);
                    subDiv.removeChild(editSubBtn);
                };

                subDiv.appendChild(addSubBtn);
                subDiv.appendChild(deleteSubBtn);
                subDiv.appendChild(editSubBtn);
            }

            subContentContainer.appendChild(subDiv);
        }

        if (!isEditMode){
            const icon = document.createElement('i');
            icon.classList.add('bi');
            icon.classList.add('bi-arrows-expand');
            expandButton.appendChild(icon);
            expandButton.classList.add('rightAlign');
            expandButton.classList.add('focusButton');
            subContentContainer.classList.add('hideSection');
            expandButton.onclick = () => {
                if (icon.classList.contains('bi-arrows-expand')) {
                    icon.classList.remove('bi-arrows-expand');
                    icon.classList.add('bi-arrows-collapse');
                    subContentContainer.classList.remove('hideSection');
                }
                else {
                    icon.classList.add('bi-arrows-expand');
                    icon.classList.remove('bi-arrows-collapse');
                    subContentContainer.classList.add('hideSection');
                }
            }

            headerDiv.appendChild(expandButton);
        }

        if (isEditMode){
            mainDiv.appendChild(addMainBtn);
        }

        mainContentDiv.appendChild(mainDiv);
    }
}
