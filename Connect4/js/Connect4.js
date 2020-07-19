var programCode = function(processingInstance) {
  with (processingInstance) {
    size(600, 600); 
    frameRate(30);
    
    // constant variables
    var bottom_banner_height = 70;
    var NUM_COLS = 7;
    var NUM_ROWS = 7;
    var winning_seq_length = 4;

    //space between slots
    var grid_spacing = (height - bottom_banner_height) / (NUM_ROWS * 2);

    // [red, yellow]
    var COLORS = [color(252, 200, 10), color(245, 10, 45)];

    // slots array  
    // var slots = [];

    //editable variables
    var playerTurn = 0;
    var current_page = "CoverPage";
    var game_won = false;
    var game_drawn = false;
    var num_slots_filled = 0;
    var lastFilledSlot = [];

    // number of filled slots per column
    var filledSlots = [NUM_COLS-1];
    //2d array for slots
    var slots_2d_array = [];

    //properties of Slot
    var Slot = function(x, y, i, j) {
        this.x = x;
        this.y = y;
        this.color = "";
        this.isEmpty = true;
        this.radius = (height - bottom_banner_height)/(NUM_ROWS * 1.1);
        this.colNumber = i;
        this.rowNumber = j;

    };

    //member function of slot. returns color.
    Slot.prototype.getColor = function() {
        return this.color;
    };

    //member function of slot. shows how to draw slot.
    Slot.prototype.draw = function() {
        if(this.empty()){
            fill(250, 245, 250);
        } else{
            fill(this.color);
        }

        stroke(0, 0, 0);
        strokeWeight(2);
        ellipse(this.x, this.y, this.radius, this.radius);

        fill(139, 139, 158);
        if(this.isLowestOpenSlotInCol() === true){
            noStroke();
            ellipse(this.x , this.y , 10, 10); 
        }
    };

    //If the tile is empty, return true
    Slot.prototype.empty = function() {

        return this.isEmpty;
    };

    //checks if it is the lowest open slot in colomn
    Slot.prototype.isLowestOpenSlotInCol = function() {
        return(NUM_ROWS - 1 - this.rowNumber === filledSlots[this.colNumber]);
    };


    var get_seq_length_in_direction = function(col_num, row_num, col_dir, row_dir){
        var same_color = true;
        var seq_length = 1;
        var seq_color = slots_2d_array[col_num][row_num].getColor();

        while(same_color && col_num + col_dir*seq_length >= 0  &&  row_num + row_dir*seq_length < NUM_ROWS && col_num + col_dir*seq_length < NUM_COLS && row_num + row_dir*seq_length >=0)
        {
            if( slots_2d_array[col_num + col_dir*seq_length][row_num + row_dir*seq_length].getColor() === seq_color) {
                seq_length++;
            }
            else
            {
                same_color = false;
            }
        }
    //    println( seq_length );
        return seq_length;
    };

    var resetGame = function(){
        playerTurn = 0;
        game_won = false;
        game_drawn = false;
        num_slots_filled = 0;
        lastFilledSlot = [];
        for(var i = 0; i < NUM_COLS;i++){
            for(var j = 0; j < NUM_ROWS; j++){
                slots_2d_array[i][j].color = "";
                slots_2d_array[i][j].isEmpty = true;
            }
        }
        for(var i = 0; i < NUM_COLS ; i++){
            filledSlots[i] = 0;
        } 
    };

    //checks if a player has won


    // member function of Slot called when slot is clicked
    Slot.prototype.onClick = function() {
        num_slots_filled++;
        var slotFilled = false;
        //check if coin can fall in this slot
        if(this.empty() && this.isLowestOpenSlotInCol() ) {
    //    println(lastFilledSlot);
        slotFilled = true;

        lastFilledSlot = [this.colNumber , this.rowNumber];


        // Put the player's color on the slot
        this.color = COLORS[playerTurn];
        this.isEmpty = false;

        // Change the turn
        playerTurn++;

        // reset playerTurn
        if (playerTurn >= COLORS.length) {
             playerTurn = 0;
        }
        // update number of filled slots in this column
        filledSlots[this.colNumber]++;
        }
        return slotFilled;


    };

    var check_win = function() {
    // given last filled slot
        var lfs_col = lastFilledSlot[0];
        var lfs_row = lastFilledSlot[1];

    //check for a draw
        if(num_slots_filled === 49 && check_win === false){
            println("draw");  
            game_drawn = true;
        }

        // check in south direction
    if( get_seq_length_in_direction(lfs_col, lfs_row, 0, 1) >= winning_seq_length )
        {
            game_won = true;
        }

    // check in east-west direction

    if( get_seq_length_in_direction(lfs_col, lfs_row, 1, 0) + get_seq_length_in_direction(lfs_col, lfs_row, -1, 0) - 1 >= winning_seq_length )
        {
            game_won = true;
        }

     // check in northwest-southeast direction
    if(get_seq_length_in_direction(lfs_col, lfs_row, -1, -1) + get_seq_length_in_direction(lfs_col, lfs_row, 1, 1)- 1 >= winning_seq_length )
        {
            game_won = true;
        }

     // check in northeast-southwest direction
    if( get_seq_length_in_direction(lfs_col, lfs_row, 1, -1) + get_seq_length_in_direction(lfs_col, lfs_row, -1, 1) - 1 >= winning_seq_length )
        {
            game_won = true;
        }
    };

    //member function of SLot responds to mouse-click; checks if click is inside this slot. if so, then calls On-Click to react
    Slot.prototype.handleMouseClick = function(a, b) {
        var slotFilled = false;
        if ( a >= this.x - 20 && a <= this.x + 20    &&
           b >= this.y - 20 && b <= this.y  + 20 )
        {
            slotFilled = this.onClick();
        }
        return slotFilled;
    };


    // initializes filledSlots in every column to ZERO
    // called once initially
    for(var i = 0 ; i < NUM_COLS ; i++) {
        filledSlots[i] = 0;
    }

    //create all slots
    // called once initially
    for (var i = 0 ; i < NUM_COLS ; i++) {
        slots_2d_array.push( [] );

        for (var j = 0 ; j < NUM_ROWS ; j++){
            slots_2d_array[i].push(new Slot( (2*i + 1)*grid_spacing +  bottom_banner_height/2, (2*j + 1)*grid_spacing + bottom_banner_height/2, i, j));
        }
    }

    // draws game board by drawing each slot

    var drawGameBoard = function() {
        background(55, 26, 217);
        for (var i = 0 ; i < NUM_COLS ; i++) {
            for (var j = 0 ; j < NUM_ROWS ; j++){
                slots_2d_array[i][j].draw();
            }
        }
        //buttons
        fill(0);
        rect(69 , 370 , 125 , 25 , 5);
        fill(255 , 255 , 255);
        text("Home" , 99 , 391);
        fill(0);
        rect(211 , 370 , 125 , 25 , 5);
        fill(255 , 255 , 255);
        text("Restart" , 234 , 391);
    };

    // draws cover page

    var drawCoverPage = function() {
        background(131, 190, 242);
        fill(43, 255, 0);
        textSize(80);
        text("Connect" , 20 , 90); 
        fill(214, 47, 47);
        text("4" , 326 , 90);
        fill(148, 80, 143);
        rect(34 , 280 , 150 , 30 , 5);
        rect(221 , 280 , 150 , 30 , 5);
        textSize(25);
        fill(245, 245, 245);
        text("Play", 85 , 304);
        text("How", 269 , 304);

    };

    //draws how page

    var drawHowPage = function() {
        background(230, 28, 28);
        fill(217, 224, 27);
        textSize(50);
        text("How To Play" , 61, 55);
        textSize(20);
        text("Connect 4 is a 2 player game. Each " , 40 , 114);
        text("player is assigned a color(red or yellow)." , 24 , 144);
        text("The aim of the game is to get 4 of your " , 24 , 174);   
         text("colored coins in a row. They can be placed " , 12 , 201);
         text("horizontally , vertically , and diagonally. " , 28 , 227);
         text("Whoever gets 4 in a row first, wins." , 43 , 253);
         fill(139, 209, 227);
         rect (120, 300 , 150 , 30);
         fill(90, 38, 158);
         text("Home" , 166 , 323);
    };

    //decides what happens when mouse is released
    //sets the current page
    //makes buttons
    mouseReleased = function() {
        if( current_page === "GameBoard" ){
            var newSlotFilled = false;
            for (var i = 0 ; i < NUM_COLS ; i++) {
                for (var j = 0 ; j < NUM_ROWS ; j++){
                    var ans = slots_2d_array[i][j].handleMouseClick(mouseX, mouseY);
                    if (ans)
                    {
                        newSlotFilled = true;
                    }
                }
            }
            if(newSlotFilled){
                check_win();
            }

            if(mouseX >= 69 && mouseX <= 194 && mouseY >= 370 && mouseY <= 395 ) {
                current_page = "CoverPage";
            }


            if(mouseX >= 211 && mouseX <= 336 && mouseY >= 370 && mouseY <= 395 ) {
                    current_page = "GameBoard";
                    resetGame();
                }
                return;
            }

        if(mouseX >= 34 && mouseX <= 184 && mouseY >= 280 &&     mouseY <= 310 && current_page === "CoverPage" ) {
           current_page = "GameBoard"; 
           resetGame();
           return;
        }
        if(mouseX >= 221 && mouseX <= 371 && mouseY >= 280 &&     mouseY <= 310 && current_page === "CoverPage" ) {
           current_page = "HowPage"; 
           return;
        }
        if(mouseX >= 120 && mouseX <= 270 && mouseY >= 300 &&     mouseY <= 330 && current_page === "HowPage" ) {
           current_page = "CoverPage";
           return;
        }

    };

    //called repeatedly
    //decides which page to draw
    draw = function() {  
        if(current_page === "CoverPage"){
            drawCoverPage();
        }

        if(current_page === "HowPage"){
            drawHowPage();
        }

        if(current_page === "GameBoard"){
            drawGameBoard();
        }

        if (current_page === "GameBoard" && game_won === true)
        {
            fill(250 , 250 , 250);
            textSize(20);
            text("Congratulations!!" , 130 , 30);
        }

    };
//    ellipse(400,400,200,200);

   }};
  // Get the canvas that ProcessingJS will use
  var canvas = document.getElementById("mycanvas"); 
  // Pass the function to ProcessingJS constructor
  var processingInstance = new Processing(canvas, programCode); 
      
