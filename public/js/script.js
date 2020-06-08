$(document).ready(function() {
    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page

    let memberid;
    const wname = $('#wineryname-input');
    const waddress = $('#wineaddress-input');
    const wpostcode = $('#winepostcode-input');
    const wphone = $('#winephone-input');
    const wemail = $('#wineemail-input');
    const winerydisplay = document.querySelector("#wineries");
    const winerydetail = document.querySelector("#winerydetail")
    

    $.get("/api/user_data").then(function(data) {
      $(".member-name").text(data.email);
      $('.memberid').text(data.id);
      memberid = data.id

      return memberid;
    }).then(function(memberid){
        

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

        getwineries(memberid);
        
    });

    $(document).on('click','.winerybtn', function(){
        const wineryid = $(this).attr("data");
        console.log(wineryid)
        wineryenter(wineryid)
        winerydata(wineryid)
        winerydisplay.style.display = "none";
        winerydetail.style.display = "block";
        

        
    });



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
            window.location.reload();
        }).catch(handleLoginErr);
    };

    function handleLoginErr(err) {
        console.log(err.responseJSON.errors[0].message)
        // $("#alert .msg").text(err.responseJSON.errors[0].message);
        // $("#alert").fadeIn(500);
      };


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

    function wineryenter(id){
        
        $.post("/api/wineryinfo/", {
            wineryid: id
        }).then(function(result){
            // window.location.replace("/winery")
            // const x = result[0].id;
            console.log(result)
            $('.winery-name').text(result[0].wineryname)

        }).catch(function(err){
            console.log(err);
        })
    }

    function winerydata(id){
        $.get("/api/winerydata/"+ id, function(data){
            
        }).then(function(data){
            console.log(data)
            
        })
    }



    function renderwineries(data){
        const block = `<div class="card border-dark mb-3">
        
               <div class="card-header">${data.wineryname}<span><button class="btn btn-success ml-5 winerybtn" data="${data.id}">Enter</button></span></div>
               <div class="card-body text-dark">
                 <h5 class="card-title" data=${data.id}>${data.wineryname}</h5>
                 <p class="card-text">Address: ${data.wineaddress}</p>
                 <p class="card-text">Email: ${data.wineemail}</p>
                 <a href="/winery?winery_id=${data.id}">${data.wineryname}</a>
                 <p class="card-text">Phone: ${data.winephone}</p>
            
               </div>
             </div>`
             return block
       }
  });