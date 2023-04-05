class modalEvent {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new modalEvent();
        }
        return this.#instance;
    }
    
    addEventAddTodoClick() {
        const menuItems = document.querySelectorAll(".menu-items");
        const modalFlag = "add"

        menuItems[2].onclick = () => {
            modalService.getInstance().loadTodoModal(modalFlag);
            modalEvent.getInstance().addEventInputFocus();
            modalEvent.getInstance().addEventCancelButtonClick()
            modalEvent.getInstance().addEventSaveButtonClick()
        }
    }

    addEventInputFocus() {
        const modalInputs = document.querySelectorAll(".modal-input");

        modalInputs.forEach((modalInput) => {
            const inputButtons = modalInput.parentElement.querySelector(".input-buttons")
            const buttons = [...inputButtons.getElementsByTagName("button")]

            modalInput.onfocus = () => {
                inputButtons.style.display = 'block';
            }

            modalInput.onblur = () => {   
                inputButtons.style.display = 'none';
            }
        })
    }

    addEventCancelButtonClick() {
        const cancelButton = document.querySelector(".cancel-button");

        cancelButton.onclick = () => {
            modalService.getInstance().closeAddTodoModal();
        }
    }

    addEventSaveButtonClick() {
        const saveButton = document.querySelector(".save-button");
        const boardLists = document.querySelectorAll(".board-list");
        const modalInputs = [...document.querySelectorAll(".input")];
        

        
        saveButton.onclick = () => {
            const todoObj = {
                todoTitle: modalInputs[0].value,
                todoContent:modalInputs[1].value,
                todoDate: modalInputs[2].value
            }

            boardLists[0].innerHTML += `
                <li class="board-items" draggable="true">
                    <button class="delete-button"><i class="fa-solid fa-trash"></i></button>
                    <div class="content-header">
                        <h1 class="content-title">${todoObj.todoTitle}</h1>
                    </div>
                    <div class="content-main">
                        ${todoObj.todoContent}
                    </div>
                    <div class="content-footer">
                        <div class="content-date">${todoObj.todoDate}</div>
                    </div>
                </li>
                `
                
            boardService.getInstance().todoArray[0].push(todoObj);
            boardEvent.getInstance().addEventDeleteTodoClick();
            boardEvent.getInstance().addEventDragItem();
            modalService.getInstance().closeAddTodoModal();
            boardService.getInstance().updateLocalStorage();
        }
    }

    
    addTodoItemClick() {
        const boardItems = document.querySelectorAll(".board-items");
        const modalFlag = "modify"

        boardItems.forEach(boardItem => {
            boardItem.onclick = () => {
                const todoObj = boardService.getInstance().findTodoByBoardItem(boardItem);
                modalService.getInstance().loadTodoModal(modalFlag, todoObj);
                modalEvent.getInstance().addEventInputFocus();
                modalEvent.getInstance().addEventCancelButtonClick()
                modalEvent.getInstance().addEventUpdateButtonClick(boardItem);
            }
        })
    }

    addEventUpdateButtonClick(boardItem) {
        const updateButton = document.querySelector(".update-button");
        const modalInputs = [...document.querySelectorAll(".input")];
        const todoArray = boardService.getInstance().todoArray;

        updateButton.onclick = () => {
            const todoObj = {
                todoTitle: modalInputs[0].value,
                todoContent:modalInputs[1].value,
                todoDate: modalInputs[2].value
            }

            const modifyListIndex = boardService.getInstance().findTodoListIndexByBoardItem(boardItem);
            const modifyTodoIndex = boardService.getInstance().findTodoIndexByBoardItem(boardItem);

            todoArray[modifyListIndex].splice(modifyTodoIndex, 1, todoObj);

            modalService.getInstance().closeAddTodoModal();
            boardService.getInstance().updateLocalStorage();
        }
    }
}


class modalService {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new modalService();
        }
        return this.#instance;
    }

    loadTodoModal(modalFlag, todoObj) {
        const modalContainer = document.querySelector(".modal-container");
        let buttonClass = null;
        let buttonContent = null;

        if(modalFlag == "add") {
            todoObj = {
                todoTitle: "",
                todoContent:"",
                todoDate:""
            }

            buttonClass = "save-button"
            buttonContent = "Save"
        } else if(modalFlag == "modify") {
            buttonClass = "update-button"
            buttonContent = "Update"
        }

        modalContainer.classList.remove("hidden-menu");
        modalContainer.innerHTML=``

        modalContainer.innerHTML +=`
            <div class="modal-section">
                <div class="modal-header">
                    <div class="input-container">
                        <input class="modal-title modal-input input" placeholder="please enter todo..." value=${todoObj.todoTitle}>
                        <div class="input-buttons">
                            <button type="button" class="check-button"><i class="fa-solid fa-check"></i></button>
                            <button type="button" class="x-button"><i class="fa-sharp fa-solid fa-xmark"></i></button>
                        </div>
                    </div>
                 </div>
                <div class="modal-main">
                    <h2>Description</h2>
                    <div class="input-container">
                        <textarea class="modal-description modal-input input" placeholder="Add a description">${todoObj.todoContent}</textarea>
                        <div class="input-buttons">
                            <button type="button" class="check-button"><i class="fa-solid fa-check"></i></button>
                            <button type="button" class="x-button"><i class="fa-sharp fa-solid fa-xmark"></i></button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="modal-datetime">
                        <input class="datetime-input input" type="datetime-local" value=${todoObj.todoDate}>
                    </div>
                    <div class="modal-buttons">
                        <button type="button" class="${buttonClass}">${buttonContent}</button>
                        <button type="button" class="cancel-button">Cancel</button>
                    </div>
                </div>
            </div>
            `

    }
    
    closeAddTodoModal() {
        const modalContainer = document.querySelector(".modal-container");
        modalContainer.classList.add("hidden-menu");
    }
}
