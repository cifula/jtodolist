window.onload = () => {
    boardService.getInstance().loadtodoListAll();
    boardEvent.getInstance().addEventDragItem();    
    modalEvent.getInstance().addEventAddTodoClick();
}