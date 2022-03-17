const CHOOSE_DIV = document.getElementById('choose_div');
const HTML_GAME_TABLE = document.getElementById('game_table');
const CELLS = document.getElementsByName('cell');
const ITEMS = ['circle', 'cross'];
const CROSS = 1;
const CIRCLE = 0;
const EMPTY = -10;
const DRAW = -5;

var gameOver = false;
var chosed_item = -1;
var game_table = [
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY]
]


function choose_item(item){
    chosed_item = item;
    hide_choose_div();
    show_table();

    if(item == CIRCLE){
        bot_move(game_table);
        to_game_over(check_winner(game_table));
    }
}

function hide_choose_div(){
    CHOOSE_DIV.hidden = true;
}

function show_table(){
    HTML_GAME_TABLE.style.visibility = 'visible';
}

function fill_cell(x, y){
    if(game_table[x][y] == EMPTY){
        CELLS[x*3 + y].src = `img/${ITEMS[chosed_item]}.png`;
        game_table[x][y] = chosed_item; 
        to_game_over(check_winner(game_table));
        bot_move(game_table);
        to_game_over(check_winner(game_table));
    }
}

function bot_move(game_field){
    var moves = [];
    var best_moves = [];
    var best_move;
    var score;
    var best_score = Number.MIN_SAFE_INTEGER;

    for( var i = 0; i < game_field.length; i++){
        for (var j = 0; j < game_field.length; j++){
            if(game_field[i][j] == EMPTY){
                game_field[i][j] = chosed_item == CROSS ? CIRCLE: CROSS;
                score = minimax(game_field, 0, false);
                moves.push({y: i, x: j, score:score});
                game_field[i][j] = EMPTY;

                if(score > best_score)
                    best_score = score;
            }
        }
    }
    if (!moves.length)
        return;

    for(var i = 0; i < moves.length; i++){
        if(moves[i].score == best_score){
            best_moves.push(moves[i]);
            console.log(moves[i]);
        }
    }
    
    best_move = best_moves[Math.floor(Math.random() * best_moves.length)];
    game_field[best_move.y][best_move.x]= chosed_item == CROSS ? CIRCLE: CROSS;
    CELLS[best_move.y*3 + best_move.x].src = `img/${ITEMS[chosed_item == CIRCLE ? CROSS: CIRCLE]}.png`;  
}

function check_winner(game_table){
    var row_sum;
    var col_sum;
    var left_diag_sum = 0;
    var right_diag_sum = 0;
    var empty_cells_counter = 0;

    for(var i = 0; i < game_table.length; i++){
        row_sum = 0;
        col_sum = 0;
        for(var j = 0; j < game_table.length; j++){
            row_sum += game_table[i][j];
            col_sum += game_table[j][i];   

            if(game_table[i][j] == EMPTY)
                empty_cells_counter++;

        }

        left_diag_sum += game_table[i][i];
        right_diag_sum += game_table[i][game_table.length - 1 - i];

        if (is_win(row_sum))
            return row_sum/3;

        if (is_win(col_sum))
            return col_sum/3;
          
    }

    if (is_win(left_diag_sum))
        return left_diag_sum/3;
    
    else if (is_win(right_diag_sum))
        return right_diag_sum/3;

    else if (empty_cells_counter == 0)
        return DRAW; 

    return EMPTY;

}

function is_win(sum){
    if (sum == 0 || sum == 3)
       return true;
}

function to_game_over(winner){
    if (winner == EMPTY)
        return

    if(!gameOver){
        gameOver = true;
        let alert_str = winner == DRAW ? 'draw': `${ITEMS[winner]} win!`;
        setTimeout(() => {
            alert(alert_str);
            document.location.reload(); 
        }, 100);
    }  
}


function minimax(game_field, depth, isBotMove){
    score = get_score(game_field);

    if(score != 0)
        return score;

    var best;

    if (isBotMove){
        best = Number.MIN_SAFE_INTEGER;
        for (var i = 0; i < game_field.length; i++){
            for (var j = 0; j < game_field.length; j++){
                if (game_field[i][j] == EMPTY){
                    game_field[i][j] = chosed_item == CROSS ? CIRCLE: CROSS;
                    best = Math.max(best, minimax(game_field, depth + 1, false));
                    game_field[i][j] = EMPTY;
                }
            }
        }
    }

    else {
        best = Number.MAX_SAFE_INTEGER;
        for (var i = 0; i < game_field.length; i++){
            for (var j = 0; j < game_field.length; j++){
                if (game_field[i][j] == EMPTY){
                    game_field[i][j] = chosed_item;
                    best = Math.min(best, minimax(game_field, depth + 1, true));
                    game_field[i][j] = EMPTY;
                }
            }
        }
    }

    return best;

}


function get_score(game_field){
    winner = check_winner(game_field);

    if(winner == EMPTY)
        return 0;

    else if (winner == chosed_item)
        return -2;

    else if (winner == DRAW)
        return 1;

    else
        return 2;
}
