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

    var actionBarItem=document.createElement("div");
    actionBarItem.setAttribute("class","action-bar-item");
    
    var span=document.createElement("span");
    span.setAttribute("style","margin-right:5px");
    span.setAttribute("class","action-bar-item-span");
    span.innerHTML="Lotto:";
    actionBarItem.appendChild(span);

    var selectLotto=document.createElement("select");
    selectLotto.setAttribute("style","margin-left:5px");
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
    var actionBar=document.getElementById("gestioneLineeActionBar");
    actionBar.innerHTML="";
    actionBarItem.appendChild(selectLotto);
    actionBar.appendChild(actionBarItem);

    var switchButton=document.createElement("button");
    switchButton.setAttribute("class","action-bar-button");
    switchButton.setAttribute("onclick","switchCodiceCabineCorridoiItemAll()");
    switchButton.innerHTML='<span>Numero cabina</span><i class="fad fa-repeat-alt" style="color:#4C91CB;margin-right: 5px;"></i><span>Disegno cabina</span>';
    actionBar.appendChild(switchButton);

    var mostraCarrelliButton=document.createElement("button");
    mostraCarrelliButton.setAttribute("class","action-bar-button");

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

    var raggruppaCarrelliButton=document.createElement("button");
    raggruppaCarrelliButton.setAttribute("class","action-bar-button");
    raggruppaCarrelliButton.setAttribute("onclick","raggruppaCarrelli()");
    raggruppaCarrelliButton.innerHTML='<span>Raggruppa carrelli</span><i class="fad fa-layer-group"></i>';
    actionBar.appendChild(raggruppaCarrelliButton);

    $("#selectLottoAssegnaCabineCorridoi").multipleSelect(
    {
        single:true,
        onAfterCreate: function () 
                {
                    $(".ms-choice").css({"height":"20px","line-height":"21px"});
                },
        onOpen:function()
        {
            $(".ms-search input").css({"font-family":"'Montserrat',sans-serif","font-size":"12px","text-align":"left"});
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

    gestioneLineeActionBar=document.getElementById("gestioneLineeActionBar");
    getFaSpinner(gestioneLineeActionBar,"gestioneLineeActionBar","Caricamento in corso...");

    var selectValue=$('#selectLottoAssegnaCabineCorridoi').multipleSelect('getSelects')[0];
    var commessa=selectValue.split("|")[0];
    var lotto=selectValue.split("|")[1];

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
            mostraCarrelli
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
            lineaOuterContainer.setAttribute("style","height:"+height+"px;margin-bottom:0px");
        else
            lineaOuterContainer.setAttribute("style","height:"+height+"px");

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
    removeFaSpinner("gestioneLineeActionBar");
    getTotaliLinee();
    if(mostraCarrelli)
        coloraCarrelli();
    selectLottoAssegnaCabineCorridoi.disabled=false;
}
function coloraCarrelli()
{
    var dirty_carrelli=carrelli;
    carrelli=[];
    $.each(dirty_carrelli, function(i, el){
        if($.inArray(el, carrelli) === -1) carrelli.push(el);
    });
    carrelli.forEach(function (carrello)
    {
        var colorObj=hexToRgb(getRandomColor());
        var color="rgba("+colorObj.r+","+colorObj.g+","+colorObj.b+",0.45)";
        var colorCarrello=
        {
            carrello,
            color
        };
        colorsCarrelli.push(colorCarrello);
    });
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
        id_linea,commessa,lotto,numero_cabina
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
        id_linea,commessa,lotto,numero_cabina
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
            mostraCarrelli
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
function anagraficaLinee(button)
{
    $("#gestioneLineeActionBar").show("fast","swing");
    $("#gestioneLineeActionBar").css({"display":"flex"});
    var actionBar=document.getElementById("gestioneLineeActionBar");
    actionBar.innerHTML="";
    
    var actionBarItem=document.createElement("div");
    actionBarItem.setAttribute("class","action-bar-item");

    var span=document.createElement("span");
    span.setAttribute("style","margin-right:5px");
    span.setAttribute("class","action-bar-item-span");
    span.innerHTML="Righe:";
    actionBarItem.appendChild(span);

    var span=document.createElement("span");
    span.setAttribute("id","rowsNumEditableTable");
    span.setAttribute("class","action-bar-item-span");
    span.setAttribute("style","font-weight:normal;color:black");
    span.innerHTML="0";
    actionBarItem.appendChild(span);
    
    actionBar.appendChild(actionBarItem);

    var actionBarItem=document.createElement("div");
    actionBarItem.setAttribute("class","action-bar-item");

    var buttonRipristina=document.createElement("button");
    buttonRipristina.setAttribute("class","action-bar-text-icon-button");
    buttonRipristina.setAttribute("onclick","resetFilters();getTable(selectetTable)");
    buttonRipristina.innerHTML='<span>Ripristina</span><i class="fal fa-filter"></i>';
    actionBarItem.appendChild(buttonRipristina);
    
    actionBar.appendChild(actionBarItem);

    getTable("anagrafica_linee");
}
function anagraficaStazioni(button)
{
    $("#gestioneLineeActionBar").show("fast","swing");
    $("#gestioneLineeActionBar").css({"display":"flex"});
    var actionBar=document.getElementById("gestioneLineeActionBar");
    actionBar.innerHTML="";
    
    var actionBarItem=document.createElement("div");
    actionBarItem.setAttribute("class","action-bar-item");

    var span=document.createElement("span");
    span.setAttribute("style","margin-right:5px");
    span.setAttribute("class","action-bar-item-span");
    span.innerHTML="Righe:";
    actionBarItem.appendChild(span);

    var span=document.createElement("span");
    span.setAttribute("id","rowsNumEditableTable");
    span.setAttribute("class","action-bar-item-span");
    span.setAttribute("style","font-weight:normal;color:black");
    span.innerHTML="0";
    actionBarItem.appendChild(span);
    
    actionBar.appendChild(actionBarItem);

    var actionBarItem=document.createElement("div");
    actionBarItem.setAttribute("class","action-bar-item");

    var buttonRipristina=document.createElement("button");
    buttonRipristina.setAttribute("class","action-bar-text-icon-button");
    buttonRipristina.setAttribute("onclick","resetFilters();getTable(selectetTable)");
    buttonRipristina.innerHTML='<span>Ripristina</span><i class="fal fa-filter"></i>';
    actionBarItem.appendChild(buttonRipristina);
    
    actionBar.appendChild(actionBarItem);

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
}
function editableTableLoad()
{

}