// XML DOM Obj
var xmlDOM;


// get XMLHttpReaquest
function getXMLHttp() {

    var xmlhttp = null;

    // Chrome else..
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } // explorer
    else if (window.ActiveXObject) {// IE
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    return xmlhttp;
}

// get XML DOM
function getXMLDOM(Url,Option,SearchValue) {

    var xmlhttp = getXMLHttp();
    var Async = false;

    if (Option == "TRUE") {
        Async = true;
    }

    // select option
    if (Option == "POST") {
        xmlhttp.open("POST",Url,Async);
        xmlhttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    }
    else {
        xmlhttp.open("GET",Url,Async);
    }

    xmlhttp.onreadystatechange = function () {

        if(xmlhttp.readyState == "4") {
            xmlDoc = xmlhttp.responseXML;
        }
    };

    xmlhttp.send();
    return xmlDoc;

}

// get Tempo
function getTempo(xmlDOM) {

    var dom = xmlDOM;

    if(dom.getElementsByTagName("sound").length > 0){

        var tempoDom = dom.getElementsByTagName("sound");
        var tempo = tempoDom[0].getAttribute("tempo")

        return tempo;
    }
    return 80;
}

// get Divisions -  quarter note's duration
function getDivisions(xmlDOM) {

    var dom = xmlDOM;
    var divisions = dom.getElementsByTagName("divisions");

    // var dLength = divisions.length;
    return divisions[0].childNodes[0].nodeValue;
}

