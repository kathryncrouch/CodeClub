var drawHouse = (function() {
    
// add body of house to svg element
    function buildHouse(group) {
        group.append("rect")
            .style("fill", "#ff9966")
            .attr("x", 200)
            .attr("y", 300)
            .attr("width", 500)
            .attr("height", 500);
    }

//create a circle for smoke
    function smokeCircle (group, x, y) {
        group.append("circle")
            .style("fill", "#c2c2d6")
            .attr("r", 10)
            .attr("cx", x)
            .attr("cy", y)
            //overwrite stroke attribute for svg element
            .style("stroke", "none");
    }

//add roof group and elements
    function raiseRoof(group) {

    //group for roof
        var roof = group.append("g")
            .attr("transform", "translate(150, 50)")

    //add overlapping circles for smokw
        smokeCircle(roof, 425, 15);
        smokeCircle(roof, 430, 13);
        smokeCircle(roof, 422, 14);
        smokeCircle(roof, 425, 11);
        smokeCircle(roof, 432, 9);
        smokeCircle(roof, 430, 7);
        smokeCircle(roof, 434, 7);
        smokeCircle(roof, 436, 5);
        smokeCircle(roof, 438, 7);
        smokeCircle(roof, 440, 9);
        smokeCircle(roof, 442, 5);

        smokeCircle(roof, 465, 9);
        smokeCircle(roof, 468, 7);
        smokeCircle(roof, 466, 5);

    //add chimney pot
        roof.append("rect")
            .style("fill", "#800000")
            .attr("height", 100)
            .attr("width", 50)
            .attr("x", 400) 
            .attr("y", 50);
       
    //add chimney stack
        roof.append("rect")
            .style("fill", "#ff9966")
            .attr("height", 40)
            .attr("width", 70)
            .attr("x", 390)
            .attr("y", 20)
            .attr("rx", 10)
            .attr("ry", 10);

//add roof (over chimney stack to hide stroke
        roof.append("polygon")
            .style("fill", "#800000")
            .attr("points", "0,300 600,300 300,0");
    }

//group and elements for door
    function addDoor(group) {
    //group for door
        var door = group.append("g")
            .attr("transform", "translate(325, 700)");
    //door
        door.append("rect")
            .style("fill", "#006600")
            .attr("width", 50)
            .attr("height", 100)
            .attr("rx", 10)
            .attr("ry", 10);
    //door handle
        door.append("circle")
            .style("fill", "#ffcc00")
            .attr("cx", 45)
            .attr("cy", 50)
            .attr("r", 5);
    }
    
//function to create a single window
    function window (group) {
        group.append("rect")
            .style("fill", "#ffcc00")
            .attr("width", 100)
            .attr("height", 100)
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .attr("rx", 10)
            .attr("ry", 10);
        group.append("rect")
            .style("fill", "#ffffff")
            .attr("width", 10)
            .attr("height", 100)
            .attr("x", 45)
            .style("stroke", "black")
            .style("stroke-width", "1px");
        group.append("rect")
            .style("fill", "#ffffff")
            .attr("height", 10)
            .attr("width", 100)
            .attr("y", 45)
            .style("stroke", "black")
            .style("stroke-width", "1px");
    }

//add all windows
    function addWindows(group) {
        window(group.append("g")
            .attr("transform", "translate(250, 450)"));
        window(group.append("g")
            .attr("transform", "translate(550, 400)"));
        window(group.append("g")
            .attr("transform", "translate(500, 600)"));
    }

    return {

        render: function(placement, options) {
            
            /*placement is div to add svg element to.  This line removes anything else from that div*/
            d3.select(placement).html("");    
    
            /*add an svg element to the div and create a group.  Default styling*/
            var svg = d3.select(placement).append("svg").attr(options).append("g")
                .style("stroke", "black")
                .style("stroke-width", "1px");

            //house
            buildHouse(svg)

            //roof
            raiseRoof(svg);

            //door
            addDoor(svg);

            //windows
            addWindows(svg);
        }
    }
            
})()



