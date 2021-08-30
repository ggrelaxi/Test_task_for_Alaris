class Control {
    defaultAvailableItems = [];
    availableItemsForView = [];
    tempAvailableItems = [];
    selected = [];
    availableItemNumber = [];
    componentContainer;
    availableSearchContainer;
    availableItemsListContainer;
    selectedSearchContainer;
    selectedItemsListContainer;
    newItemInput;
    addNewItemButton;

    constructor() {
        this.defaultAvailableItems = [];
        this.selected = [];
        this.initComponent();
        this.mount();
    }

    initComponent = () => {
        this.generateItems();
        this.componentContainer = document.createElement('div');
        this.componentContainer.classList.add('control_container');
        this.generateLeftButtons();
        this.generateAvailableContainer();
        this.generateCenterButtons();
        this.generateSelectedContainer();
        this.generateRightButtons();
        this.generateBottomButtons();
    }

    generateItem = () => {
        let getName = false;
        let name = '';

        while (!getName) {
            let nameNumber = this.getRandomValue();
            if (!this.availableItemNumber.includes(nameNumber)) {
                this.availableItemNumber.push(nameNumber)
                name = `item ${nameNumber}`;
                getName = true;
            }
        }
        return {
            name
        }
    }

    generateItems = () => {
        let items = [];
        const itemsCount = this.getRandomValue();
        for (let i = 0; i < itemsCount; i++) {
            let item = this.generateItem();
            items.push(item);
        }
        // Сортируем стартовые массив элементов по возрастанию номера в имени
        this.defaultAvailableItems = items.sort((current, next) => {
            const currentNumber = Number(current.name.split(' ')[1]);
            const nextNumber = Number(next.name.split(' ')[1]);
            return currentNumber - nextNumber;
        });
        this.availableItemsForView = this.defaultAvailableItems;
    }

    generateLeftButtons = () => {
        const leftButtonContainer = document.createElement('div');
        leftButtonContainer.classList.add('control_buttons');

        const oneStepToTopButton = this.initButton('left', 'one_step_up');
        const moveToTopButton = this.initButton('left', 'move_to_top')
        const oneStepToDownButton = this.initButton('left', 'one_step_down');
        const moveToBottomButton = this.initButton('left', 'move_to_down');

        leftButtonContainer.appendChild(oneStepToTopButton)
        leftButtonContainer.appendChild(moveToTopButton)
        leftButtonContainer.appendChild(oneStepToDownButton)
        leftButtonContainer.appendChild(moveToBottomButton)

        this.componentContainer.appendChild(leftButtonContainer)
    }

    generateCenterButtons = () => {
        const centerButtonContainer = document.createElement('div');
        centerButtonContainer.classList.add('control_buttons');

        const oneStepToRightButton = this.initButton('center', 'one_step_right');
        const moveToRightButton = this.initButton('center', 'move_to_right')
        const oneStepToLeftButton = this.initButton('center', 'one_step_left');
        const moveToLeftButton = this.initButton('center', 'move_to_left');

        centerButtonContainer.appendChild(oneStepToRightButton)
        centerButtonContainer.appendChild(moveToRightButton)
        centerButtonContainer.appendChild(oneStepToLeftButton)
        centerButtonContainer.appendChild(moveToLeftButton)

        this.componentContainer.appendChild(centerButtonContainer)
    }

    generateRightButtons = () => {
        const rightButtonContainer = document.createElement('div');
        rightButtonContainer.classList.add('control_buttons');

        const oneStepToRightButton = this.initButton('right', 'one_step_up');
        const moveToRightButton = this.initButton('right', 'move_to_top')
        const oneStepToLeftButton = this.initButton('right', 'one_step_down');
        const moveToLeftButton = this.initButton('right', 'move_to_down');

        rightButtonContainer.appendChild(oneStepToRightButton)
        rightButtonContainer.appendChild(moveToRightButton)
        rightButtonContainer.appendChild(oneStepToLeftButton)
        rightButtonContainer.appendChild(moveToLeftButton)

        this.componentContainer.appendChild(rightButtonContainer)
    }

    generateAvailableContainer = () => {
        const availableContainer = document.createElement('div');
        availableContainer.classList.add('control_block');

        const header = document.createElement('div');
        header.classList.add('header');
        header.innerText = 'Available';
        availableContainer.appendChild(header)

        const searchContainer = document.createElement('div');
        searchContainer.classList.add('search_block');
        searchContainer.innerHTML = '<i class="fa fa-search" aria-hidden="true"></i>';
        const searchBlock = document.createElement('input');
        this.availableSearchContainer = searchBlock;
        searchBlock.placeholder = 'Search items';
        searchBlock.type = 'text';
        searchBlock.addEventListener('input', this.availableSearchHandler);
        searchContainer.appendChild(searchBlock);
        availableContainer.appendChild(searchContainer)

        const itemsList = document.createElement('div');
        itemsList.classList.add('items_list')
        itemsList.id = 'available_items_list';
        this.availableItemsListContainer = itemsList;
        this.renderAvailableItems(itemsList)
        availableContainer.appendChild(itemsList)

        this.componentContainer.appendChild(availableContainer)
    }

    renderAvailableItems = (container) => {
        container.innerHTML = '';
        this.tempAvailableItems = this.availableItemsForView.slice();
        this.tempAvailableItems.forEach((item) => {
            const itemBlock = document.createElement('div');
            itemBlock.classList.add('item')
            itemBlock.innerHTML = `
                        <img src="img/item_icon.png" alt="item_icon">
                        <div class="item_header">${item.name}</div>
                        <div class="item_status">Доступен</div>
                `
            container.append(itemBlock);
        })
    }

    generateSelectedContainer = () => {
        const selectedContainer = document.createElement('div');
        selectedContainer.classList.add('control_block');

        const header = document.createElement('div');
        header.classList.add('header');
        header.innerText = 'Selected';
        selectedContainer.appendChild(header);

        const searchContainer = document.createElement('div');
        searchContainer.classList.add('search_block');
        searchContainer.innerHTML = '<i class="fa fa-search" aria-hidden="true"></i>';
        const searchBlock = document.createElement('input');
        searchBlock.placeholder = 'Search items';
        searchBlock.type = 'text';
        searchContainer.appendChild(searchBlock);
        selectedContainer.appendChild(searchContainer);

        const itemsList = document.createElement('div');
        itemsList.classList.add('items_list')
        itemsList.id = 'selected_items_list';
        this.selectedItemsListContainer = itemsList;
        this.renderSelectedItems(itemsList)
        selectedContainer.appendChild(itemsList)

        this.componentContainer.appendChild(selectedContainer)
    }

    renderSelectedItems = (container) => {
        this.selected.forEach((item) => {
            const itemBlock = document.createElement('div');
            itemBlock.classList.add('item')
            itemBlock.innerHTML = `
                        <img src="img/item_icon.png" alt="item_icon">
                        <div class="item_header">${item.name}</div>
                        <div class="item_status">Доступен</div>
                `
            container.append(itemBlock);
        })
    }

    generateBottomButtons = () => {
        const bottomButtonContainer = document.createElement('div');
        bottomButtonContainer.classList.add('bottom_buttons_container');

        bottomButtonContainer.innerHTML = '<div class="bottom_buttons_container_header">Add new item in available list</div>';
        const newItemInput = document.createElement('input')
        newItemInput.placeholder = 'Item name';
        newItemInput.type = 'text';
        newItemInput.addEventListener('input', this.addNewItemInputHandler);
        this.newItemInput = newItemInput;
        bottomButtonContainer.appendChild(newItemInput);
        const addItemButton = document.createElement('button');
        addItemButton.innerText = 'ADD';
        addItemButton.type = 'button';
        addItemButton.classList.add('add_button');
        addItemButton.disabled = true;
        addItemButton.addEventListener('click', this.addNewItemAddButtonHandler);
        this.addNewItemButton = addItemButton;
        bottomButtonContainer.appendChild(addItemButton);
        const restoreButton = document.createElement('button');
        restoreButton.type = 'button'
        restoreButton.innerText = 'Restore to default';
        restoreButton.classList.add('restore_button');
        bottomButtonContainer.appendChild(restoreButton)
        const sendItemsButton = document.createElement('button');
        sendItemsButton.type = 'button';
        sendItemsButton.innerText = 'Send selected items';
        sendItemsButton.classList.add('send_button');
        bottomButtonContainer.appendChild(sendItemsButton);

        this.componentContainer.appendChild(bottomButtonContainer)
    }


    initButton = (position, direction) => {
        let button = document.createElement('button');
        button.type = 'button'
        if (position === 'left') {
            switch (direction) {
                case 'one_step_up':
                    button.classList.add('one_step_up');
                    button.innerHTML = '<i class="fa fa-angle-up fa-2x" aria-hidden="true"></i>';
                    break;
                case 'move_to_top':
                    button.classList.add('move_to_top');
                    button.innerHTML = '<i class="fa fa-angle-double-up fa-2x" aria-hidden="true"></i>';
                    break;
                case 'one_step_down':
                    button.classList.add('one_step_down');
                    button.innerHTML = '<i class="fa fa-angle-down fa-2x" aria-hidden="true"></i>';
                    break;
                case 'move_to_down':
                    button.classList.add('move_to_down');
                    button.innerHTML = '<i class="fa fa-angle-double-down fa-2x" aria-hidden="true"></i>';
                    break;
                default:
                    break;
            }
        }

        if (position === 'center') {
            switch (direction) {
                case 'one_step_right':
                    button.classList.add('one_step_right');
                    button.innerHTML = '<i class="fa fa-angle-right fa-2x" aria-hidden="true"></i>';
                    break;
                case 'move_to_right':
                    button.classList.add('move_to_right');
                    button.innerHTML = '<i class="fa fa-angle-double-right fa-2x" aria-hidden="true"></i>';
                    break;
                case 'one_step_left':
                    button.classList.add('one_step_left');
                    button.innerHTML = '<i class="fa fa-angle-left fa-2x" aria-hidden="true"></i>';
                    break;
                case 'move_to_left':
                    button.classList.add('move_to_left');
                    button.innerHTML = '<i class="fa fa-angle-double-left fa-2x" aria-hidden="true"></i>';
                    break;
                default:
                    break;
            }
        }

        if (position === 'right') {
            switch (direction) {
                case 'one_step_up':
                    button.classList.add('one_step_up');
                    button.innerHTML = '<i class="fa fa-angle-up fa-2x" aria-hidden="true"></i>';
                    break;
                case 'move_to_top':
                    button.classList.add('move_to_top');
                    button.innerHTML = '<i class="fa fa-angle-double-up fa-2x" aria-hidden="true"></i>';
                    break;
                case 'one_step_down':
                    button.classList.add('one_step_down');
                    button.innerHTML = '<i class="fa fa-angle-down fa-2x" aria-hidden="true"></i>';
                    break;
                case 'move_to_down':
                    button.classList.add('move_to_down');
                    button.innerHTML = '<i class="fa fa-angle-double-down fa-2x" aria-hidden="true"></i>';
                    break;
                default:
                    break;
            }
        }
        return button;
    }

    availableSearchHandler = (e) => {
        const searchValue = e.target.value;
        this.availableItemsForView = this.availableItemsForView.filter((item) => item.name.includes(searchValue));
        this.renderAvailableItems(this.availableItemsListContainer)
    }

    addNewItemInputHandler = (e) => {
        const currentNameValue = e.target.value;
        if (currentNameValue) {
            this.addNewItemButton.disabled = false;
        }
    }

    addNewItemAddButtonHandler = () => {
        const newItemName = this.newItemInput.value;
        const newItem = { name: newItemName };
        const currentItems = this.availableItemsForView.slice();
        this.availableItemsForView = [...currentItems, newItem];
        console.log(this.availableItemsForView)
        this.newItemInput.value = '';
        this.renderAvailableItems(this.availableItemsListContainer);
    }

    mount = () => {
        const rootContainer = document.getElementById('app');
        rootContainer.appendChild(this.componentContainer);
    }

    getRandomValue = () => {
        return Math.floor(Math.random() * (20 - 1) ) + 1;
    }
}

const controlInstance = new Control();

const initApp = () => {
    window.addEventListener("load", () => {
        controlInstance.mount();
    })
}

initApp();
