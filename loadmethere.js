/**
 *  _                    _  __  __     _______  _
 * | |                  | ||  \/  |   |__   __|| |
 * | |  ___    __ _   __| || \  / |  ___ | |   | |__    ___  _ __  ___
 * | | / _ \  / _` | / _` || |\/| | / _ \| |   | '_ \  / _ \| '__|/ _ \
 * | || (_) || (_| || (_| || |  | ||  __/| |   | | | ||  __/| |  |  __/
 * |_| \___/  \__,_| \__,_||_|  |_| \___||_|   |_| |_| \___||_|   \___|
 *
 * @source: https://github.com/WebDevels-de/loadmethere
 *
 * @licstart  The following is the entire license notice for the
 *  JavaScript code in this page.
 *
 * Copyright (C) 2019  Fatih Gürsu, WebDevels (https://webdevels.de)
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */

/**
 * loadMeThere main function
 *
 * This function will do the main work.
 * Gets a requestURL by Ajax and paste the answer in (before,prepend,append,after,as) of targetContainer.
 * @param {string} requestURL the url (resource) which should be loaded [required]
 * @param {string} targetContainer the target (ID where it should be loaded in [required]
 * @param {string} position where show (related to target): before; prepend; in; append; after; as (default: in)
 * @param {bool} scrollToTarget should the browser scroll to the target id (default: false)
 * @param {mixed} disableCustomElement disable element(s) by id/class while loading: string(id/class inlcuding "#" or ".") // bool: false to disable this function; no effect on true (default: false)
 * @param {bool} disableAnyLMT disable all loadMeThere buttons, links, ... while loading: true=disable buttons; false=leave enabled (default: false)
 * @param {int} animationTime how long should the animation take? (default: 350)
 * @param {int} scrollToTargetOffset negative distance on scrollToTarget in pixel (default: 0)
 */
