let TS = {};

TS.SPARQLQUERY = "http://sandbox.mainzed.org/squirrels/sparql";

TS.PREFIXES =
    "PREFIX hsq: <http://hungry.squirrel.link/ontology#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX wd: <http://www.wikidata.org/entity/> PREFIX lair: <http://lod.squirrel.link/data/dragonlair/>";

TS.query = (sparql, callback) => {
    setTimeout(function() {
        console.log(sparql);
        $.ajax({
            type: 'GET',
            //async: false,
            url: TS.SPARQLQUERY,
            dataType: 'jsonp',
            data: {
                queryLn: 'SPARQL',
                query: TS.PREFIXES + sparql,
                Accept: 'application/json'
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error(errorThrown);
            },
            success: function(response) {
                try {
                    response = JSON.parse(response);
                } catch (e) {}
                var vars = response.head.vars;
                var bindings = response.results.bindings;
                const bindings_copy = Object.assign({}, bindings);
                let arrItems = [];
                for (var item in bindings) {
                    arrItems.push(bindings[item]['date'].value);
                }
                arrItems = remDoub(arrItems);
                console.log(arrItems);
                let arr = [];
                console.log(bindings);
                for (var d in arrItems) {
                    let obj = [];
                    let arrLinks = [];
                    for (var item in bindings) {
                        if (bindings[item]['date'].value.includes(arrItems[d])) {
                            obj.status = bindings[item]['state'].value.replace("http://hungry.squirrel.link/ontology#", "");
                            obj.name = bindings[item]['name'].value.replace("http://hungry.squirrel.link/ontology#", "");
                            obj.description = bindings[item]['description'].value.replace("http://hungry.squirrel.link/ontology#", "");
                            obj.date = bindings[item]['date'].value.replace("http://hungry.squirrel.link/ontology#", "");
                            obj.creator = bindings[item]['creator'].value.replace("http://hungry.squirrel.link/ontology#", "");
                            obj.legaltype = bindings[item]['legaltype'].value.replace("http://hungry.squirrel.link/ontology#", "");
                            obj.type = bindings[item]['type'].value.replace("http://hungry.squirrel.link/ontology#", "");
                            obj.quality = bindings[item]['quality'].value.replace("http://hungry.squirrel.link/ontology#", "");
                            if (typeof bindings[item]['sparql'] !== 'undefined') {
                                obj.sparql = bindings[item]['sparql'].value.replace("http://hungry.squirrel.link/ontology#", "");
                            } else {
                                obj.sparql = "";
                            }
                            if (typeof bindings[item]['api'] !== 'undefined') {
                                obj.api = bindings[item]['api'].value.replace("http://hungry.squirrel.link/ontology#", "");
                            } else {
                                obj.api = "";
                            }
                            if (typeof bindings[item]['prefix'] !== 'undefined') {
                                obj.prefix = bindings[item]['prefix'].value.replace("http://hungry.squirrel.link/ontology#", "");
                            } else {
                                obj.prefix = "";
                            }
                            if (typeof bindings[item]['group'] !== 'undefined') {
                                obj.group = bindings[item]['group'].value.replace("http://hungry.squirrel.link/ontology#", "");
                            } else {
                                obj.group = "not definded";
                            }
                            if (typeof bindings[item]['language'] !== 'undefined') {
                                obj.language = bindings[item]['language'].value.replace("http://hungry.squirrel.link/ontology#", "");
                            } else {
                                obj.language = "";
                            }
                            obj.id = bindings[item]['id'].value.replace("http://hungry.squirrel.link/ontology#", "");
                            obj.url = "http://www.wikidata.org/entity/" + bindings[item]['id'].value;
                            if (typeof bindings[item]['link'] !== 'undefined') {
                                arrLinks.push("<br>" + bindings[item]['link'].value);
                            }

                        }
                    }
                    arrLinks = remDoub(arrLinks);
                    let links = arrLinks.toString();
                    obj.link = links.replace(",", "");
                    arr.push(obj);
                }
                console.log(arr);
                response.results.bindings = bindings_copy;
                if (typeof callback === 'function') {
                    callback(arr);
                } else {
                    return arr;
                }
            }
        });
    }, 100);
};
