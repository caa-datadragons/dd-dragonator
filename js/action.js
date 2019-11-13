var obj;
var split;
var FJS;
var statusListGUI = [];
var legaltypeListGUI = [];
var typeListGUI = [];
var groupListGUI = [];
var languageListGUI = [];
var qualityListGUI = [];

// get single elements in array
let remDoub = (arr) => {
    var temp = new Array();
    arr.sort();
    for (i = 0; i < arr.length; i++) {
        if (arr[i] == arr[i + 1]) {
            continue
        }
        temp[temp.length] = arr[i];
    }
    return temp;
}

// get data from server
let setData = (response) => {
    console.log("call", "setData");
    try {
        response = JSON.parse(response);
    } catch (e) {}
    obj = response;
    console.log(obj);
    for (var i = 0; i < obj.length; i++) {
        statusListGUI.push(obj[i].status);
        legaltypeListGUI.push(obj[i].legaltype);
        typeListGUI.push(obj[i].type);
        groupListGUI.push(obj[i].group);
        languageListGUI.push(obj[i].language);
        qualityListGUI.push(obj[i].quality);
    }
    // fill Filter GUI values
    statusListGUI = remDoub(statusListGUI);
    for (var i = 0; i < statusListGUI.length; i++) {
        var string = "<div class='checkbox'><label><input type='checkbox' value='" + statusListGUI[i] + "' id='status_criteria-" + i + "'><span>" + statusListGUI[i] + "</span></label></div>";
        $(string).appendTo("#status_criteria");
    }
    legaltypeListGUI = remDoub(legaltypeListGUI);
    for (var i = 0; i < legaltypeListGUI.length; i++) {
        var string = "<div class='checkbox'><label><input type='checkbox' value='" + legaltypeListGUI[i] + "' id='legaltype_criteria-" + i + "'><span>" + legaltypeListGUI[i] + "</span></label></div>";
        $(string).appendTo("#legaltype_criteria");
    }
    typeListGUI = remDoub(typeListGUI);
    for (var i = 0; i < typeListGUI.length; i++) {
        var string = "<div class='checkbox'><label><input type='checkbox' value='" + typeListGUI[i] + "' id='type_criteria-" + i + "'><span>" + typeListGUI[i] + "</span></label></div>";
        $(string).appendTo("#type_criteria");
    }
    groupListGUI = remDoub(groupListGUI);
    for (var i = 0; i < groupListGUI.length; i++) {
        var string = "<div class='checkbox'><label><input type='checkbox' value='" + groupListGUI[i] + "' id='group_criteria-" + i + "'><span>" + groupListGUI[i] + "</span></label></div>";
        $(string).appendTo("#group_criteria");
    }
    languageListGUI = remDoub(languageListGUI);
    for (var i = 0; i < languageListGUI.length; i++) {
        var string = "<div class='checkbox'><label><input type='checkbox' value='" + languageListGUI[i] + "' id='language_criteria-" + i + "'><span>" + languageListGUI[i] + "</span></label></div>";
        $(string).appendTo("#language_criteria");
    }
    qualityListGUI = remDoub(qualityListGUI);
    for (var i = 0; i < qualityListGUI.length; i++) {
        var string = "<div class='checkbox'><label><input type='checkbox' value='" + qualityListGUI[i] + "' id='quality_criteria-" + i + "'><span>" + qualityListGUI[i] + "</span></label></div>";
        $(string).appendTo("#quality_criteria");
    }
    // show number of elements
    $('#total_data').text(obj.length);
    console.log(obj.length);
    // init
    initFiltersHTML();
};

function initFiltersHTML() {
    $('#status_criteria :checkbox').prop('checked', false);
    $('#legaltype_criteria :checkbox').prop('checked', false);
    $('#type_criteria :checkbox').prop('checked', false);
    $('#group_criteria :checkbox').prop('checked', false);
    $('#language_criteria :checkbox').prop('checked', false);
    $('#quality_criteria :checkbox').prop('checked', false);
    initFilters();
}

function initFilters() {
    FJS = FilterJS(obj, '#data', {
        template: '#main_template',
        criterias: [{
            field: 'status',
            ele: '#status_criteria input:checkbox'
        }, {
            field: 'legaltype',
            ele: '#legaltype_criteria input:checkbox'
        }, {
            field: 'type',
            ele: '#type_criteria input:checkbox'
        }, {
            field: 'group',
            ele: '#group_criteria input:checkbox'
        }, {
            field: 'language',
            ele: '#language_criteria input:checkbox'
        }, {
            field: 'quality',
            ele: '#quality_criteria input:checkbox'
        }],
        search: {
            ele: '#searchbox'
        },
        callbacks: {
            afterFilter: function(result, jQ) {
                //console.log(result);
                $('#total_data').text(result.length);
            }
        }
    });
    window.FJS = FJS;
    // init filters
}

var highlight = function(id, opt) {
    var thumbnails = document.getElementsByClassName("thumbnail");
    for (var i = 0; i < thumbnails.length; i++) {
        if (id === thumbnails[i].id) {
            $(thumbnails[i]).addClass("active");
        } else {
            $(thumbnails[i]).removeClass("active");
        }
    }
}

var resethighlight = function() {
    var thumbnails = document.getElementsByClassName("thumbnail");
    for (var i = 0; i < thumbnails.length; i++) {
        $(thumbnails[i]).removeClass("active");
    }
}

$(document).ready(function() {
    let q = "SELECT DISTINCT * WHERE { ?s a rset:DataDragonLair. ?s rset:dateOfEntry ?date. ?s rset:wikidataid ?id.  ?s rset:name ?name. ?s rset:description ?description. ?s rset:author ?creator. ?s rset:lairState ?state. ?s rset:hasLegalType ?legaltype. ?s rset:hasType ?type.  ?s rset:hasQuality ?quality.  OPTIONAL { ?s rset:sparqlendpoint ?sparql.  } OPTIONAL { ?s rset:apiendpoint ?api. } OPTIONAL { ?s rset:prefix ?prefix.  } OPTIONAL { ?s rset:lairGroup ?group . } OPTIONAL { ?s rset:language ?language . } OPTIONAL { ?s rset:link ?link. } } ORDER BY ASC(?name)";
    TS.query(q, setData);
});
