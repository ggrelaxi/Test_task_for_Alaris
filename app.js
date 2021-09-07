class Control {
    defaultAvailableItems = [];
    availableItemsForView = [];
    selectedItemsForView = [];
    availableItemNumber = [];
    componentContainer;
    availableSearchContainer;
    selectedSearchContainer;
    availableSearchValue = '';
    selectedSearchValue = '';
    availableItemsListContainer;
    selectedItemsListContainer;
    newItemInput;
    addNewItemButton;
    activeAvailableElementOrder = null;
    activeSelectedElementOrder = null;
    availableDragElementOrder = null;
    availableDragElementNextOrder = null;
    selectedDragElementOrder = null;
    selectedDragElementNextOrder = null;

    constructor() {
        this.initComponent();
        return this.componentContainer;
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
            name,
            visible: true,
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
        this.defaultAvailableItems.forEach((item, index) => {
            item.order = index + 1;
        })
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
        availableContainer.addEventListener('dragstart', (event) => {
            event.target.classList.add('selected')
            this.availableDragElementOrder = Number(event.target.dataset.order);
        })
        availableContainer.addEventListener('dragover', (event) => {
            event.preventDefault();
            const itemToMove = availableContainer.querySelector('.selected');
            const currentItem = event.target;
            const isMoveable = itemToMove !== currentItem && currentItem.classList.contains('item');
            if (!isMoveable) {
                return;
            };

            const nextElement = this.getNextVerticalElement(event.clientY, currentItem);

            if (nextElement && itemToMove === nextElement.previousElementSibling || itemToMove === nextElement) {
                return;
            }
            this.availableItemsListContainer.insertBefore(itemToMove, nextElement)
            const currentItems = this.availableItemsListContainer.querySelectorAll('.item')
            if (nextElement === null) {
                this.activeAvailableElementOrder = this.availableItemsForView.length;
            } else if (Number(nextElement.dataset.order) > Number(itemToMove.dataset.order)) {
                this.activeAvailableElementOrder = Number(nextElement.dataset.order) - 1;
            } else if (Number(nextElement.dataset.order) < Number(itemToMove.dataset.order)) {
                this.activeAvailableElementOrder = Number(nextElement.dataset.order);
            }
            currentItems.forEach((item, index) => {
                this.availableItemsForView[index].order = index + 1;
                this.availableItemsForView[index].name = item.querySelector('.item_header').innerText;
            })
        })
        availableContainer.addEventListener('dragend', (event) => {
            event.target.classList.remove('selected')
            if (this.availableDragElementOrder === this.availableDragElementNextOrder) {
                return;
            }
            this.availableDragElementOrder = null;
            this.availableDragElementNextOrder = null;
            this.activeSelectedElementOrder = null;

            this.renderAvailableItems(this.availableItemsListContainer)
        })

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

    generateSelectedContainer = () => {
        const selectedContainer = document.createElement('div');
        selectedContainer.classList.add('control_block');
        selectedContainer.addEventListener('dragstart', (event) => {
            event.target.classList.add('selected')
            this.selectedDragElementOrder = Number(event.target.dataset.order);
        })
        selectedContainer.addEventListener('dragover', (event) => {
            event.preventDefault();
            const itemToMove = selectedContainer.querySelector('.selected');
            const currentItem = event.target;
            const isMoveable = itemToMove !== currentItem && currentItem.classList.contains('item');

            if (!isMoveable) {
                return;
            }
            const nextElement = this.getNextVerticalElement(event.clientY, currentItem);

            if (nextElement && itemToMove === nextElement.previousElementSibling || itemToMove === nextElement) {
                return;
            }

            this.selectedItemsListContainer.insertBefore(itemToMove, nextElement);
            const currentItems = this.selectedItemsListContainer.querySelectorAll('.item');
            currentItems.forEach((item, index) => {
                this.selectedItemsForView[index].order = index + 1;
                this.selectedItemsForView[index].name = item.querySelector('.item_header').innerText;
            })
        })
        selectedContainer.addEventListener('dragend', (event) => {
            event.target.classList.remove('selected');
            if ((this.selectedDragElementOrder + 1) === this.selectedDragElementNextOrder) {
                return;
            }
            this.selectedDragElementNextOrder = null;
            this.selectedDragElementOrder = null;
            this.activeSelectedElementOrder = null;
            this.activeAvailableElementOrder = null;
            this.renderSelectedItems(this.selectedItemsListContainer);
        })

        const header = document.createElement('div');
        header.classList.add('header');
        header.innerText = 'Selected';
        selectedContainer.appendChild(header);

        const searchContainer = document.createElement('div');
        searchContainer.classList.add('search_block');
        searchContainer.innerHTML = '<i class="fa fa-search" aria-hidden="true"></i>';
        const searchBlock = document.createElement('input');
        this.selectedSearchContainer = searchBlock;
        searchBlock.placeholder = 'Search items';
        searchBlock.type = 'text';
        searchBlock.addEventListener('input', this.selectedSearchHandler)
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

    renderAvailableItems = (container) => {
        container.innerHTML = '';
        this.availableItemsForView.forEach((item) => {
            const itemBlock = document.createElement('div');
            itemBlock.addEventListener('click', (e) => this.availableItemClickHandler(e, item.order), false);
            itemBlock.addEventListener('mouseenter', (e) => {
                itemBlock.classList.add('item_hover')
            })
            itemBlock.addEventListener('mouseover', (e) => {
                itemBlock.classList.add('item_hover')
            })
            itemBlock.addEventListener('mouseout', (e) => itemBlock.classList.remove('item_hover'))
            itemBlock.classList.add('item')
            itemBlock.setAttribute('data-order', item.order)
            itemBlock.draggable = true;
            if (item.visible) {
                itemBlock.classList.remove('d-none')
            } else {
                itemBlock.classList.add('d-none')
            }

            if (item.order === this.activeAvailableElementOrder) {
                itemBlock.classList.add('active_bg')
            } else {
                itemBlock.classList.remove('active-bg');
            }
            itemBlock.innerHTML = `
                        <img src="img/item_icon.png" alt="item_icon">
                        <div class="item_header">${item.name}</div>
                `
            const deleteBlock = document.createElement('div');
            deleteBlock.classList.add('item_status');
            deleteBlock.innerText = 'Удалить'
            deleteBlock.addEventListener('click', (e) => this.deleteAvailableElementFromList(e, item.order))
            itemBlock.appendChild(deleteBlock);

            container.append(itemBlock);
        })
    }

    renderSelectedItems = (container) => {
        container.innerHTML = '';
        this.selectedItemsForView.forEach((item) => {
            const itemBlock = document.createElement('div');
            itemBlock.addEventListener('click', (e) => this.selectedItemClickHandler(e, item.order));
            itemBlock.addEventListener('mouseenter', (e) => {
                itemBlock.classList.add('item_hover')
            })
            itemBlock.addEventListener('mouseover', (e) => {
                itemBlock.classList.add('item_hover')
            })
            itemBlock.addEventListener('mouseout', (e) => itemBlock.classList.remove('item_hover'))
            itemBlock.classList.add('item')
            itemBlock.setAttribute('data-order', item.order);
            itemBlock.draggable = true;
            if (item.visible) {
                itemBlock.classList.remove('d-none')
            } else {
                itemBlock.classList.add('d-none')
            }
            if (item.order === this.activeSelectedElementOrder) {
                itemBlock.classList.add('active_bg')
            } else {
                itemBlock.classList.remove('active-bg');
            }
            itemBlock.innerHTML = `
                        <img src="img/item_icon.png" alt="item_icon">
                        <div class="item_header">${item.name}</div>
                        <div class="item_selected_status"><i class="fa fa-chevron-down" aria-hidden="true"></i></div>
                `
            container.append(itemBlock);
        })
    }

    availableItemClickHandler = (e, order) => {
        const currentOrder = this.activeAvailableElementOrder;
        if (currentOrder === order) {
            this.oneElementRightHandler(e, this.availableItemsForView, this.activeAvailableElementOrder);
            this.activeAvailableElementOrder = null;
            this.activeSelectedElementOrder = null;
        } else {
            this.activeAvailableElementOrder = order;
            this.activeSelectedElementOrder = null;
            this.renderAvailableItems(this.availableItemsListContainer);
        }
    }

    selectedItemClickHandler = (e, order) => {
        const currentOrder = this.activeSelectedElementOrder;
        if (currentOrder === order) {
            this.oneElementLeftHandler(e, this.selectedItemsForView, this.activeSelectedElementOrder);
            this.activeSelectedElementOrder = null;
            this.activeAvailableElementOrder = null;
        } else {
            this.activeSelectedElementOrder = order;
            this.activeAvailableElementOrder = null;
            this.renderSelectedItems(this.selectedItemsListContainer);
        }
    }

    deleteAvailableElementFromList = (e, order) => {
        e.stopPropagation();
        const previousAvailableList = this.availableItemsForView.slice();
        const currentAvailableList = [];
        for (let i = 0; i < previousAvailableList.length; i++) {
            if (i < order - 1) {
                currentAvailableList.push(previousAvailableList[i])
            } else if (i === order - 1) {
                continue
            } if (i > order - 1) {
                const currentAvailableItem = previousAvailableList[i]
                currentAvailableItem.order = currentAvailableItem.order - 1;
                currentAvailableList.push(currentAvailableItem)
            }
        }
        this.availableItemsForView = currentAvailableList;
        this.activeAvailableElementOrder = null;
        this.renderAvailableItems(this.availableItemsListContainer)
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
        restoreButton.addEventListener('click', this.restoreClickHandler);
        bottomButtonContainer.appendChild(restoreButton)
        const showSelectedButton = document.createElement('button');
        showSelectedButton.type = 'button';
        showSelectedButton.innerText = 'Show Selected';
        showSelectedButton.classList.add('show_button');
        showSelectedButton.addEventListener('click', this.showSelectedItems);
        bottomButtonContainer.appendChild(showSelectedButton);
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
                    button.addEventListener('click', (e) => {
                        this.oneStepUpHandler(e, this.availableItemsForView, this.activeAvailableElementOrder, 'left');
                    })
                    button.innerHTML = '<i class="fa fa-angle-up fa-2x" aria-hidden="true"></i>';
                    break;
                case 'move_to_top':
                    button.classList.add('move_to_top');
                    button.addEventListener('click', (e) => {
                        this.moveToTopHandler(e, this.availableItemsForView, this.activeAvailableElementOrder, 'left');
                    })
                    button.innerHTML = '<i class="fa fa-angle-double-up fa-2x" aria-hidden="true"></i>';
                    break;
                case 'one_step_down':
                    button.classList.add('one_step_down');
                    button.addEventListener('click', (e) => {
                        this.oneStepDownHandler(e, this.availableItemsForView, this.activeAvailableElementOrder, 'left');
                    })
                    button.innerHTML = '<i class="fa fa-angle-down fa-2x" aria-hidden="true"></i>';
                    break;
                case 'move_to_down':
                    button.classList.add('move_to_down');
                    button.addEventListener('click', (e) => {
                        this.moveToDownHandler(e, this.availableItemsForView, this.activeAvailableElementOrder, 'left');
                    })
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
                    button.addEventListener('click', (e) => {
                        this.oneElementRightHandler(e, this.availableItemsForView, this.activeAvailableElementOrder);
                    })
                    button.innerHTML = '<i class="fa fa-angle-right fa-2x" aria-hidden="true"></i>';
                    break;
                case 'move_to_right':
                    button.classList.add('move_to_right');
                    button.addEventListener('click', this.allElementsToRightMoveHandler);
                    button.innerHTML = '<i class="fa fa-angle-double-right fa-2x" aria-hidden="true"></i>';
                    break;
                case 'one_step_left':
                    button.classList.add('one_step_left');
                    button.addEventListener('click', (e) => {
                        this.oneElementLeftHandler(e, this.selectedItemsForView, this.activeSelectedElementOrder);
                    })
                    button.innerHTML = '<i class="fa fa-angle-left fa-2x" aria-hidden="true"></i>';
                    break;
                case 'move_to_left':
                    button.classList.add('move_to_left');
                    button.addEventListener('click', this.allElementsToLeftHandler);
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
                    button.addEventListener('click', (e) => {
                        this.oneStepUpHandler(e, this.selectedItemsForView, this.activeSelectedElementOrder, 'right');
                    })
                    button.innerHTML = '<i class="fa fa-angle-up fa-2x" aria-hidden="true"></i>';
                    break;
                case 'move_to_top':
                    button.classList.add('move_to_top');
                    button.addEventListener('click', (e) => {
                        this.moveToTopHandler(e, this.selectedItemsForView, this.activeSelectedElementOrder, 'right');
                    })
                    button.innerHTML = '<i class="fa fa-angle-double-up fa-2x" aria-hidden="true"></i>';
                    break;
                case 'one_step_down':
                    button.classList.add('one_step_down');
                    button.addEventListener('click', (e) => {
                        this.oneStepDownHandler(e, this.selectedItemsForView, this.activeSelectedElementOrder, 'right');
                    })
                    button.innerHTML = '<i class="fa fa-angle-down fa-2x" aria-hidden="true"></i>';
                    break;
                case 'move_to_down':
                    button.classList.add('move_to_down');
                    button.addEventListener('click', (e) => {
                        this.moveToDownHandler(e, this.selectedItemsForView, this.activeSelectedElementOrder, 'right');
                })
                    button.innerHTML = '<i class="fa fa-angle-double-down fa-2x" aria-hidden="true"></i>';
                    break;
                default:
                    break;
            }
        }
        return button;
    }

    oneStepUpHandler = (e, list, activeElementOrder, direction) => {
        if (!activeElementOrder || activeElementOrder === 1) {
            return;
        }
        const currentElement = list[activeElementOrder - 1];
        currentElement.order = activeElementOrder - 1;
        const elementAbove = list[activeElementOrder - 2];
        elementAbove.order = activeElementOrder;
        list[activeElementOrder - 2] = currentElement;
        list[activeElementOrder - 1] = elementAbove;
        if (direction === 'left') {
            this.activeAvailableElementOrder = activeElementOrder - 1;
            this.renderAvailableItems(this.availableItemsListContainer)
        } else {
            this.activeSelectedElementOrder = activeElementOrder - 1;
            this.renderSelectedItems(this.selectedItemsListContainer)
        }
    }

    moveToTopHandler = (e, list, activeElementOrder, direction) => {
        if (!activeElementOrder || activeElementOrder === 1) {
            return;
        }
        const activeElement = list[activeElementOrder - 1];
        const resultSort = [];
        for (let i = 0; i < list.length; i++) {
            if (i === 0) {
                activeElement.order = 1;
                resultSort.push(activeElement)

            } else if (i < activeElementOrder) {
                const currentItem = list[i - 1]
                currentItem.order = i + 1;
                resultSort.push(currentItem);
            } else if (i === activeElementOrder) {
                const currentItem = list[i];
                currentItem.order = activeElementOrder + 1;
                resultSort.push(currentItem);
            } else {
                const currentItem = list[i - 1];
                currentItem.order = i;
                resultSort.push(currentItem)
            }
        }
        if (direction === 'left') {
            this.activeAvailableElementOrder = 1;
            this.availableItemsForView = resultSort;
            this.renderAvailableItems(this.availableItemsListContainer);
        } else {
            this.activeSelectedElementOrder = 1;
            this.selectedItemsForView = resultSort;
            this.renderSelectedItems(this.selectedItemsListContainer);
        }

    }

    oneStepDownHandler = (e, list, activeElementOrder, direction) => {
        if (!activeElementOrder || activeElementOrder === list.length) {
            return;
        }

        const currentElement = list[activeElementOrder - 1];
        currentElement.order = activeElementOrder + 1;
        const elementBelow = list[activeElementOrder];
        elementBelow.order = activeElementOrder;
        list[activeElementOrder] = currentElement;
        list[activeElementOrder - 1] = elementBelow;

        if (direction === 'left') {
            this.activeAvailableElementOrder = activeElementOrder + 1;
            this.renderAvailableItems(this.availableItemsListContainer);
        } else {
            this.activeSelectedElementOrder = activeElementOrder + 1;
            this.renderSelectedItems(this.selectedItemsListContainer);
        }
    }

    moveToDownHandler = (e, list, activeElementOrder, direction) => {
        if (!activeElementOrder || activeElementOrder === list.length) {
            return;
        }
        const activeElement = list[activeElementOrder - 1];

        const resultSort = [];
        for (let i = 0; i < list.length; i++) {
            if (i < activeElementOrder - 1) {
                const currentItem = list[i];
                resultSort.push(currentItem);
            } else if (i >= (activeElementOrder - 1) && i < list.length - 1) {
                const currentElement = list[i + 1];
                currentElement.order = i + 1;
                resultSort.push(currentElement)
            } else {
                activeElement.order = list.length;
                resultSort.push(activeElement)
            }
        }
        if (direction === 'left') {
            this.activeAvailableElementOrder = list.length;
            this.availableItemsForView = resultSort;
            this.renderAvailableItems(this.availableItemsListContainer);
        } else {
            this.activeSelectedElementOrder = list.length;
            this.selectedItemsForView = resultSort;
            this.renderSelectedItems(this.selectedItemsListContainer);
        }
    }

    oneElementRightHandler = (e, list, activeElementOrder) => {
        if (activeElementOrder === null) {
            return;
        }
        const [currentElementToMove] = list.filter(item => item.order === activeElementOrder);
        currentElementToMove.order = this.selectedItemsForView.length + 1;
        const resultSort = [];
        for (let i = 0; i < list.length; i++) {
            if (i < activeElementOrder - 1) {
                const currentItem = list[i];
                resultSort.push(currentItem)
            } else if (i === activeElementOrder - 1) {
                this.selectedItemsForView.push(currentElementToMove);
            } else {
                const currentItem = list[i];
                currentItem.order = i;
                resultSort.push(currentItem)
            }
        }

        this.activeAvailableElementOrder = null;
        this.activeSelectedElementOrder = null;
        this.availableItemsForView = resultSort;
        this.renderAvailableItems(this.availableItemsListContainer);
        this.renderSelectedItems(this.selectedItemsListContainer);
    }

    allElementsToRightMoveHandler = () => {
        if (!this.availableItemsForView) {
            return;
        }
        const resultSort = [...this.selectedItemsForView, ...this.availableItemsForView];
        for (let i = 0; i < resultSort.length; i++) {
            resultSort[i].order = i + 1;
        }
        this.availableItemsForView = [];
        this.selectedItemsForView = resultSort;
        this.renderAvailableItems(this.availableItemsListContainer);
        this.renderSelectedItems(this.selectedItemsListContainer);
    }

    oneElementLeftHandler = (e, list, activeElementOrder) => {
        if (!activeElementOrder) {
            return;
        }
        const currentElement = this.selectedItemsForView[activeElementOrder - 1];
        currentElement.order = this.availableItemsForView.length + 1;
        this.availableItemsForView = [...this.availableItemsForView, currentElement];
        const resultSort = [];
        for (let i = 0; i < list.length - 1; i ++) {
            if (i < activeElementOrder - 1) {
                const currentItem = list[i];
                resultSort.push(currentItem);
            } else {
                const currentElement = list[i + 1];
                currentElement.order = i + 1;
                resultSort.push(currentElement)
            }
        }

        this.selectedItemsForView = resultSort;
        this.activeSelectedElementOrder = null;
        this.activeAvailableElementOrder = null;
        this.renderSelectedItems(this.selectedItemsListContainer);
        this.renderAvailableItems(this.availableItemsListContainer);
    }

    allElementsToLeftHandler = () => {
        if (!this.selectedItemsForView) {
            return;
        }

        const resultSort = [...this.availableItemsForView, ...this.selectedItemsForView]
        for (let i = 0; i < resultSort.length; i++) {
            resultSort[i].order = i + 1;
        }
        this.availableItemsForView = resultSort;
        this.selectedItemsForView = [];
        this.renderAvailableItems(this.availableItemsListContainer);
        this.renderSelectedItems(this.selectedItemsListContainer);
    }

    availableSearchHandler = (e) => {
        const searchValue = e.target.value;
        this.availableSearchValue = searchValue;
        this.availableItemsForView.forEach((item) => {
          item.visible = item.name.includes(searchValue);
        })
        this.renderAvailableItems(this.availableItemsListContainer)
    }

    selectedSearchHandler = (e) => {
        const searchValue = e.target.value;
        this.selectedSearchValue = searchValue;
        this.selectedItemsForView.forEach((item) => {
            item.visible = item.name.includes(searchValue);
        })
        this.renderSelectedItems(this.selectedItemsListContainer);
    }

    addNewItemInputHandler = (e) => {
        const currentNameValue = e.target.value;
        if (currentNameValue) {
            this.addNewItemButton.disabled = false;
        }
    }

    addNewItemAddButtonHandler = () => {
        const newItemName = this.newItemInput.value;
        const newItem = {
            name: newItemName,
            visible: this.availableSearchValue === '' ? true : newItemName.includes(this.availableSearchValue),
            order: this.availableItemsForView.length + 1,
        };
        this.availableItemsForView = [...this.availableItemsForView, newItem];
        this.newItemInput.value = '';
        this.addNewItemButton.disabled = true;
        this.renderAvailableItems(this.availableItemsListContainer);
    }

    restoreClickHandler = () => {
        this.availableItemsForView = this.defaultAvailableItems;
        this.selectedItemsForView = [];
        this.renderAvailableItems(this.availableItemsListContainer);
        this.renderSelectedItems(this.selectedItemsListContainer);
    }

    showSelectedItems = () => {
        if (!this.selectedItemsForView.length) {
            alert('No items selected');
        } else {
            const resultList = this.selectedItemsForView.map((item, index) => `${index+1}) ${item.name}`).join('\n')
            alert(`Selected items:\n${resultList}`);
        }
    }

    getRandomValue = () => {
        return Math.floor(Math.random() * (20 - 1) ) + 1;
    }

    getNextVerticalElement = (cursorPosition, currentItem) => {
        const currentItemCoords = currentItem.getBoundingClientRect();
        const currentItemCenter = currentItemCoords.y + currentItemCoords.height / 2;
        const nextElement = (cursorPosition < currentItemCenter) ?
            currentItem : currentItem.nextElementSibling;
        return nextElement;
    }
}

const controlInstance = new Control();

const initApp = () => {
    const rootContainer = document.getElementById('app');
    const controls = [];
    controls.push(controlInstance);

    const addControlInstanceButton = document.createElement('button');
    addControlInstanceButton.setAttribute('id', 'add_new_control');
    addControlInstanceButton.innerText = 'Add new Control Instance';
    addControlInstanceButton.addEventListener('click', () => {
        const newControl = new Control(addControlInstanceButton);
        controls.push(newControl);
        renderControl(addControlInstanceButton);
    })
    rootContainer.appendChild(addControlInstanceButton);

    window.addEventListener("load", () => {
        renderControl(rootContainer);
    })

    const renderControl = () => {
        const controlsCount = controls.length;
        controls.forEach((control, index) => {
            if (index === controlsCount - 1) {
                document.getElementById('add_new_control').before(control)
            }
        })
    }
}

initApp();
