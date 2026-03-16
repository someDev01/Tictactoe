
export const GAME_MODES = {
    PVP: '2',
    PVC: '1'
};

export const STATS = [
    ['Победа X'],
    ['Победа O'],
    ['Ничья']
];

export const WIN_COMBINATIONS = [
    [0, 1, 2],
    [0, 4, 8],
    [3, 4, 5],
    [6, 7, 8],
    [6, 4, 2],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8]
]

export const ANIMATION_DURATION = {
    SQUARE_DOWN: 300,
    WIN_SHOW: 2000,
    CHECK_COMBINATIONS: 500,
    COMPUTER_DELAY: 500
};