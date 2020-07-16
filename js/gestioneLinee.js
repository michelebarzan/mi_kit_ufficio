var linee;
var cabine_corridoi_linee;
var id_linee;
var gestioneLineeActionBar;
var selectLottoAssegnaCabineCorridoi;
var mostraCarrelli=false;
var colors=["#EE7C7C","#937CEE","#7CEEA6","#EAEE7C","#7CC4EE","#EEB97C"];
var colorsCarrelli=[];
/*var carrelloBefore;
var colorCarrello;*/
var carrelli=[];
var turno;

function resetStyle(button)
{
    var buttons=document.getElementsByClassName("full-width-action-bar-button");
    for (let index = 0; index < buttons.length; index++) {
        const element = buttons[index];
        element.style.color="#ddd";
        element.style.fontWeight="normal";
    }
    button.style.color="#4C91CB";
    button.style.fontWeight="bold";
    $("#gestioneLineeActionBar").hide("fast","swing");
    var container=document.getElementById("gestioneLineeInnerContainer");
    container.innerHTML="";
}
async function assegnaCabineCorridoi(button)
{
    $("#gestioneLineeActionBar").show("fast","swing");
    $("#gestioneLineeActionBar").css({"display":"flex"});

    var actionBar=document.getElementById("gestioneLineeActionBar");
    actionBar.innerHTML="";

    var actionBarItem=document.createElement("div");
    actionBarItem.setAttribute("class","rcb-select-container");
    
    var span=document.createElement("span");
    span.innerHTML="Lotto";
    actionBarItem.appendChild(span);

    var selectLotto=document.createElement("select");
    selectLotto.setAttribute("onchange","getElencoCabineCorridoi(this)");
    selectLotto.setAttribute("id","selectLottoAssegnaCabineCorridoi");
    var lotti=await getLotti("lotto","DESC");
    var dirty_commesse=[];
    lotti.forEach(function (lotto)
    {
        dirty_commesse.push(lotto.commessa);
    });
    var commesse = [];
    $.each(dirty_commesse, function(i, el){
        if($.inArray(el, commesse) === -1) commesse.push(el);
    });
    commesse.forEach(function (commessa)
    {
        var optgroup=document.createElement("optgroup");
        optgroup.setAttribute("label",commessa);
        lotti.forEach(function (lotto)
        {
            if(lotto.commessa==commessa)
            {
                var option=document.createElement("option");
                option.setAttribute("value",lotto.commessa+"|"+lotto.lotto);
                option.innerHTML=lotto.lotto;
                optgroup.appendChild(option);
            }
        });
        selectLotto.appendChild(optgroup);
    });
    
    actionBarItem.appendChild(selectLotto);
    actionBar.appendChild(actionBarItem);

    var actionBarItem=document.createElement("div");
    actionBarItem.setAttribute("class","rcb-select-container");

    var selectTurno=document.createElement("select");
    selectTurno.setAttribute("onchange","getElencoCabineCorridoi(document.getElementById('selectLottoAssegnaCabineCorridoi'))");
    selectTurno.setAttribute("id","selectTurnoAssegnaCabineCorridoi");
    var turni=await getTurni();
    turni.forEach(function (turno)
    {
        var option=document.createElement("option");
        option.setAttribute("value",turno.id_turno);
        option.innerHTML=turno.label;
        selectTurno.appendChild(option);
    });
    
    actionBarItem.appendChild(selectTurno);
    actionBar.appendChild(actionBarItem);

    var switchButton=document.createElement("button");
    switchButton.setAttribute("class","rcb-button-text-icon");
    switchButton.setAttribute("onclick","switchCodiceCabineCorridoiItemAll()");
    switchButton.innerHTML='<span>Numero cabina</span><i class="fad fa-repeat-alt" style="color:#4C91CB;margin-right: 5px;margin-left: 5px;"></i><span>Disegno cabina</span>';
    actionBar.appendChild(switchButton);

    var mostraCarrelliButton=document.createElement("button");
    mostraCarrelliButton.setAttribute("class","rcb-button-text-icon");

    var labelMostraCarrelli=document.createElement("label");
    labelMostraCarrelli.setAttribute("class","pure-material-checkbox");

    var inputMostraCarrelli=document.createElement("input");
    inputMostraCarrelli.setAttribute("type","checkbox");
    inputMostraCarrelli.setAttribute("id","checkboxMostraCarrelli");
    inputMostraCarrelli.setAttribute("onchange","mostraCarrelli=this.checked;getElencoCabineCorridoi(document.getElementById('selectLottoAssegnaCabineCorridoi'))");
    labelMostraCarrelli.appendChild(inputMostraCarrelli);

    var spanMostraCarrelli=document.createElement("span");
    spanMostraCarrelli.setAttribute("style","color:black");
    spanMostraCarrelli.innerHTML="<div>Mostra carrelli</div>";
    labelMostraCarrelli.appendChild(spanMostraCarrelli);

    mostraCarrelliButton.appendChild(labelMostraCarrelli);
    actionBar.appendChild(mostraCarrelliButton);

    var mappaColoriCarrelliButton=document.createElement("button");
    mappaColoriCarrelliButton.setAttribute("class","rcb-button-text-icon");
    mappaColoriCarrelliButton.setAttribute("id","mappaColoriCarrelliButton");
    mappaColoriCarrelliButton.setAttribute("style","display:none");
    mappaColoriCarrelliButton.setAttribute("onclick","getPopupMappaColoriCarrelli()");
    mappaColoriCarrelliButton.innerHTML='<span>Colori carrelli</span><i style="margin-left:5px" class="fad fa-palette"></i>';
    actionBar.appendChild(mappaColoriCarrelliButton);

    var raggruppaCarrelliButton=document.createElement("button");
    raggruppaCarrelliButton.setAttribute("class","rcb-button-text-icon");
    raggruppaCarrelliButton.setAttribute("onclick","raggruppaCarrelli()");
    raggruppaCarrelliButton.innerHTML='<span>Raggruppa carrelli</span><i style="margin-left:5px" class="fad fa-layer-group"></i>';
    actionBar.appendChild(raggruppaCarrelliButton);

    var riepilogoButton=document.createElement("button");
    riepilogoButton.setAttribute("class","rcb-button-text-icon");
    riepilogoButton.setAttribute("onclick","getPopupRiepilogo()");
    riepilogoButton.innerHTML='<span>Riepilogo</span><i style="margin-left:5px" class="fad fa-analytics"></i>';
    actionBar.appendChild(riepilogoButton);

    $("#selectLottoAssegnaCabineCorridoi").multipleSelect(
    {
        single:true,
        onAfterCreate: function () 
                {
                    $(".ms-choice").css({"height":"20px","line-height":"21px","background-color":"transparent","border":"none"});
                },
        onOpen:function()
        {
            $(".ms-search input").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
            $(".optgroup").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
        },
        filter:true,
        filterPlaceholder:"Cerca...",
        locale:"it-IT"
    });

    var container=document.getElementById("gestioneLineeInnerContainer");
    container.innerHTML="";

    var cabineCorridoiOuterContainer=document.createElement("div");
    cabineCorridoiOuterContainer.setAttribute("id","cabineCorridoiOuterContainer");

    var cabineCorridoiInnerContainer=document.createElement("div")
    cabineCorridoiInnerContainer.setAttribute("id","cabineCorridoiInnerContainer");
    cabineCorridoiInnerContainer.setAttribute("class","connectedSortable");
    cabineCorridoiOuterContainer.appendChild(cabineCorridoiInnerContainer);
    
    container.appendChild(cabineCorridoiOuterContainer);

    getElencoCabineCorridoi(document.getElementById("selectLottoAssegnaCabineCorridoi"));
    
    var lineeContainer=document.createElement("div");
    lineeContainer.setAttribute("id","lineeContainer");
    container.appendChild(lineeContainer);
}
function switchCodiceCabineCorridoiItemAll()
{
    var all=document.getElementsByClassName("switch-codice-button");
    for (let index = 0; index < all.length; index++) {
        const element = all[index];
        element.click();
    }
}
async function getElencoCabineCorridoi(select)
{
    selectLottoAssegnaCabineCorridoi=select;
    selectLottoAssegnaCabineCorridoi.disabled=true;

    colorsCarrelli=[];

    gestioneLineeActionBar=document.getElementById("gestioneLineeActionBar");
    //getFaSpinner(gestioneLineeActionBar,"gestioneLineeActionBar","Caricamento in corso...");
    Swal.fire
    ({
        title: "Caricamento in corso... ",
        background:"rgba(0,0,0,0.4)",
        html: '<i style="color:#ddd" class="fad fa-spinner-third fa-spin fa-3x"></i>',
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function()
        {
            document.getElementsByClassName("swal2-title")[0].style.color="white";
            document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
            document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";
            document.getElementsByClassName("swal2-container")[0].style.padding="0px";
            document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
            document.getElementsByClassName("swal2-popup")[0].style.height="100%";
            document.getElementsByClassName("swal2-popup")[0].style.maxWidth="100%";document.getElementsByClassName("swal2-popup")[0].style.minWidth="100%";document.getElementsByClassName("swal2-popup")[0].style.width="100%";
        }
    });

    var selectValue=$('#selectLottoAssegnaCabineCorridoi').multipleSelect('getSelects')[0];
    var commessa=selectValue.split("|")[0];
    var lotto=selectValue.split("|")[1];

    turno=document.getElementById("selectTurnoAssegnaCabineCorridoi").value;

    var cabineCorridoiOuterContainer=document.getElementById("cabineCorridoiOuterContainer");
    var cabineCorridoiInnerContainer=document.getElementById("cabineCorridoiInnerContainer");
    cabineCorridoiInnerContainer.innerHTML="";

    try {
        document.getElementById("lineeContainer").innerHTML="";
    } catch (error) {}

    var cabine_corridoi=await getCabineCorridoi(commessa,lotto);
    
    cabine_corridoi.forEach(function(cabina_corridoio)
    {
        cabineCorridoiInnerContainer.appendChild(getCabineCorridoiItem(cabina_corridoio,commessa,lotto,0));
    });  

    try {
        document.getElementById("lineaInfoContainer0").remove();
    } catch (error) {}

    var lineaInfoContainer=document.createElement("div");
    lineaInfoContainer.setAttribute("class","linea-info-container");
    lineaInfoContainer.setAttribute("id","lineaInfoContainer0");

    /*var nomeLineaContainer=document.createElement("div");
    var span=document.createElement("span");
    span.setAttribute("style","font-style: italic;font-weight:bold;color:#4C91CB");
    span.innerHTML="Non assegnate";
    nomeLineaContainer.appendChild(span);
    lineaInfoContainer.appendChild(nomeLineaContainer);*/

    var nCabineCorridoiContainer=document.createElement("div");
    var span=document.createElement("span");
    span.setAttribute("style","margin-right:5px");
    span.innerHTML="Qnt:";
    nCabineCorridoiContainer.appendChild(span);
    var span=document.createElement("span");
    span.setAttribute("style","font-weight:bold;color:#4C91CB");
    span.setAttribute("id","nCabineCorridoiContainer0");
    span.innerHTML='<i class="fad fa-spinner-third fa-spin"></i>';
    nCabineCorridoiContainer.appendChild(span);
    lineaInfoContainer.appendChild(nCabineCorridoiContainer);

    var nKitElettrificatiContainer=document.createElement("div");
    var span=document.createElement("span");
    span.setAttribute("style","margin-right:5px");
    span.innerHTML="Kit elettr.";
    nKitElettrificatiContainer.appendChild(span);
    var span=document.createElement("span");
    span.setAttribute("style","font-weight:bold;color:#4C91CB");
    span.setAttribute("id","nKitElettrificatiContainer0");
    span.innerHTML='<i class="fad fa-spinner-third fa-spin"></i>';
    nKitElettrificatiContainer.appendChild(span);
    lineaInfoContainer.appendChild(nKitElettrificatiContainer);

    var nPannelliContainer=document.createElement("div");
    var span=document.createElement("span");
    span.setAttribute("style","margin-right:5px");
    span.innerHTML="N. pan.";
    nPannelliContainer.appendChild(span);
    var span=document.createElement("span");
    span.setAttribute("style","font-weight:bold;color:#4C91CB");
    span.setAttribute("id","nPannelliContainer0");
    span.innerHTML='<i class="fad fa-spinner-third fa-spin"></i>';
    nPannelliContainer.appendChild(span);
    lineaInfoContainer.appendChild(nPannelliContainer);

    cabineCorridoiOuterContainer.appendChild(lineaInfoContainer);
    
    getElencoLinee(commessa,lotto);
}
function getCabineCorridoi(commessa,lotto)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getCabineCorridoi.php",
        {
            commessa,
            lotto,
            mostraCarrelli,
            turno
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
            else
                reject({status});
        });
    });
}
var sortableDropHelper=
{
    origin:null,
    target:null,
    item:null
};
async function getElencoLinee(commessa,lotto)
{
    document.getElementById("mappaColoriCarrelliButton").style.display="none";

    var container=document.getElementById("lineeContainer");

    linee=await getLinee();

    var containerHeight=container.offsetHeight-(20*(linee.length-1));
    var height=containerHeight/linee.length;

    container.innerHTML="";

    id_linee=[];
    linee.forEach(function(linea)
    {
        id_linee.push(linea.id_linea);
    });
    cabine_corridoi_linee=await getCabineCorridoiLinee(id_linee,commessa,lotto);
    console.log(cabine_corridoi_linee);

    var i=0;
    linee.forEach(function(linea)
    {
        var lineaOuterContainer=document.createElement("div");
        lineaOuterContainer.setAttribute("class","linea-outer-container");
        if(i==linee.length-1)
            lineaOuterContainer.setAttribute("style","height:"+height+"px;margin-bottom:0px;border:2px solid "+linea.colore);
        else
            lineaOuterContainer.setAttribute("style","height:"+height+"px;border:2px solid "+linea.colore);

        var lineaInnerContainer=document.createElement("div");
        lineaInnerContainer.setAttribute("class","linea-inner-container connectedSortable");
        lineaInnerContainer.setAttribute("id","cabineCorridoiLineeContainer"+linea.id_linea);
        lineaOuterContainer.appendChild(lineaInnerContainer);

        var cabine_corridoi_linea=cabine_corridoi_linee[linea.id_linea];
        if(cabine_corridoi_linea.length>0)
        {
            cabine_corridoi_linea.forEach(function(cabina_corridoio_linea)
            {
                lineaInnerContainer.appendChild(getCabineCorridoiItem(cabina_corridoio_linea,commessa,lotto,linea.id_linea));
            });
        }

        lineaOuterContainer.appendChild(lineaInnerContainer);

        var lineaInfoContainer=document.createElement("div");
        lineaInfoContainer.setAttribute("class","linea-info-container");

        var nomeLineaContainer=document.createElement("div");
        var span=document.createElement("span");
        span.setAttribute("style","font-style: italic;font-weight:bold;color:#4C91CB");
        span.innerHTML=linea.label;
        nomeLineaContainer.appendChild(span);
        lineaInfoContainer.appendChild(nomeLineaContainer);

        var nCabineCorridoiContainer=document.createElement("div");
        var span=document.createElement("span");
        span.setAttribute("style","margin-right:5px");
        span.innerHTML="Qnt:";
        nCabineCorridoiContainer.appendChild(span);
        var span=document.createElement("span");
        span.setAttribute("style","font-weight:bold;color:#4C91CB");
        span.setAttribute("id","nCabineCorridoiContainer"+linea.id_linea);
        nCabineCorridoiContainer.appendChild(span);
        lineaInfoContainer.appendChild(nCabineCorridoiContainer);

        var nKitElettrificatiContainer=document.createElement("div");
        var span=document.createElement("span");
        span.setAttribute("style","margin-right:5px");
        span.innerHTML="Kit elettrificati";
        nKitElettrificatiContainer.appendChild(span);
        var span=document.createElement("span");
        span.setAttribute("style","font-weight:bold;color:#4C91CB");
        span.setAttribute("id","nKitElettrificatiContainer"+linea.id_linea);
        nKitElettrificatiContainer.appendChild(span);
        lineaInfoContainer.appendChild(nKitElettrificatiContainer);

        var nPannelliContainer=document.createElement("div");
        var span=document.createElement("span");
        span.setAttribute("style","margin-right:5px");
        span.innerHTML="N. pannelli";
        nPannelliContainer.appendChild(span);
        var span=document.createElement("span");
        span.setAttribute("style","font-weight:bold;color:#4C91CB");
        span.setAttribute("id","nPannelliContainer"+linea.id_linea);
        nPannelliContainer.appendChild(span);
        lineaInfoContainer.appendChild(nPannelliContainer);

        lineaOuterContainer.appendChild(lineaInfoContainer);

        container.appendChild(lineaOuterContainer);

        i++;
    });

    $( ".connectedSortable" ).sortable(
    {
        connectWith: ".connectedSortable",
        start: function( event, ui )
        {
            var elements=document.getElementsByClassName("linea-inner-container");
            for (let index = 0; index < elements.length; index++)
            {
                var element = elements[index];
                element.style.backgroundColor="rgba(76, 145, 203, 0.15)";
                element.style.border="2px dashed #4C91CB";
            }
            var element = document.getElementById("cabineCorridoiInnerContainer");
            element.style.backgroundColor="rgba(76, 145, 203, 0.15)";
            element.style.border="2px dashed #4C91CB";
        },
        stop: function( event, ui )
        {
            var elements=document.getElementsByClassName("linea-inner-container");
            for (let index = 0; index < elements.length; index++)
            {
                var element = elements[index];
                element.style.backgroundColor="";
                element.style.border="";
            }
            var element = document.getElementById("cabineCorridoiInnerContainer");
            element.style.backgroundColor="";
            element.style.border="";
        },
        update: function( event, ui )
                {
                    var item=ui.item;
                    var changedList = this.id;

                    if(sortableDropHelper.origin==null)
                    {
                        sortableDropHelper.origin=changedList;
                    }
                    else
                    {
                        sortableDropHelper.target=changedList;

                        sortableDropHelper.item=item;

                        if(sortableDropHelper.target!=sortableDropHelper.origin && sortableDropHelper.target!=null && sortableDropHelper.origin!=null)
                        {
                            var commessa=sortableDropHelper.item.attr("commessa");
                            var lotto=sortableDropHelper.item.attr("lotto");
                            var numero_cabina=sortableDropHelper.item.attr("numero_cabina");

                            if(sortableDropHelper.origin!="cabineCorridoiInnerContainer")
                            {
                                var lineaOrigin=parseInt(sortableDropHelper.origin.replace("cabineCorridoiLineeContainer",""));
                                rimuoviCabinaCorridoio(lineaOrigin,commessa,lotto,numero_cabina);
                                item.attr("linea","0");
                                var children=item.children();
                                var kitElettrificatiContainer=children[1];
                                var kitElettrificatiInnerContainer=kitElettrificatiContainer.childNodes[1];
                                var totaleKitInnerContainer=kitElettrificatiContainer.childNodes[3];
                                var nPannelliContainer=children[2];
                                var nPannelliInnerContainer=nPannelliContainer.childNodes[1];
                                kitElettrificatiInnerContainer.className = "kit_elettrificati_linea_0";
                                totaleKitInnerContainer.className = "totale_kit_linea_0";
                                nPannelliInnerContainer.className = "n_pannelli_linea_0";
                                /*console.log("elettr");
                                console.log(kitElettrificatiInnerContainer);
                                console.log("tot");
                                console.log(totaleKitInnerContainer);
                                console.log("n pan");
                                console.log(nPannelliInnerContainer);*/
                            }
                            if(sortableDropHelper.target!="cabineCorridoiInnerContainer")
                            {
                                var lineaTarget=parseInt(sortableDropHelper.target.replace("cabineCorridoiLineeContainer",""));
                                aggiungiCabinaCorridoio(lineaTarget,commessa,lotto,numero_cabina);
                                item.attr("linea",lineaTarget);
                                var children=item.children();
                                var kitElettrificatiContainer=children[1];
                                var kitElettrificatiInnerContainer=kitElettrificatiContainer.childNodes[1];
                                var totaleKitInnerContainer=kitElettrificatiContainer.childNodes[3];
                                var nPannelliContainer=children[2];
                                var nPannelliInnerContainer=nPannelliContainer.childNodes[1];
                                kitElettrificatiInnerContainer.className = "kit_elettrificati_linea_"+lineaTarget;
                                totaleKitInnerContainer.className = "totale_kit_linea_"+lineaTarget;
                                nPannelliInnerContainer.className = "n_pannelli_linea_"+lineaTarget;
                                /*console.log("elettr");
                                console.log(kitElettrificatiInnerContainer);
                                console.log("tot");
                                console.log(totaleKitInnerContainer);
                                console.log("n pan");
                                console.log(nPannelliInnerContainer);*/
                            }

                            sortableDropHelper.origin=null;
                            sortableDropHelper.target=null;
                            sortableDropHelper.item=null;

                            getTotaliLinee();
                        }
                    }
                }
    }).disableSelection();
    //removeFaSpinner("gestioneLineeActionBar");
    Swal.close();
    getTotaliLinee();
    if(mostraCarrelli)
    {
        getColorsCarrelli();
        coloraCarrelli();
        document.getElementById("mappaColoriCarrelliButton").style.display="block";
    }
    selectLottoAssegnaCabineCorridoi.disabled=false;
}
function getColorsCarrelli()
{
    var dirty_carrelli=carrelli;
    carrelli=[];
    $.each(dirty_carrelli, function(i, el){
        if($.inArray(el, carrelli) === -1) carrelli.push(el);
    });
    carrelli.forEach(function (carrello)
    {
        var randomColor=getRandomColor();
        var colorObj=hexToRgb(randomColor);
        var color="rgba("+colorObj.r+","+colorObj.g+","+colorObj.b+",0.45)";
        var colorCarrello=
        {
            carrello,
            color,
            colorHex:randomColor
        };
        colorsCarrelli.push(colorCarrello);
    });
}
function coloraCarrelli()
{
    var cabineCorridoiItems=document.getElementsByClassName("cabine-corridoi-item");
    for (let index = 0; index < cabineCorridoiItems.length; index++)
    {
        var element = cabineCorridoiItems[index];
        var carrello=element.getAttribute("carrello");
        if(carrello!=null)
        {
            var colorCarrello=getFirstObjByPropValue(colorsCarrelli,"carrello",carrello);
            element.style.backgroundColor=colorCarrello.color;
            element.getElementsByTagName("INPUT")[0].style.backgroundColor=colorCarrello.color;
        }
    }
    raggruppaCarrelli();
}
function raggruppaCarrelli()
{
    if(mostraCarrelli)
    {
        $("#cabineCorridoiInnerContainer .cabine-corridoi-item").sort(function (a, b){
            return $("input", b).css("background") < $("input", a).css("background") ? 1 : -1;    
        }).appendTo('#cabineCorridoiInnerContainer');
        id_linee.forEach(function(id_linea)
        {
            $("#cabineCorridoiLineeContainer"+id_linea+" .cabine-corridoi-item").sort(function (a, b){
                return $("input", b).css("background") < $("input", a).css("background") ? 1 : -1;    
            }).appendTo('#cabineCorridoiLineeContainer'+id_linea);
        });
    }
}
function getRandomColor()
{
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) 
    {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function hexToRgb(hex) 
{
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}
function getCabineCorridoiItem(cabina_corridoio,commessa,lotto,linea)
{    
    //console.log(cabina_corridoio);
    var item=document.createElement("div");
    item.setAttribute("class","cabine-corridoi-item");
    if(cabina_corridoio.carrello!=undefined)
    {
        item.setAttribute("title","Carrello: "+cabina_corridoio.carrello);
        item.setAttribute("carrello",cabina_corridoio.carrello);
        carrelli.push(cabina_corridoio.carrello);
    }
    item.setAttribute("commessa",commessa);
    item.setAttribute("lotto",lotto);
    item.setAttribute("linea",linea);
    item.setAttribute("numero_cabina",cabina_corridoio.numero_cabina);

    var div=document.createElement("div");
    div.setAttribute("class","cabine-corridoi-item-info");
    var switchButton=document.createElement("button");
    var switchButtonIcon=document.createElement("i");
    switchButtonIcon.setAttribute("class","fad fa-repeat-alt");
    switchButton.setAttribute("class","switch-codice-button");
    switchButton.setAttribute("title","Cambia codice");
    switchButton.setAttribute("showing","numero_cabina");
    switchButton.setAttribute("onclick","switchCodiceCabineCorridoiItem(this,'"+cabina_corridoio.numero_cabina+"','"+cabina_corridoio.disegno_cabina+"')");
    switchButton.appendChild(switchButtonIcon);
    div.appendChild(switchButton);
    var span=document.createElement("span");
    span.innerHTML="<b style='color:black'>"+cabina_corridoio.numero_cabina+"</b>";
    div.appendChild(span);
    item.appendChild(div);

    var div=document.createElement("div");
    div.setAttribute("class","cabine-corridoi-item-info");
    div.innerHTML="Kit Elettr.&nbsp<b class='kit_elettrificati_linea_"+linea+"'>"+cabina_corridoio.n_kit_elettrificati+"</b>&nbsp/&nbsp<b class='totale_kit_linea_"+linea+"'>"+cabina_corridoio.n_kit+"</b>";
    item.appendChild(div);

    var div=document.createElement("div");
    div.setAttribute("class","cabine-corridoi-item-info");
    div.innerHTML="N. pan.&nbsp<b class='n_pannelli_linea_"+linea+"'>"+cabina_corridoio.n_pannelli+"</b>";
    item.appendChild(div);

    //elemento nascosto a cui attribuire un bg color per ordinare in base ai carrelli
    var hidden=document.createElement("input");
    hidden.setAttribute("type","hidden");
    item.appendChild(hidden);

    return item;
}
function getFirstObjByPropValue(array,prop,propValue)
{
    var return_item;
    array.forEach(function(item)
    {
        if(item[prop]==propValue)
        {
            return_item= item;
        }
    });
    return return_item;
}
function switchCodiceCabineCorridoiItem(button,numero_cabina,disegno_cabina)
{
    if(button.getAttribute("showing")=="numero_cabina")
    {
        button.setAttribute("showing","disegno_cabina");
        button.parentElement.lastChild.innerHTML="<b style='color:black'>"+disegno_cabina+"</b>";
    }
    else
    {
        button.setAttribute("showing","numero_cabina");
        button.parentElement.lastChild.innerHTML="<b style='color:black'>"+numero_cabina+"</b>";
    }
}
async function getTotaliLinee()
{
    tmp_id_linee=id_linee;
    tmp_id_linee.push(0);
    tmp_id_linee.forEach(function(id_linea)
    {
        document.getElementById("nCabineCorridoiContainer"+id_linea).innerHTML='<i class="fad fa-spinner-third fa-spin"></i>';
        document.getElementById("nKitElettrificatiContainer"+id_linea).innerHTML='<i class="fad fa-spinner-third fa-spin"></i>';
        document.getElementById("nPannelliContainer"+id_linea).innerHTML='<i class="fad fa-spinner-third fa-spin"></i>';

        var nKitElettrificati=0;
        var nKit=0;
        var nPannelli=0;

        var kit_elettrificati_linea=document.getElementsByClassName("kit_elettrificati_linea_"+id_linea);
        for (let index = 0; index < kit_elettrificati_linea.length; index++) 
        {
            const element = kit_elettrificati_linea[index];
            nKitElettrificati+=parseInt(element.innerHTML);
        }
        var totale_kit_linea=document.getElementsByClassName("totale_kit_linea_"+id_linea);
        for (let index = 0; index < totale_kit_linea.length; index++) 
        {
            const element = totale_kit_linea[index];
            nKit+=parseInt(element.innerHTML);
        }
        var n_pannelli_linea=document.getElementsByClassName("n_pannelli_linea_"+id_linea);
        for (let index = 0; index < n_pannelli_linea.length; index++) 
        {
            const element = n_pannelli_linea[index];
            nPannelli+=parseInt(element.innerHTML);
        }

        if(id_linea==0)
            document.getElementById("nCabineCorridoiContainer"+id_linea).innerHTML=document.getElementById("cabineCorridoiInnerContainer").childElementCount;
        else
            document.getElementById("nCabineCorridoiContainer"+id_linea).innerHTML=document.getElementById("cabineCorridoiLineeContainer"+id_linea).childElementCount;
        document.getElementById("nKitElettrificatiContainer"+id_linea).innerHTML=nKitElettrificati+" / "+nKit;
        document.getElementById("nPannelliContainer"+id_linea).innerHTML=nPannelli;
    });   
    /*var commessa=document.getElementById("selectLottoAssegnaCabineCorridoi").value.split("|")[0];
    var lotto=document.getElementById("selectLottoAssegnaCabineCorridoi").value.split("|")[1];

    id_linee.forEach(function(id_linea)
    {
        document.getElementById("nCabineCorridoiContainer"+id_linea).innerHTML='<i class="fad fa-spinner-third fa-spin"></i>';
        document.getElementById("nKitElettrificatiContainer"+id_linea).innerHTML='<i class="fad fa-spinner-third fa-spin"></i>';
        document.getElementById("nPannelliContainer"+id_linea).innerHTML='<i class="fad fa-spinner-third fa-spin"></i>';
    });    

    setTimeout(async function()
    {
        var cabine_corridoi_linee=await getCabineCorridoiLinee(id_linee,commessa,lotto);

        id_linee.forEach(function(id_linea)
        {
            var cabine_corridoi_linea=cabine_corridoi_linee[id_linea];
            try {
                document.getElementById("nCabineCorridoiContainer"+id_linea).innerHTML=cabine_corridoi_linea.length;
            } catch (error) {
            }

            var nKitElettrificati=0;
            var nKit=0;
            var nPannelli=0;

            cabine_corridoi_linea.forEach(function(cabina_corridoio)
            {
                nKitElettrificati+=cabina_corridoio.n_kit_elettrificati;
                nKit+=cabina_corridoio.n_kit;
                nPannelli+=cabina_corridoio.n_pannelli;
            });

            try {
                document.getElementById("nKitElettrificatiContainer"+id_linea).innerHTML=nKitElettrificati+" / "+nKit;
            } catch (error) {
            }
            try {
                document.getElementById("nPannelliContainer"+id_linea).innerHTML=nPannelli;
            } catch (error) {
            }
        });    
    }, 1000);*/
}
function rimuoviCabinaCorridoio(id_linea,commessa,lotto,numero_cabina)
{
    $.get("rimuoviCabinaCorridoio.php",
    {
        id_linea,commessa,lotto,numero_cabina,turno
    },
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire
                ({
                    icon: 'error',
                    title: "Errore. Se il problema persiste contatta l' amministratore"
                });
                console.log(response);
            }
        }
    });
}
function aggiungiCabinaCorridoio(id_linea,commessa,lotto,numero_cabina)
{
    $.get("aggiungiCabinaCorridoio.php",
    {
        id_linea,commessa,lotto,numero_cabina,turno
    },
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire
                ({
                    icon: 'error',
                    title: "Errore. Se il problema persiste contatta l' amministratore"
                });
                console.log(response);
            }
        }
    });
}
function getCabineCorridoiLinee(id_linee,commessa,lotto)
{
    return new Promise(function (resolve, reject) 
    {
        var JSONid_linee=JSON.stringify(id_linee);
        $.get("getCabineCorridoiLinea.php",
        {
            JSONid_linee,
            commessa,
            lotto,
            mostraCarrelli,
            turno
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
            else
                reject({status});
        });
    });
}
function getLinee()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getLinee.php",
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
            else
                reject({status});
        });
    });
}
function getLotti(order_by,order_type)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getLotti.php",
        {
            order_by,order_type
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
            else
                reject({status});
        });
    });
}
function anagraficaTurni(button)
{
    $("#gestioneLineeActionBar").show("fast","swing");
    $("#gestioneLineeActionBar").css({"display":"flex"});
    var actionBar=document.getElementById("gestioneLineeActionBar");
    actionBar.innerHTML="";
    
    var actionBarItem=document.createElement("div");
    actionBarItem.setAttribute("class","rcb-text-container");

    var span=document.createElement("span");
    span.setAttribute("style","margin-right:5px");
    span.innerHTML="Righe:";
    actionBarItem.appendChild(span);

    var span=document.createElement("span");
    span.setAttribute("id","rowsNumEditableTable");
    span.setAttribute("style","font-weight:normal;color:black");
    span.innerHTML="0";
    actionBarItem.appendChild(span);
    
    actionBar.appendChild(actionBarItem);

    var buttonRipristina=document.createElement("button");
    buttonRipristina.setAttribute("class","rcb-button-text-icon");
    buttonRipristina.setAttribute("onclick","resetFilters();getTable(selectetTable)");
    buttonRipristina.innerHTML='<span>Ripristina</span><i style="margin-left:5px" class="fal fa-filter"></i>';
    
    actionBar.appendChild(buttonRipristina);

    getTable("anagrafica_turni");
}
function anagraficaLinee(button)
{
    $("#gestioneLineeActionBar").show("fast","swing");
    $("#gestioneLineeActionBar").css({"display":"flex"});
    var actionBar=document.getElementById("gestioneLineeActionBar");
    actionBar.innerHTML="";
    
    var actionBarItem=document.createElement("div");
    actionBarItem.setAttribute("class","rcb-text-container");

    var span=document.createElement("span");
    span.setAttribute("style","margin-right:5px");
    span.innerHTML="Righe:";
    actionBarItem.appendChild(span);

    var span=document.createElement("span");
    span.setAttribute("id","rowsNumEditableTable");
    span.setAttribute("style","font-weight:normal;color:black");
    span.innerHTML="0";
    actionBarItem.appendChild(span);
    
    actionBar.appendChild(actionBarItem);

    var buttonRipristina=document.createElement("button");
    buttonRipristina.setAttribute("class","rcb-button-text-icon");
    buttonRipristina.setAttribute("onclick","resetFilters();getTable(selectetTable)");
    buttonRipristina.innerHTML='<span>Ripristina</span><i style="margin-left:5px" class="fal fa-filter"></i>';
    
    actionBar.appendChild(buttonRipristina);

    getTable("anagrafica_linee");
}
function anagraficaStazioni(button)
{
    $("#gestioneLineeActionBar").show("fast","swing");
    $("#gestioneLineeActionBar").css({"display":"flex"});
    var actionBar=document.getElementById("gestioneLineeActionBar");
    actionBar.innerHTML="";
    
    var actionBarItem=document.createElement("div");
    actionBarItem.setAttribute("class","rcb-text-container");

    var span=document.createElement("span");
    span.setAttribute("style","margin-right:5px");
    span.innerHTML="Righe:";
    actionBarItem.appendChild(span);

    var span=document.createElement("span");
    span.setAttribute("id","rowsNumEditableTable");
    span.setAttribute("style","font-weight:normal;color:black");
    span.innerHTML="0";
    actionBarItem.appendChild(span);
    
    actionBar.appendChild(actionBarItem);

    var buttonRipristina=document.createElement("button");
    buttonRipristina.setAttribute("class","rcb-button-text-icon");
    buttonRipristina.setAttribute("onclick","resetFilters();getTable(selectetTable)");
    buttonRipristina.innerHTML='<span>Ripristina</span><i style="margin-left:5px" class="fal fa-filter"></i>';
    
    actionBar.appendChild(buttonRipristina);

    getTable("anagrafica_stazioni");
}
function getTable(table,orderBy,orderType)
{
    if(table=="anagrafica_linee")
    {
        getEditableTable
        ({
            table:'anagrafica_linee',
            editable: true,
            container:'gestioneLineeInnerContainer',
            readOnlyColumns:['id_linea'],
            noInsertColumns:['id_linea'],
            orderBy:orderBy,
            orderType:orderType
        });
    }
    if(table=="anagrafica_stazioni")
    {
        getEditableTable
        ({
            table:'anagrafica_stazioni',
            editable: true,
            container:'gestioneLineeInnerContainer',
            readOnlyColumns:['id_stazione'],
            noInsertColumns:['id_stazione'],
            orderBy:orderBy,
            orderType:orderType
        });
    }
    if(table=="anagrafica_turni")
    {
        getEditableTable
        ({
            table:'anagrafica_turni',
            editable: true,
            container:'gestioneLineeInnerContainer',
            readOnlyColumns:['id_turno'],
            noInsertColumns:['id_turno'],
            orderBy:orderBy,
            orderType:orderType
        });
    }
}
function editableTableLoad()
{

}
function getPopupMappaColoriCarrelli()
{
    if(colorsCarrelli.length>0)
    {
        var outerContainer=document.createElement("div");
        outerContainer.setAttribute("class","popup-outer-container");

        var actionBar=document.createElement("div");
        actionBar.setAttribute("class","popup-action-bar");
        actionBar.setAttribute("style","padding:0px;margin-bottom:5px;height:auto;box-shadow:none");

        var span=document.createElement("span");
        span.innerHTML="Personalizza colori carrelli";
        actionBar.appendChild(span);

        var button=document.createElement("button");
        button.setAttribute("style","margin-left:auto;font-size:18px");
        button.setAttribute("class","popup-action-bar-close-button");
        button.setAttribute("onclick","Swal.close()");
        button.innerHTML='<i class="fal fa-times"></i>';
        actionBar.appendChild(button);

        outerContainer.appendChild(actionBar);

        var ul=document.createElement("ul");
        ul.setAttribute("class","popup-ul");

        colorsCarrelli.forEach(function(carrello)
        {
            var li=document.createElement("li");

            var span=document.createElement("span");
            span.innerHTML=carrello.carrello;
            li.appendChild(span);
            
            var input=document.createElement("input");
            input.setAttribute("type","color");
            input.setAttribute("class","input-color-carrello");
            input.setAttribute("carrello",carrello.carrello);
            console.log(carrello.color);
            input.setAttribute("value",carrello.colorHex);
            li.appendChild(input);

            ul.appendChild(li);
        });

        outerContainer.appendChild(ul);

        var applicaButton=document.createElement("button");
        applicaButton.setAttribute("class","popup-button");
        applicaButton.setAttribute("style","width:100%;margin-top:10px;overflow: hidden;");
        applicaButton.setAttribute("onclick","modificaMappaColoriCarrelli()");
        applicaButton.innerHTML='<span>Applica</span><i class="fad fa-fill-drip"></i>';
        outerContainer.appendChild(applicaButton);

        Swal.fire
        ({
            background:"#353535",
            onOpen : function()
                    {
                        document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
                        document.getElementsByClassName("swal2-close")[0].style.outline="none";
                    },
            showConfirmButton:false,
            showCancelButton:false,
            html:outerContainer.outerHTML
        });
    }
}
function getTurni()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getTurni.php",
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
            else
                reject({status});
        });
    });
}
function modificaMappaColoriCarrelli()
{
    var inputs=document.getElementsByClassName("input-color-carrello");
    for (let index = 0; index < inputs.length; index++)
    {
        const input = inputs[index];
        var carrello=input.getAttribute("carrello");
        var colorHex=input.value;
        var colorObj=hexToRgb(colorHex);
        var color="rgba("+colorObj.r+","+colorObj.g+","+colorObj.b+",0.45)";

        if(colorsCarrelli[index].carrello==carrello)
        {
            colorsCarrelli[index].colorHex=colorHex;
            colorsCarrelli[index].color=color;
        }
    }
    console.log(colorsCarrelli);
    Swal.close();
    coloraCarrelli();
}
async function getPopupRiepilogo()
{
    Swal.fire
    ({
        title: "Caricamento in corso... ",
        background:"rgba(0,0,0,0.4)",
        html: '<i style="color:#ddd" class="fad fa-spinner-third fa-spin fa-3x"></i>',
        showConfirmButton:false,
        showCloseButton:false,
        allowEscapeKey:false,
        allowOutsideClick:false,
        onOpen : function()
        {
            document.getElementsByClassName("swal2-title")[0].style.color="white";
            document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";
            document.getElementsByClassName("swal2-title")[0].style.fontWeight="normal";
            document.getElementsByClassName("swal2-container")[0].style.padding="0px";
            document.getElementsByClassName("swal2-popup")[0].style.padding="0px";
            document.getElementsByClassName("swal2-popup")[0].style.height="100%";
            document.getElementsByClassName("swal2-popup")[0].style.maxWidth="100%";document.getElementsByClassName("swal2-popup")[0].style.minWidth="100%";document.getElementsByClassName("swal2-popup")[0].style.width="100%";
        }
    });

    var cabineAssegnateString=await getCabineAssegnate();

    setTimeout(function()
    {
        var selectValue=$('#selectLottoAssegnaCabineCorridoi').multipleSelect('getSelects')[0];
        var commessa=selectValue.split("|")[0];
        var lotto=selectValue.split("|")[1];
    
        var outerContainer=document.createElement("div");
        outerContainer.setAttribute("class","popup-outer-container");
    
        var actionBar=document.createElement("div");
        actionBar.setAttribute("class","popup-action-bar");
        actionBar.setAttribute("style","padding:0px;margin-bottom:5px;height:auto;box-shadow:none");
    
        var span=document.createElement("span");
        span.innerHTML="Riepilogo lotto "+lotto;
        actionBar.appendChild(span);

        var button=document.createElement("button");
        button.setAttribute("style","margin-left:auto;");
        button.setAttribute("class","popup-action-bar-text-button");
        button.setAttribute("id","popupActionBarTextButtoncabina_corridoio");
        button.setAttribute("onclick","getGraficoQntCabine('cabina_corridoio')");
        button.innerHTML='N. Cabine';
        actionBar.appendChild(button);

        var button=document.createElement("button");
        button.setAttribute("class","popup-action-bar-text-button");
        button.setAttribute("id","popupActionBarTextButtonkit");
        button.setAttribute("onclick","getGraficoQntCabine('kit')");
        button.innerHTML='N. Kit';
        actionBar.appendChild(button);

        var button=document.createElement("button");
        button.setAttribute("class","popup-action-bar-text-button");
        button.setAttribute("id","popupActionBarTextButtonpannelli");
        button.setAttribute("onclick","getGraficoQntCabine('pannelli')");
        button.innerHTML='N. Pannelli';
        actionBar.appendChild(button);
    
        var button=document.createElement("button");
        button.setAttribute("class","popup-action-bar-close-button");
        button.setAttribute("onclick","Swal.close()");
        button.innerHTML='<i class="fal fa-times"></i>';
        actionBar.appendChild(button);
    
        outerContainer.appendChild(actionBar);

        var row=document.createElement("div");
        row.setAttribute("class","popup-riepilogo-info-container");
        row.innerHTML=cabineAssegnateString;

        outerContainer.appendChild(row);

        var row=document.createElement("div");
        row.setAttribute("class","popup-riepilogo-chart-container");
        row.setAttribute("id","graficoQntCabineContainer");
        
        outerContainer.appendChild(row);
    
        Swal.fire
        ({
            background:"#353535",
            width:"1000px",
            onOpen : function()
                    {
                        document.getElementsByClassName("swal2-close")[0].style.outline="none";
                        getGraficoQntCabine("cabina_corridoio");
                    },
            showConfirmButton:false,
            showCancelButton:false,
            html:outerContainer.outerHTML
        });
    }, 200);
}
function getCabineAssegnate()
{
    return new Promise(function (resolve, reject) 
    {
        var selectValue=$('#selectLottoAssegnaCabineCorridoi').multipleSelect('getSelects')[0];
        var commessa=selectValue.split("|")[0];
        var lotto=selectValue.split("|")[1];
        $.get("getCabineAssegnateRiepilogoAssegnaCabineCorridoi.php",
        {
            commessa,
            lotto
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(response);
            }
            else
                reject({status});
        });
    });
}
function getDataPointsRiepilogo(colonna)
{
    return new Promise(function (resolve, reject) 
    {
        var selectValue=$('#selectLottoAssegnaCabineCorridoi').multipleSelect('getSelects')[0];
        var commessa=selectValue.split("|")[0];
        var lotto=selectValue.split("|")[1];
        $.get("getDataPointsRiepilogoAssegnaCabineCorridoi.php",
        {
            commessa,
            lotto,
            colonna
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(JSON.parse(response));
            }
            else
                reject({status});
        });
    });
}
async function getGraficoQntCabine(colonna)
{
    var graficoQntCabineContainer=document.getElementById("graficoQntCabineContainer");
    graficoQntCabineContainer.innerHTML="<div style='color:#ddd;margin-top:10px'><i class='fad fa-spinner-third fa-spin' style='margin-right:10px;font-size:16px'></i><span>Caricamento in corso...</span></div>";

    $(".popup-action-bar-text-button").css({"color":"","border":""});
    $("#popupActionBarTextButton"+colonna).css({"color":"#4C91CB","border":"1px solid #4C91CB"});

    if(colonna=="cabina_corridoio")
    {
        var axisYTitle="N. Cabine";
        var axisYInterval=1;
    }
    if(colonna=="kit")
    {
        var axisYTitle="N. Kit";  
        var axisYInterval=2;
    }
    if(colonna=="pannelli")
    {
        var axisYTitle="N. Pannelli";  
        var axisYInterval=10;
    }

    var data=await getDataPointsRiepilogo(colonna);
        
    graficoQntCabineContainer.innerHTML="";

    var chart = new CanvasJS.Chart("graficoQntCabineContainer",
    {
        backgroundColor:"transparent",
        animationEnabled: true,
        title:
        {
            text: "Carico di lavoro linee",
            fontFamily: "'Montserrat',sans-serif",
            fontColor: "#ddd",
            fontSize: 12,
            padding: 10,
        },
        axisY:
        {
            titleFontFamily: "'Montserrat',sans-serif",
            titleFontColor: "#ddd",
            titleFontSize: 10,
            labelFontFamily: "'Montserrat',sans-serif",
            labelFontColor: "#ddd",
            labelFontSize: 10,
            title: axisYTitle,
            interval:axisYInterval
        },
        axisX:
        {
            titleFontFamily: "'Montserrat',sans-serif",
            titleFontColor: "#ddd",
            titleFontSize: 10,
            labelFontFamily: "'Montserrat',sans-serif",
            labelFontColor: "#ddd",
            labelFontSize: 10
        },
        legend:
        {
            cursor:"pointer",
            fontFamily: "'Montserrat',sans-serif",
            fontColor: "#ddd",
            fontSize: 12,
            fontWeight: "normal",
            itemclick : toggleDataSeries
        },
        toolTip:
        {
            shared: true,
            content: toolTipFormatter
        },
        data
    });
    chart.render();
    
    function toolTipFormatter(e)
    {
        var str = "";
        var total = 0 ;
        var str3;
        var str2 ;
        for (var i = 0; i < e.entries.length; i++){
            var str1 = "<span style= \"color:"+e.entries[i].dataSeries.color + "\">" + e.entries[i].dataSeries.name + "</span>: <strong>"+  e.entries[i].dataPoint.y + "</strong> <br/>" ;
            total = e.entries[i].dataPoint.y + total;
            str = str.concat(str1);
        }
        str2 = "<strong>" + e.entries[0].dataPoint.label + "</strong> <br/>";
        str3 = "<span style = \"color:Tomato\">Totale: </span><strong>" + total + "</strong><br/>";
        return (str2.concat(str)).concat(str3);
    }
}
function toggleDataSeries(e)
{
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
    } else {
        e.dataSeries.visible = true;
    }
    e.chart.render();
}