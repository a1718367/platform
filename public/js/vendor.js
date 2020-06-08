$(document).ready(function() {

    let memberid;
    let wineryid;
    const wname = $('#wineryname-input');
    const waddress = $('#wineaddress-input');
    const wpostcode = $('#winepostcode-input');
    const wphone = $('#winephone-input');
    const wemail = $('#wineemail-input');

    const eventname = $('#eventname');
    const eventdate = $('#eventdate');
    const eventtime = $('#eventtime');
    const eventcapacity = $('#eventcapacity');
    
    const winerydisplay = document.querySelector("#winerydisplay");
    const winerydetail = document.querySelector("#winerydetail");
    const addwineryform = document.querySelector("#addwineryform");
    

    var cday = moment().format('dddd, Do MMM YYYY, h:mm:ss a');
    $('#currentday').text(cday);

    $.get("/api/user_data").then(function(data) {
      $(".member-name").text(data.email);
      $('.memberid').text(data.id);
      memberid = data.id

      return memberid;
    }).then(function(memberid){
        getwineries(memberid);
        getwineries_unc(memberid);
        
    });

    $('form.addwinery').on('submit', function(event){
        event.preventDefault();
        const wineryData = {
            wineryname: $('#wineryname-input').val().trim(),
            wineryaddress: $('#wineaddress-input').val().trim(),
            winerypostcode: $('#winepostcode-input').val().trim(),
            wineryphone: $('#winephone-input').val().trim(),
            wineryemail: $('#wineemail-input').val().trim(),
            userid: memberid,
        }
        console.log(wineryData);
        addwinery(wineryData.wineryname, wineryData.wineryaddress,wineryData.winerypostcode, wineryData.wineryphone, wineryData.wineryemail, wineryData.userid)
        wname.val("");
        waddress.val("");
        wpostcode.val("");
        wphone.val("");
        wemail.val("");

    });

    $(document).on('click','.winerybtn', function(){
        wineryid = $(this).attr("data");
        console.log(wineryid)
        wineryenter(wineryid)
        winerydata(wineryid)
        winerydisplay.style.display = "none";
        winerydetail.style.display = "block";
        getevent(wineryid)
        return wineryid;
        
        
    });

    $(document).on('click', '.delwinerybtn', function(){
        const delwineid = $(this).attr("data");
        const data = {
            id: delwineid,
            current: 0,
        };
        update(data)
        
    })

    $('form.addsession').on('submit', function(event){
        event.preventDefault();

        const eventData = {

            eventname: $('#eventname').val().trim(),
            eventdate: $('#eventdate').val().trim(),
            eventtime: $('#eventtime').val().trim(),
            capacity: $('#eventcapacity').val().trim(),
            FK_Wineryid: wineryid,
        };
        console.log(eventData);
        addevent(eventData.eventname,eventData.eventdate,eventData.eventtime,eventData.capacity,eventData.FK_Wineryid)
        eventname.val("");
        eventdate.val("");
        eventtime.val("");
        eventcapacity.val("");
        window.location.reload();

    });

    $('#addwinerysidenav'). on('click',function(){
        winerydisplay.style.display = "none"
        winerydetail.style.display = "none";
        addwineryform.style.display = "block"
        closeNav()
    });

    $('#showwinerysidenav').on("click", function(){
        // addwineryform.style.display = "none";
        // winerydetail.style.display = "none";
        // winerydisplay.style.display = "block";
        closeNav()
        window.location.reload();
    });

    $('#opennav').on("click", function(){
        openNav();
    });

    $('#closenav').on("click", function(){
        closeNav();
    })


    //######### functions ###########//

    function addwinery(name,address,postcode,phone,email, id){
        $.post("/api/addwinery", {
            wineryname: name,
            wineaddress: address,
            winepostcode: postcode,
            winephone: phone,
            wineemail: email,
            FK_Userid: id,
        }).then(function(data){
            console.log(data)
            // getwineries(memberid);
            window.location.reload();
            // addwineryform.style.display = "none";
            // winerydisplay.style.display = "block";
        }).catch(handleLoginErr);
    };

    function addevent(name,date,time,capacity,id){
        $.post("/api/addevent", {
            eventname: name,
            eventdate: date,
            eventtime: time,
            capacity: capacity,
            FK_Wineryid: id,
        }).then(function(data){
            console.log(data)

        }).catch(handleLoginErr);
    };

    function handleLoginErr(err) {
        console.log(err.responseJSON.errors[0].message)
        // $("#alert .msg").text(err.responseJSON.errors[0].message);
        // $("#alert").fadeIn(500);
      };

    function update(data) {
        $.ajax({
            method: "PUT",
            url: "/api/updatewinery",
            data: data,
        }).then(function(result){
            console.log(result)
            window.location.reload();
        })
    }

//get vendor's wineries and populate the page
    function getwineries(id){
        $.get("/api/wineries_data/" + id, function(data){
            // console.log(data)
        }).then(function(data){
            data.forEach(element => {
                const wineries = renderwineries(element);
                $('#wineries').append(wineries);
        
            });
        })
        
    };
    function getwineries_unc(id){
        $.get("/api/wineries_uncdata/" + id, function(data){

        }).then(function(data){
            data.forEach(element => {
                const wineries = renderwineries_unc(element);
                $('#uncurrent').append(wineries);
        
            });
        })
    };

    function getevent(id){
        $.get("/api/event/" + id, function(){

        }).then(function(data){
            console.log(data)
            data.forEach(element => {
                const eventdata = renderevent(element);
                $('#event').append(eventdata);
                
            });
        })
    }

//enter into individual winery
    function wineryenter(id){
        
        $.post("/api/wineryinfo/", {
            wineryid: id
        }).then(function(result){
            // window.location.replace("/winery")
            // const x = result[0].id;
            $('.winery-name').text(result[0].wineryname)
            console.log(result)

        }).catch(function(err){
            console.log(err);
        })
    }
//same result from above but using get
    function winerydata(id){
        $.get("/api/winerydata/"+ id, function(data){
            
        }).then(function(data){
            console.log(data)
        })
    };


//Rending functions


    function renderwineries(data){
        const block = `<div class="card border-dark mb-3">
        
               <div class="card-header">${data.wineryname}
               <span>
               <button class="btn btn-success ml-5 winerybtn" data="${data.id}">Enter</button>
               <button class="btn btn-danger ml-5 delwinerybtn" data="${data.id}">Delete</button>
               </span></div>
               <div class="card-body text-dark">
                <div class="row">
                <div class="col-sm-12 col-md-4">
                 <h5 class="card-title" data=${data.id}>${data.wineryname}</h5>
                 <p class="card-text">Address: ${data.wineaddress}</p>
                 <p class="card-text">Email: ${data.wineemail}</p>
                 <a href="/winery?winery_id=${data.id}">${data.wineryname}</a>
                 <p class="card-text">Phone: ${data.winephone}</p>
               </div>
               <div class="col-sm-12 col-md-8">

               </div>
               </div>
               </div>

             </div>`
             return block
       };

       function renderwineries_unc(data){
        const block = `<div class="card border-dark mb-3">
        
               <div class="card-header">${data.wineryname}</div>
               <div class="card-body text-dark">
                 
                 <p class="card-text">Address: ${data.wineaddress}</p>
                 <p class="card-text">Email: ${data.wineemail}</p>
                 <a href="/winery?winery_id=${data.id}">${data.wineryname}</a>
                 <p class="card-text">Phone: ${data.winephone}</p>
               </div>
             </div>`
             return block
       };

       function renderevent(data){
           const block = `
           <tr>
           <td>${data.eventname}</td>
           <td>${data.eventdate}</td>
           <td>${data.eventtime}</td>
           <td>${data.capacity}</td>
           </tr>`
           return block
       }



  // side nav

  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    // document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  };

  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    // document.getElementById("main").style.marginLeft = "50px";
    document.body.style.backgroundColor = "white";
  };

  });



