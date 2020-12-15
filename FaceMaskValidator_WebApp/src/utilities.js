// Define our labelmap
const labelMap = {
    // 1:{name:'Masked', color:'black'}
    1:{name:'person_with_mask', color:'green'},
    2:{name:'person_without_mask', color:'red'}
}

// Define a drawing function
export const drawRect = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx, changeErrorMessage)=>{
    let frameCount = 0;
    let timeBegin = Date.now();
    for(let i=0; i<=boxes.length; i++){
        
        if(boxes[i] && classes[i] && scores[i]>threshold){
            // Extract variables
            const [y,x,height,width] = boxes[i]
            const text = classes[i]
            
            if(classes[i] === 2) {
                changeErrorMessage("Person without mask detected!");
            } else {
                changeErrorMessage("");
            }
            
            // Set styling
            ctx.strokeStyle = labelMap[text]['color']
            ctx.lineWidth = 10
            ctx.fillStyle = 'blue'
            ctx.font = '30px Arial'         
            
            // DRAW!!
            ctx.beginPath()
            ctx.fillText(labelMap[text]['name'] + ' - ' + Math.round(scores[i]*100)/100, x*imgWidth, y*imgHeight-10)
            ctx.rect(x*imgWidth, y*imgHeight, width*imgWidth/2, height*imgHeight/1.5);
            ctx.stroke()
        }
        frameCount++;
    }
    let timeEnd = Date.now();
    
// Do your operations

    let fps = frameCount/(timeEnd - timeBegin);
    // console.log("fps", fps);
}