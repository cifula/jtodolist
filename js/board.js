class boardEvent {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new boardEvent();
        }
        return this.#instance;
    }

    addEventDragItem() {
        const $ = (select) => document.querySelectorAll(select);
        const boardItems = $('.board-items');
        const boardLists = $('.board-list');

        const pastBoard = null;

        const todoArray = boardService.getInstance().todoArray;
        boardItems.forEach(boardItem => {
            boardItem.ondragstart = () => {
                boardItem.classList.add("dragflag");
                this.pastBoard = boardItem.parentElement;
            }

            boardItem.ondragend = () => {
                boardItem.classList.remove("dragflag");
            }
        })


        boardLists.forEach(boardList => {
            boardList.ondragover = e => {
                e.preventDefault();
            }

            const removeListIndex = null;
            const removeIndex = null;
            const addListIndex = null;

            boardList.ondrop = e => {
                const dragItem = document.querySelector(".dragflag");
                if(dragItem.parentElement != boardList) {
                    const pastBoardItems = this.pastBoard.querySelectorAll(".board-items")
                    
                    boardLists.forEach((List, index) => {
                        if(this.pastBoard == List) {
                            this.removeListIndex = index; 
                        }
                    })

                    boardList.appendChild(dragItem)

                    boardLists.forEach((List, index) => {
                        if(dragItem.parentElement == List) {
                            this.addListIndex = index;
                        }
                    })

                    pastBoardItems.forEach((item, index) => {
                        if(dragItem == item) {
                            this.removeIndex = index;
                        }
                    })

                    todoArray[this.addListIndex].push(todoArray[this.removeListIndex][this.removeIndex]);
                    todoArray[this.removeListIndex].splice(this.removeIndex, 1);
                    boardService.getInstance().updateLocalStorage();
                    boardService.getInstance().loadtodoListAll();
                }
            }
        })
    }

    addEventClickItem() {
        const boardItems = document.querySelectorAll(".board-items");

        boardItems.forEach((boardItem, index) => {
            boardItem.onclick = () => {
                
            }
        });
    }

    addEventDeleteTodoClick() {
        const deleteButtons = document.querySelectorAll(".delete-button")
        const boardLists = document.querySelectorAll(".board-list");
        const removeListIndex = null;
        const removeIndex = null;

        deleteButtons.forEach(deleteButton => {
            deleteButton.onclick = () => {
                boardLists.forEach((boardList, index) => {
                    if(deleteButton.parentElement.parentElement == boardList) {
                        this.removeListIndex = index;
                    }
                });

                const removeList = boardLists[this.removeListIndex].querySelectorAll(".board-items");

                removeList.forEach((item, index) => {
                    if(deleteButton.parentElement == item) {
                        this.removeIndex = index;
                    }
                })
                
                
                boardService.getInstance().todoArray[this.removeListIndex].splice(this.removeIndex, 1);
                boardService.getInstance().updateLocalStorage();
            }
        });

    }
}



class boardService {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new boardService();
        }
        return this.#instance;
    }

    todoArray = null;

    constructor() {
        if(localStorage.getItem("todoList") == null) {
            this.todoArray = [[],[],[],[]]
        } else {
            this.todoArray = JSON.parse(localStorage.getItem("todoList"));
        }
    }

    updateLocalStorage() {
        localStorage.setItem("todoList", JSON.stringify(this.todoArray));
        this.loadtodoListAll();
    }

    loadtodoListAll() {
        const boardLists = document.querySelectorAll(".board-list");

        this.todoArray.forEach(todoList => {
            todoList.sort(function compare(a, b) {
                return a.todoDate - b.todoDate;
              });
        })

        boardLists.forEach((boardList, index) => {
            boardList.innerHTML = ``;
            this.loadtodoList(boardList, index);
        });
        boardEvent.getInstance().addEventDragItem();
        boardEvent.getInstance().addEventDeleteTodoClick();
        modalEvent.getInstance().addTodoItemClick();
    }

    loadtodoList(boardList, index) {
        boardList.innerHTML = ``;
        const todoList = this.todoArray[index];


        todoList.forEach(todoObj => {
            let dateTime = null;

            if(index == 1) {
                dateTime = this.convertDateTime(todoObj.todoDate);
            } else {
                dateTime = this.convertDate(todoObj.todoDate);
            }

            boardList.innerHTML += `
                <li class="board-items" draggable="true">
                    <button class="delete-button"><i class="fa-solid fa-trash"></i></button>
                    <div class="content-header">
                        <h1 class="content-title">${todoObj.todoTitle}</h1>
                    </div>
                    <div class="content-main">
                        ${todoObj.todoContent}
                    </div>
                    <div class="content-footer">
                        <div class="content-date">${dateTime}</div>
                    </div>
                </li>
            `;
        });
    }

    findTodoListIndexByBoardItem(findItem) {
        const boardLists = document.querySelectorAll(".board-list");
        const findList = findItem.parentElement;
        let todoListIndex = null;

        boardLists.forEach((boardList, index) => {
            if(boardList == findList) {
                todoListIndex = index;
            }
        });

        return todoListIndex;
    }

    findTodoIndexByBoardItem(findItem) {
        const boardItems = findItem.parentElement.querySelectorAll(".board-items");
        let todoIndex = null;
        
        boardItems.forEach((boardItem, index) => {
            if(boardItem == findItem) {
                todoIndex = index;
            }
        });

        return todoIndex;
    }

    findTodoByBoardItem(findItem) {
        const boardIndex = this.findTodoListIndexByBoardItem(findItem);
        const todoIndex = this.findTodoIndexByBoardItem(findItem);
        return this.todoArray[boardIndex][todoIndex];
    }

    convertDateTime(dateTimeInput) {
        if(dateTimeInput == null) {
            return "";
        }

        const rawTodoDate = new Date(dateTimeInput);

        return `${rawTodoDate.getHours()}:${rawTodoDate.getMinutes()}`
    }

    convertDate(dateInput) {
        if(dateInput == null) {
            return "";
        }

        const rawTodoDate = new Date(dateInput);

        const convertDay = (day) => {
            return day == 0 ? "일" 
                : day == 1 ? "월"
                : day == 2 ? "화"
                : day == 3 ? "수"
                : day == 4 ? "목"
                : day == 5 ? "금" : "토";
        }

        return `${rawTodoDate.getFullYear()}.${rawTodoDate.getMonth() + 1}.${rawTodoDate.getDate()}(${convertDay(rawTodoDate.getDay())})`
    }
}