// Main Function
// Url = file path location
function getMeasureInfo(Url) {

    // get XMLDOM
    xmlDOM = getXMLDOM(Url);

    var str = "";
    var noteDuration = 0;
    var division = getDivisions(xmlDOM);                // quarter's Duration Value
    var arrIndex = 0;                                   // noteArr's index
    var anotherPartCheck = 0;

    // get partDOM from XMLDOM
    var partObj = xmlDOM.getElementsByTagName("part");


    for(key in partObj){
        if(!isNaN(key)){

            var measureObj = partObj[key].getElementsByTagName("measure");

            if(anotherPartCheck == 0){

                // set NoteArr
                var noteArr = new Array(measureObj.length * 16);

                for(var a = 0; a < noteArr.length; a++) {
                    noteArr[a] = "";
                }

                anotherPartCheck ++;

            }

            arrIndex = 0;


            // get Note's Info in MeasureObj
            for(key2 in measureObj) {

                // nt's Duration Value
                var nDuration = 0;

                // is note
                if (!isNaN(key2)) {

                    var childKey = measureObj[key2].childNodes;
                    var backupCheck = 0;

                    // Processing Data

                    // note or backup
                    for (var i = 0; i < childKey.length; i++) {

                        if (childKey[i].nodeName == "note") {

                            var nt = childKey[i];           // note Obj
                            var nStep = "";                 // nt's Step Value
                            var nOtav = "";                 // nt's Octave Value
                            var nAlt =  "";                 // nt's Alter Value
                            var noteInfo = "";              // nt's Info

                            // chord Part
                            if(nt.childNodes[1].nodeName == "chord"){

                                if(nt.childNodes[3].childNodes[3].nodeName == "alter"){

                                    nStep = nt.childNodes[3].childNodes[1].childNodes[0].nodeValue;
                                    nOtav = nt.childNodes[3].childNodes[5].childNodes[0].nodeValue;
                                    nAlt = nt.childNodes[3].childNodes[3].childNodes[0].nodeValue;
                                    nDuration = nt.childNodes[5].childNodes[0].nodeValue;

                                    if(nAlt == 1){
                                        switch (nStep){
                                            case "C"    : noteInfo = "C"+nOtav+"#";break;
                                            case "D"    : noteInfo = "D"+nOtav+"#";break;
                                            case "E"    : noteInfo = "E"+nOtav;break;
                                            case "F"    : noteInfo = "F"+nOtav+"#";break;
                                            case "G"    : noteInfo = "G"+nOtav+"#";break;
                                            case "A"    : noteInfo = "A"+nOtav+"#";break;
                                            case "B"    : noteInfo = "C"+(nOtav+1);break;
                                                break;
                                        }
                                    } else{
                                        switch (nStep){
                                            case "C"    : noteInfo = "A"+(nOtav-1);break;
                                            case "D"    : noteInfo = "C"+nOtav+"#";break;
                                            case "E"    : noteInfo = "D"+nOtav+"#";break;
                                            case "F"    : noteInfo = "E"+nOtav;break;
                                            case "G"    : noteInfo = "F"+nOtav+"#";break;
                                            case "A"    : noteInfo = "G"+nOtav+"#";break;
                                            case "B"    : noteInfo = "A"+nOtav+"#";break;
                                                break;
                                        }
                                    }

                                } else if(nt.childNodes[3].childNodes[3].nodeName == "octave"){

                                    nStep = nt.childNodes[3].childNodes[1].childNodes[0].nodeValue;
                                    nOtav = nt.childNodes[3].childNodes[3].childNodes[0].nodeValue;
                                    nDuration = nt.childNodes[5].childNodes[0].nodeValue;
                                    noteInfo = nStep + nOtav + nAlt;

                                }

                                noteDuration = nDuration / division * 4;

                                for(var b = 0 ; b < noteDuration ; b++){
                                    arrIndex--;
                                }

                                // pitch Part
                            } else if(nt.childNodes[1].nodeName == "pitch"){

                                if(nt.childNodes[1].childNodes[3].nodeName == "alter"){

                                    nStep = nt.childNodes[1].childNodes[1].childNodes[0].nodeValue;
                                    nOtav = nt.childNodes[1].childNodes[5].childNodes[0].nodeValue;
                                    nAlt = nt.childNodes[1].childNodes[3].childNodes[0].nodeValue;
                                    nDuration = nt.childNodes[3].childNodes[0].nodeValue;

                                    if(nAlt == 1){
                                        switch (nStep){
                                            case "C"    : noteInfo = "C"+nOtav+"#";break;
                                            case "D"    : noteInfo = "D"+nOtav+"#";break;
                                            case "E"    : noteInfo = "F"+nOtav;break;
                                            case "F"    : noteInfo = "F"+nOtav+"#";break;
                                            case "G"    : noteInfo = "G"+nOtav+"#";break;
                                            case "A"    : noteInfo = "A"+nOtav+"#";break;
                                            case "B"    : noteInfo = "C"+(nOtav+1);break;
                                                break;
                                        }
                                    } else{
                                        switch (nStep){
                                            case "C"    : noteInfo = "B"+(nOtav-1);break;
                                            case "D"    : noteInfo = "C"+nOtav+"#";break;
                                            case "E"    : noteInfo = "D"+nOtav+"#";break;
                                            case "F"    : noteInfo = "E"+nOtav;break;
                                            case "G"    : noteInfo = "F"+nOtav+"#";break;
                                            case "A"    : noteInfo = "G"+nOtav+"#";break;
                                            case "B"    : noteInfo = "A"+nOtav+"#";break;
                                                break;
                                        }
                                    }

                                } else if(nt.childNodes[1].childNodes[3].nodeName == "octave"){

                                    nStep = nt.childNodes[1].childNodes[1].childNodes[0].nodeValue;
                                    nOtav = nt.childNodes[1].childNodes[3].childNodes[0].nodeValue;
                                    nDuration = nt.childNodes[3].childNodes[0].nodeValue;
                                    noteInfo = nStep + nOtav + nAlt;

                                }

                                // rest Part
                            } else if(nt.childNodes[1].nodeName == "rest"){

                                nDuration = nt.childNodes[3].childNodes[0].nodeValue;

                            } else {

                            }

                            noteDuration = nDuration / division * 4;

                            noteArr[arrIndex] += noteInfo;

                            for(var j = 0 ; j < noteDuration ; j++){
                                arrIndex++;
                            }

                            // backup Part
                        } else if (childKey[i].nodeName == "backup") {
                            arrIndex = arrIndex - 16;
                        }
                    } // note or backup
                } // is note
            } // get Note's Info in MeasureObj


        } // part's key
    } // get Note;s Info in partObj


    // array to string
    for(var a = 0 ; a < noteArr.length ; a++){
        str += noteArr[a]+"r";
    }

    // convert note's infomation to unicode
    //

    str = str.replace(/C3/g,"A");
    str = str.replace(/D3/g,"C");
    str = str.replace(/G3/g,"H");
    str = str.replace(/A3/g,"J");
    str = str.replace(/B3/g,"L");
    str = str.replace(/C4/g,"M");
    str = str.replace(/D4/g,"O");
    str = str.replace(/E4/g,"Q");
    str = str.replace(/F4#/g,"S");
    str = str.replace(/F4/g,"R");
    str = str.replace(/G4#/g,"U");
    str = str.replace(/G4/g,"T");
    str = str.replace(/A4#/g,"W");
    str = str.replace(/A4/g,"V");
    str = str.replace(/B4/g,"X");
    str = str.replace(/C5#/g,"Z");
    str = str.replace(/C5/g,"Y");
    str = str.replace(/D5#/g,"\\");
    str = str.replace(/D5/g,"[");
    str = str.replace(/E5/g,"]");
    str = str.replace(/F5#/g,"_");
    str = str.replace(/F5/g,"^");
    str = str.replace(/G5#/g,"a");
    str = str.replace(/G5/g,"\`");
    str = str.replace(/A5#/g,"c");
    str = str.replace(/A5/g,"b");
    str = str.replace(/B5/g,"d");
    str = str.replace(/C6/g,"e");
    str = str.replace(/D6/g,"g");
    str = str.replace(/E6/g,"i");

    // exclude note to ""
    str = str.replace(/#/g,"");
    str = str.replace(/C[\d]/g,"");
    str = str.replace(/D[\d]/g,"");
    str = str.replace(/E[\d]/g,"");
    str = str.replace(/F[\d]/g,"");
    str = str.replace(/G[\d]/g,"");
    str = str.replace(/A[\d]/g,"");
    str = str.replace(/B[\d]/g,"");

    var total_str = getTempo(xmlDOM)+";"+str;
    return reverseStringForMusicXML(total_str);
}

// String reverser
function reverseStringForMusicXML(MusicString){
    var tempo = MusicString.split(";")[0];
    var string = MusicString.split(";")[1];
    var preventReverseArray = string.split("r");
    var reveredString = [];
    var newString = "";
    var reverseStr = [];

    for(var i = 0; i < preventReverseArray.length; i++){

        reverseStr = [];

        for(var j = 0 ; j < preventReverseArray[i].length ; j++){
            reverseStr.push(preventReverseArray[i].charAt(j));
        }

        reveredString[i] = reverseStr.sort().reverse();
    }

    for(var i = 0; i < reveredString.length; i++){

        var temp = reveredString[i];
        for(var j = 0; j < temp.length; j++){
            newString += temp[j];
        }
        newString += "r";
    }

    return tempo +";"+ newString;
}
