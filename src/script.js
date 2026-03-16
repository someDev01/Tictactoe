import { ANIMATION_DURATION, GAME_MODES, STATS, WIN_COMBINATIONS } from "./config.js";

const winWindow = document.querySelector('.win-window');
const switchMode = document.querySelector('.switch-mode');
const labels = document.querySelectorAll('.switch-mode label');
const table = document.getElementById('tictactoe');
const panel = document.querySelector('.panel');
const button = document.querySelector('.button-again');

let currentPlayer = 'X';
let currentMode;
let squares = [];
let statBlocks = [];

let countWinX = 0, 
    countWin0 = 0, 
    countDraw = 0;

function createBoard() {

    initSquares();

    initStats();

    updateStats();

    switchMode.addEventListener('change', onChangeRadio);
    button.addEventListener('click', onClickAgain);
};

function initSquares(){
    for(let row = 1; row <= 9; row++){
        const square = document.createElement('div');
        square.className = 'square';
        square.textContent = '';
        square.addEventListener('click', onMakeMove);
        table.appendChild(square);
    }

    table.style.pointerEvents = 'none';
}

function initStats(){
    for(let i = 0; i < 3; i++){
        const block = document.createElement('div');
        block.className = 'block';
        block.textContent = `${STATS[i]} : 0`;
        panel.appendChild(block);

        statBlocks.push(block);
    }
}

function updateStats(){
    const stats = [
        countWinX,
        countWin0,
        countDraw
    ]
    for(let i=0;i<3;i++){
        statBlocks[i].textContent = `${STATS[i]} : ${stats[i]}`
    }
}

function clearBoard(){
    squares.forEach(square => {
        square.textContent = '';
        square.classList.remove('x-color', 'o-color', 'win');
    });
    currentPlayer = 'X';
    blockMove('auto');
}

const onChangeRadio = (e) => {
    e.preventDefault();
    console.log(e.target);
    
    if(e.target.name === 'mode'){
        if(e.target.value === GAME_MODES.PVP)
            currentMode = GAME_MODES.PVP;
        else if(e.target.value === GAME_MODES.PVC)
            currentMode = GAME_MODES.PVC;

        labels.forEach(l => l.classList.remove('active'));

        e.target.closest('label').classList.add('active');
        console.log(`Режим: ${currentMode}`);
    }
    
    clearBoard();
};

const onClickAgain = (e) => {
    e.preventDefault();
    clearBoard();
};

function onMakeMove(e){
    e.preventDefault();

    if(currentMode == undefined){
        blockMove('none')
        return;
    }

    if(e.target.textContent !== '') return;

    setValueSquare(e);
    paintSymbol(e);

    increaseSizeSquare(e);

    checkWin();
    if(table.style.pointerEvents === 'none') return;

    checkDraw();
    if(table.style.pointerEvents === 'none') return;

    changeTurn();

    if(currentMode === GAME_MODES.PVC){
        blockMove('none');

        setTimeout(() => {
            makeMoveComputer();
        }, ANIMATION_DURATION.COMPUTER_DELAY);
        
    }
}

const makeMoveComputer = () => {

    console.log("компьютер ходит...");

    const computer = currentPlayer
    console.log(`Ход компьютера: ${computer}`);
    const opponent = currentPlayer === 'X' ? 'O' : 'X';

    let move =  findWinningMove(computer);

    if(move != null){
        setSquareComputer(move);
        finishComputerTurn();
        return;
    }

    move = findWinningMove(opponent);

    if(move !== null){
        setSquareComputer(move);
        finishComputerTurn();
        return;
    }

    if(squares[4].textContent === ''){
        setSquareComputer(4);
        finishComputerTurn();
        return;
    }

    const corners = [0, 2, 6, 8].filter(i => squares[i].textContent === '');
    
    if(corners.length > 0){
        const randomCorner = Math.floor(Math.random() * corners.length);
        setSquareComputer(corners[randomCorner]);
        finishComputerTurn();
        return;
    }

    const empties = [...squares].map((sq, i) => sq.textContent === ''? i : null)
        .filter(i => i != null);
    if(empties.length > 0){
        console.log(`empties: ${empties}`);
        
        const randomIndex = Math.floor(Math.random() * empties.length);
        setSquareComputer(empties[randomIndex]);
        finishComputerTurn();
        return;
    }    
};

