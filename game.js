// adding event handlers to draggable elements
document.querySelectorAll('.ball').forEach(elem => {
    elem.addEventListener('dragstart', dragStart);
    elem.addEventListener('dragend', dragEnd);
})

// helper object for storing game score
let score = {
  left: 0,
  right: 0
};

// stores left & right goal coordinates
let goals = {
  left: document.getElementById('left-goal').getBoundingClientRect(),
  right: document.getElementById('right-goal').getBoundingClientRect()
};

function dragStart(e) {
  let ball = document.getElementById(e.target.id);
  if (ball.classList.contains('isNotDraggable')) {
    e.preventDefault();
  }

  // stores mouse shift after grip of the draggable element
  let shift = {
    left: e.clientX - ball.getBoundingClientRect().left,
    top: e.clientY - ball.getBoundingClientRect().top,
    id: e.target.id
  }

  //sets the drag data on drag object
  e.dataTransfer.setData('text/plain', JSON.stringify(shift));
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();

  let data, draggableId, draggableElem, draggableCoords, targetElem, side, goal;

  data = JSON.parse(e.dataTransfer.getData('text/plain'));

  draggableId = data.id;

  draggableElem = document.getElementById(draggableId);

  document.body.appendChild(draggableElem);

  draggableElem.style.left = e.pageX - data.left + 'px';
  draggableElem.style.top = e.pageY - data.top + 'px';

  draggableCoords = draggableElem.getBoundingClientRect();

  targetElem = e.target.closest('.goal');

  if (!targetElem) {
    return;
  }

  side = targetElem.getAttribute('data-target');

  goal = goals[side];

  if (isInsideGoal(draggableCoords, goal)) {
    let clone;

    //creates clone of the draggable element for displaying in score results column
    clone = createClone(draggableElem);

    draggableElem.classList.add('isNotDraggable');

    if (side === 'left') {
      score[side]++;

      updateScore(side, score[side]);

      document.getElementById('left-ball-icons').appendChild(clone);
    }

    if (side === 'right') {
      score[side]++;

      updateScore(side, score[side]);

      document.getElementById('right-ball-icons').appendChild(clone);
    }
  }
}

function dragEnd(e) {
  //clears drag data on drag object
  e.dataTransfer = {};
}

//******** HELPER FUNCTIONS *********

function isInsideGoal(elem, goal) {
  return (elem.left > goal.left)
    && (elem.top > goal.top)
    && (elem.right < goal.right)
    && (elem.bottom < goal.bottom);
}

function createClone(elem) {
  let clone = document.createElement('div');
  clone.textContent = elem.textContent;
  clone.style.cssText = getComputedStyle(elem).cssText;
  clone.style.position = 'static';

  return clone;
}

function updateScore(goalDirection, score) {
  document.getElementById(`${goalDirection}-score`).innerHTML = score;
}