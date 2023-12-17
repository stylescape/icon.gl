// Copyright 2023 Scape Agency BV

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// ============================================================================
// Interface | Scroll
// ============================================================================


// Vertical Scroll Function
export function scrollSmooth(distance: number, speed: number) {
    var int = setInterval(function() {
        window.scrollTo(0, speed);
        speed += 10;
        if (speed >= distance) clearInterval(int);
    }, 20);
}

// When the user clicks on the button, scroll to the top of the document
export function buttonScrollUp() {
    button_up.addEventListener("click", function() {
        let element = document.getElementById("content_cover");
        let yOffset = 0; 
        let yDistance = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: yDistance, behavior: "smooth"});
    })
}


export function buttonScrollDown() {
    button_down.addEventListener(
        "click", function() {
            let element = document.getElementById("main");
            let yOffset = -100; 
            let yDistance = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({top: yDistance, behavior: "smooth"});
            // var speed = 10;
            // scrollSmooth(yDistance, speed)
        }
    )
}
  
// Get the buttons:
var button_up = document.getElementById("cover_arrow_up");

if (button_up !== null){
    buttonScrollUp();
}

var button_down = document.getElementById("content_cover_arrow");

if (button_down !== null){
    buttonScrollDown();
}
  

export function scrollButton() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        button_up.style.display = "block";
        } else {
            button_up.style.display = "none";
        }
}
  
// When the user scrolls down 100px from the top of the document, show the button
if (button_up   !== null) {
    window.onscroll = function() {scrollButton()};
}
  


export {};