class modalEvent {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new modalEvent();
        }
        return this.#instance;
    }
    
    addEventAddTodoClick() {
        const modalContainer = document.querySelector(".modal-container");
        const menuItems = document.querySelectorAll(".menu-items");

        menuItems[2].onclick = () => {
            modalService.getInstance().loadAddTodoModal(modalContainer);
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
        const modalContainer = document.querySelector(".modal-container");
        const cancelButton = document.querySelector(".cancel-button");

        cancelButton.onclick = () => {
            modalService.getInstance().closeAddTodoModal(modalContainer);
        }
    }

    addEventSaveButtonClick() {
        const modalContainer = document.querySelector(".modal-container");
        const saveButton = document.querySelector(".save-button");
        const boardLists = document.querySelectorAll(".board-list");
        const modalInputs = [...document.querySelectorAll(".input")];

        saveButton.onclick = () => {
            const todoObj = {
                todoTitle: modalInputs[0].value,
                todoContent:modalInputs[1].value,
                todoDate:modalInputs[2].value
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
            modalService.getInstance().closeAddTodoModal(modalContainer);
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

    loadAddTodoModal(modalContainer) {
        modalContainer.classList.remove("hidden-menu");
        modalContainer.innerHTML=``

        modalContainer.innerHTML +=`
            <div class="modal-section">
                <div class="modal-header">
                    <div class="input-container">
                        <input class="modal-title modal-input input" placeholder="please enter todo...">
                        <div class="input-buttons">
                            <button type="button" class="check-button"><i class="fa-solid fa-check"></i></button>
                            <button type="button" class="x-button"><i class="fa-sharp fa-solid fa-xmark"></i></button>
                        </div>
                    </div>
                 </div>
                <div class="modal-main">
                    <h2>Description</h2>
                    <div class="input-container">
                        <textarea class="modal-description modal-input input" placeholder="Add a description"></textarea>
                        <div class="input-buttons">
                            <button type="button" class="check-button"><i class="fa-solid fa-check"></i></button>
                            <button type="button" class="x-button"><i class="fa-sharp fa-solid fa-xmark"></i></button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="modal-datetime">
                        <input class="datetime-input input" type="datetime-local">
                    </div>
                    <div class="modal-buttons">
                        <button type="button" class="save-button">Save</button>
                        <button type="button" class="cancel-button">Cancel</button>
                    </div>
                </div>
            </div>
            `
            modalEvent.getInstance().addEventInputFocus();
            modalEvent.getInstance().addEventCancelButtonClick()
            modalEvent.getInstance().addEventSaveButtonClick()
    }
    

    closeAddTodoModal(modalContainer) {
        modalContainer.classList.add("hidden-menu");
    }
}

class testClass {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new testClass();
        }
        return this.#instance;
    }

    // testEvent() {
    //     const menuItems = document.querySelectorAll(".menu-items");
    //     const boardLists = document.querySelectorAll(".board-list");
        
    //     menuItems[2].onclick = () => {
    //         const todoObj = {
    //             todoTitle: "TITLE",
    //             todoContent:"main content1",
    //             todoDate:"2023-03-20"
    //         }

    //         boardLists[0].innerHTML += `
    //         <li class="board-items" draggable="true">
    //         <button class="delete-button"><i class="fa-solid fa-trash"></i></button>
    //         <div class="content-header">
    //             <h1 class="content-title">${todoObj.todoTitle}</h1>
    //             </div>
    //             <div class="content-main">
    //             ${todoObj.todoContent}
    //             </div>
    //             <div class="content-footer">
    //             <div class="content-date">${todoObj.todoDate}</div>
    //             </div>
    //             </li>
    //         `

    //         boardService.getInstance().todoArray[0].push(todoObj);
    //         boardService.getInstance().updateLocalStorage();
    //         boardEvent.getInstance().addEventDeleteTodoClick();
    //         boardEvent.getInstance().addEventDragItem();
    //     }
    // }

}