function loadMeThere(requestURL, targetContainer, position, scrollToTarget, disableCustomElement, disableAnyLMT, animationTime=350, scrollToTargetOffset=0) {
    // set possible positions
    var availablePositions = ['before', 'prepend', 'in', 'append', 'after', 'as'];

    /**
     * first check if delivered params are ok or we need to exit
     */
    if(requestURL == undefined) {
        console.error("Missing: URL");
        return false;
    }
    if(targetContainer == undefined) {
        console.error("Missing: targetContainer");
        return false;
    }
    if(position == undefined || availablePositions.includes(position) == false) {
        position = 'in';
    }
    if(scrollToTarget == undefined) {
        scrollToTarget = false;
    }
    if(disableAnyLMT == undefined) {
        disableAnyLMT = false;
    }
    if(disableCustomElement == undefined) {
        disableCustomElement = false;
    }
    if(animationTime == undefined) {
        animationTime = 350;
    }
    if(scrollToTargetOffset == undefined) {
        scrollToTargetOffset = 0;
    }

    /**
     * This is hardcoded because it will be added to every requestURL you try to get with a loadMeThere element.
     * What's it for? In some cases your reqeustURL needs to know if a request is coming over Ajax or it is a
     * normal/default browser call. I used this GET var in PHP to decide if I need to stuff on loaded with Ajax
     * vs. loaded normal.
     *
     * You can add more params if you needed like: "&target="+target
     * Just remember that it will be added to every loadMeThere call.
     */
    var additionalParam = "ajaxload=true";

    /**
     * we always need to add a additional param to GET
     * so we need to know if the given url has already a "?" sign
     * if yes, we use & as additional next param on url
     * if not, we add ? to the url
     */
    var delimiterSign;
    if(requestURL.indexOf("?") > 0) {
        delimiterSign = "&";
    } else {
        delimiterSign = "?";
    }
    var loadURL = requestURL + delimiterSign + additionalParam;

    /**
     * if disableAnyLMT is set to true, we'll now disable them and set an opacity as effect
     */
    if(disableAnyLMT == true) {
        $(".loadmethere").css({"pointer-events":"none", "opacity":"0.25"});
    }

    /**
     * if disableCustomElement is set, we do the same to the given id/class
     */
    if(disableCustomElement != false) {
        $(disableCustomElement).css({"pointer-events":"none", "opacity":"0.25"});
    }

    /**
     * magic beginns here...
     */
    var jqxhr = jQuery.get(loadURL, function() {
        if($("#"+targetContainer).length ) {
            if(position == "in") {
                $("#"+targetContainer).slideUp(animationTime, function() {
                    $("#"+targetContainer).html(jqxhr.responseText).slideDown(animationTime, function() {
                        if(scrollToTarget == true) {
                            $("html, body").animate({scrollTop:$("#"+targetContainer).offset().top-scrollToTargetOffset}, "fast");
                        }
                    });
                });

            } else if(position == "as") {
                if(scrollToTarget == true) {
                    $("html, body").animate({scrollTop:$("#"+targetContainer).offset().top-scrollToTargetOffset}, "fast");
                }

                $("#"+targetContainer).parent().addClass("toDo-HideMe");
                $(".toDo-HideMe").slideUp(animationTime, function() {
                    $("#"+targetContainer).replaceWith(jqxhr.responseText);
                });
                $(".toDo-HideMe").slideDown(animationTime, function() {
                    $("body").removeClass("toDo-HideMe");
                });

            } else if(position == "before") {
                if(scrollToTarget == true) {
                    $("html, body").animate({scrollTop:$("#"+targetContainer).offset().top-scrollToTargetOffset}, "fast");
                }
                $(jqxhr.responseText).hide().insertBefore("#"+targetContainer).slideDown(animationTime, function() {
                });

            } else if(position == "prepend") {
                $(jqxhr.responseText).hide().prependTo("#"+targetContainer).slideDown(animationTime, function() {
                    if(scrollToTarget == true) {
                        $("html, body").animate({scrollTop:$("#"+targetContainer).offset().top-scrollToTargetOffset}, "fast");
                    }
                });

            } else if(position == "append") {
                var height = $("#"+targetContainer).get(0).scrollHeight;
                $(jqxhr.responseText).hide().appendTo("#"+targetContainer).slideDown(animationTime, function() {
                    if(scrollToTarget == true) {
                        $("html, body").animate({scrollTop:$("#"+targetContainer).offset().top+height-scrollToTargetOffset}, "fast");
                    }
                });

            } else if(position == "after") {
                $(jqxhr.responseText).hide().insertAfter("#"+targetContainer).slideDown(animationTime, function() {
                    var height = $("#"+targetContainer).get(0).scrollHeight;
                    if(scrollToTarget == true) {
                        $("html, body").animate({scrollTop:$("#"+targetContainer).offset().top+height-scrollToTargetOffset}, "fast");
                    }
                });

            }
        } else {
            console.log("Unable to find target with ID: "+targetContainer);
            return false;
        }
    })
    .fail(function() {
        /**
         * If we couldn't load the URL, an alert will be shown.
         */
        alert("Error "+jqxhr.status+" "+jqxhr.statusText+"\nFailed to load: \n"+getURL);

    })
    .always(function() {
        // enable every LMT again
        if(disableAnyLMT == true) {
            $(".loadmethere").css({"pointer-events":"auto", "opacity":"1"});
        }

        // enable any disabled custom element
        if(disableCustomElement != false) {
            $(disableCustomElement).css({"pointer-events":"auto", "opacity":"1"});
        }

    });
}

/**
 * BONUS FUNCTIONS
 * You don't need them to run loadMeThere() - but you might want to use them too.
 */

/**
 * emptyTarget
 *
 * Animates the target container (slideUp) then empty its content and
 * finally show the target container again (slideDown).
 *
 * @param {string} targetContainer the target id where the content should be deleted [required]
 * @param {int} animationTime how long should the animation take? (default: 350)
 */
function emptyTarget(targetContainer, animationTime=350) {
    if(targetContainer == undefined) {
        console.error("Missing: targetContainer");
        return false;
    }
    if(animationTime == undefined) {
        animationTime = 350;
    }

    $("#"+targetContainer).slideUp(animationTime, function() {
        $("#"+targetContainer).empty();
        $("#"+targetContainer).slideDown(animationTime);
    });
}

/**
 * deleteTarget
 *
 * Animates the target container (slideUp) then removes it.
 *
 * @param {string} target the target id of the element to be deleted [required]
 * @param {int} animationTime how long should the animation take? (default: 350)
 */
