var programCode = function(processingInstance) {
  with (processingInstance) {
    size(600, 600); 
    frameRate(30);
    
    ellipse(250,250,200,200)

   }};
  // Get the canvas that ProcessingJS will use
  var canvas = document.getElementById("mycanvas"); 
  // Pass the function to ProcessingJS constructor
  var processingInstance = new Processing(canvas, programCode); 
      