function changeTurn(){
    console.log(`Было: ${currentPlayer}`);
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    console.log(`Стало: ${currentPlayer}`);
    
}

function finishComputerTurn(){
    checkWin();
    if(table.style.pointerEvents === 'none') return;

    checkDraw();
    if(table.style.pointerEvents === 'none') return;

    changeTurn();
}

function setValueSquare(e){
    e.target.textContent = currentPlayer;
}

function setSquareComputer(index){
    const sq = squares[index];
    sq.textContent = currentPlayer;
    sq.classList.add(currentPlayer === 'X' ? 'x-color' : 'o-color');

    increaseSizeSquareComputer(sq);
}

function findWinningMove(pl){
    console.log(pl);
    
    for(const [a, b, c] of WIN_COMBINATIONS){
        
        const squareA = squares[a].textContent;
        
        const squareB = squares[b].textContent;

        const squareC = squares[c].textContent;

        const line = [squareA, squareB, squareC];
        
        const countSymbols = line.filter(s => s === pl).length;
        
        const countEmpty = line.filter(s => s === '').length;

        if(countSymbols === 2 && countEmpty === 1){
            if(squareA === '') return a;
            if(squareB === '') return b;
            if(squareC === '') return c;
        }
    }

    return null;
}

function paintSymbol(e){
    e.target.classList.add(currentPlayer === 'X'? 'x-color' : 'o-color');
}

function paintLine(line){
    line.forEach(l => squares[l].classList.add('win'));
}

function getVictoryLine(){
    for(const [a, b, c] of WIN_COMBINATIONS){
        if(squares[a].textContent !== '' && 
            squares[a].textContent === squares[b].textContent && 
            squares[b].textContent === squares[c].textContent) return [a, b, c]; 
    }

    return null;
}

function increaseSizeSquare(e){
    e.target.classList.add('down');
    setTimeout(() => {
        e.target.classList.remove('down');
    }, ANIMATION_DURATION.SQUARE_DOWN);
}

function increaseSizeSquareComputer(s){
    s.classList.add('down');

    setTimeout(() => {
        s.classList.remove('down');
    }, ANIMATION_DURATION.SQUARE_DOWN);
}

function showWin(message){
    winWindow.classList.add('active');
    const text = document.createElement('p');

    text.textContent = message;
    winWindow.appendChild(text)

    setTimeout(() => {
        winWindow.classList.remove('active');
        
        setTimeout(() => {
            text.textContent = '';
        }, 800)
    }, ANIMATION_DURATION.WIN_SHOW);
}

function isFilledSquares(){
    return [...squares].every(square => square.textContent !== '');
}

function checkWin(){

    const winLine = getVictoryLine();

    if(winLine){
        paintLine(winLine);

        if(currentPlayer === 'X') countWinX++;
        else countWin0++;

        updateStats();

        blockMove('none')
        setTimeout(() => {
            if(currentMode === GAME_MODES.PVC && currentPlayer === 'O') showWin('Компьютер победил');
            else showWin(`Игрок ${currentPlayer} победил`);
        }, ANIMATION_DURATION.CHECK_COMBINATIONS);

        return;
    }
    blockMove('auto');
}

function checkDraw(){
    
    const isFilled = isFilledSquares();

    if(isFilled){
        countDraw++;

        updateStats();
        
        blockMove('none');
        setTimeout(() => {
            showWin('Ничья!');
        }, ANIMATION_DURATION.CHECK_COMBINATIONS);
        return;
    }
}

function blockMove(value){
    table.style.pointerEvents = value;
}

// <--START-->
createBoard();
squares = document.querySelectorAll('.square');