function deleteTarget(targetContainer, animationTime = 350) {
    if(targetContainer == undefined) {
        console.error("Missing: targetContainer");
        return false;
    }
    if(animationTime == undefined) {
        animationTime = 350;
    }

    $("#"+targetContainer).slideUp(animationTime, function() {
        $("#"+targetContainer).replaceWith("");
    });
}

/**
 * Create some listeners
 * if an element with class "loadmethere" is clicked: start loadMeThere
 * if an element with class "emptytarget" is clicked: empty the targets content
 * if an element wirh class "deletetarget" is clicked: remove the target completely
 */
$(function() {
    $(document)
    .on("click", ".loadmethere", function (e) {
        e.preventDefault();

        var htmlURL                 = $(this).attr("href");                             // a href=""
        var dataURL                 = $(this).attr("data-href");                        // data-href=""
        var target                  = $(this).attr("data-target");                      // id of where it should be loaded
        var position                = $(this).attr("data-position");                    // in, as, before, prepend, append, after
        var scrollToTarget          = $(this).attr("data-scrollto-target");            // scroll to target
        var disableAnyLMT           = $(this).attr("data-disable-lmt");                 // true, false (string - will be converted to bool)
        var disableCustomElement    = $(this).attr("data-disable-element");             // false (or empty) or string for element id ("#mydiv") or class (".myclass")
        var animationTime           = parseInt($(this).attr("data-animation-time"));    // time in ms for slide up/down animation
        var scrollToTargetOffset    = $(this).attr("data-scrollto-offset");             // negative distance in pixel for scrolling

        if(htmlURL == undefined) {
            htmlURL = false;
        }
        if(dataURL == undefined) {
            dataURL = false;
        }
        if(htmlURL == false && dataURL == false) {
            console.log("LMT: missing URL in href and/or data-href");
            return false;
        }
        if(target == undefined) {
            console.log("LMT: missing target");
            return false;
        }
        if(position == undefined) {
            position = "in";
        }
        if(scrollToTarget == undefined) {
            scrollToTarget = false
        } else {
            if(scrollToTarget == 'true') {
                // convert from string to bool
                scrollToTarget = true;
            } else {
                scrollToTarget = false;
            }
        }
        if(disableAnyLMT == undefined) {
            disableAnyLMT = true;
        } else {
            if(disableAnyLMT == 'true') {
                // convert from string to bool
                disableAnyLMT = true;
            } else {
                disableAnyLMT = false;
            }
        }
        if(disableCustomElement == undefined) {
            disableCustomElement = false;
        }
        if(animationTime == undefined) {
            animationTime = 350;
        }
        if(scrollToTargetOffset == undefined) {
            scrollToTargetOffset = 50;
        }

        if(htmlURL != false && dataURL == false) {              // only href is given: push
            history.pushState({}, "", htmlURL);
            loadMeThere(htmlURL, target, position, scrollToTarget, disableCustomElement, disableAnyLMT, animationTime, scrollToTargetOffset);
        } else if(htmlURL == false && dataURL != false) {       // only data-href given: no push
            loadMeThere(dataURL, target, position, scrollToTarget, disableCustomElement, disableAnyLMT, animationTime, scrollToTargetOffset);
        } else if(htmlURL != false && dataURL != false) {       // href and data-href given: load data-href and push href
            history.pushState({}, "", htmlURL);
            loadMeThere(dataURL, target, position, scrollToTarget, disableCustomElement, disableAnyLMT, animationTime, scrollToTargetOffset);
        } else {
            console.log("LMT: something went wrong...");
            return false;
        }

    })
    .on("click", ".emptytarget", function (e) {
        e.preventDefault();

        var target              = $(this).attr("data-target");          // id of where it should be loaded
        var animationTime       = $(this).attr("data-animation-time");  // time in ms for slide up/down animation

        if(target == undefined) {
            console.log("LMT: missing target");
            return false;
        }
        if(animationTime == undefined) {
            animationTime = 350;
        }

        emptyTarget(target, animationTime);

    })
    .on("click", ".deletetarget", function (e) {
        e.preventDefault();

        var target              = $(this).attr("data-target");          // id of where it should be loaded
        var animationTime       = $(this).attr("data-animation-time");  // time in ms for slide up/down animation

        if(target == undefined) {
            console.log("LMT: missing target");
            return false;
        }
        if(animationTime == undefined) {
            animationTime = 350;
        }

        deleteTarget(target, animationTime);

    });
});