
$(document).ready(function(){


var url = window.location.search;
var wineryid;

if (url.indexOf("?winery_id=") !== -1) {
    wineryid = url.split("=")[1];
    getwineryinfo(wineryid);
    
  }


function getwineryinfo(wineryname){
    wineryid = wineryname || "";

    if(wineryid){
        wineryid = "/?winery_id=" + wineryid;
    }
    
    $.get("/api/winery" + wineryid, function(result){
        console.log(result);
        $('.winery-name').text(result[0].wineryname)
    })
};

function wineryenter(id){
        
    $.post("/api/wineryinfo/", {
        wineryid: id
    }).then(function(result){
        // window.location.replace("/winery")
        // const x = result[0].id;
        console.log(result)

    }).catch(function(err){
        console.log(err);
    })
}
});