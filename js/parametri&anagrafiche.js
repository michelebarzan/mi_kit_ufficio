var keysMap=[{"key":"F1","keyCode":112},{"key":"F2","keyCode":113},{"key":"F3","keyCode":114},{"key":"F4","keyCode":115},{"key":"F5","keyCode":116},{"key":"F6","keyCode":117},{"key":"F7","keyCode":118},{"key":"F8","keyCode":119},{"key":"F9","keyCode":120},{"key":"F10","keyCode":121},{"key":"F11","keyCode":122},{"key":"F12","keyCode":123},{"key":"ArrowUp","keyCode":38},{"key":"7","keyCode":55},{"key":"8","keyCode":56},{"key":"9","keyCode":57},{"key":"a","keyCode":65},{"key":"b","keyCode":66},{"key":"c","keyCode":67},{"key":"Insert","keyCode":45},{"key":"Home","keyCode":36},{"key":"PageUp","keyCode":33},{"key":"Backspace","keyCode":8},{"key":"Control","keyCode":17},{"key":"Escape","keyCode":27},{"key":"Enter","keyCode":13},{"key":"+","keyCode":107},{"key":"*","keyCode":106},{"key":"ArrowLeft","keyCode":37},{"key":"ArrowDown","keyCode":40},{"key":"ArrowRight","keyCode":39},{"key":"4","keyCode":52},{"key":"5","keyCode":53},{"key":"6","keyCode":54},{"key":"d","keyCode":68},{"key":"e","keyCode":69},{"key":"f","keyCode":70},{"key":"Delete","keyCode":46},{"key":"End","keyCode":35},{"key":"PageDown","keyCode":34},{"key":"Tab","keyCode":9},{"key":"Alt","keyCode":18},{"key":" ","keyCode":32},{"key":"-","keyCode":109},{"key":".","keyCode":190},{"key":"/","keyCode":111},{"key":"0","keyCode":48},{"key":"1","keyCode":49},{"key":"2","keyCode":50},{"key":"3","keyCode":51}];
var ready=false;
var keyPressed=null;
var array_funzioni_tasti;
var hot;
var view;
var newRowWBtn=false;

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
    $("#parametriAnagraficheActionBar").hide("fast","swing");
    var container=document.getElementById("parametriAnagraficheInnerContainer");
    container.innerHTML="";

    $("#parametriAnagraficheInnerContainer").css
    ({
        "flex-wrap": "",
        "align-items": "",
        "justify-content": "",
        "min-height": "",
        "height": ""
    });
}
function getParametri(button)
{
    newRowWBtn=false;

    view="parametri";

    $("#parametriAnagraficheActionBar").show("fast","swing");
    $("#parametriAnagraficheActionBar").css({"display":"flex"});
    var actionBar=document.getElementById("parametriAnagraficheActionBar");
    actionBar.innerHTML="";
    
    /*var actionBarItem=document.createElement("div");
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
    
    actionBar.appendChild(buttonRipristina);*/

    /*<button class="rcb-button-text-icon" onclick="esportaTabellaPieghe()"><span>Esporta</span><i style="margin-left: 5px;" class="fad fa-file-excel"></i></button>
	<button class="rcb-button-text-icon" onclick="aggiungiRigaHot()"><span>Aggiungi Riga</span><i style="margin-left: 5px;font-size:15px" class="fad fa-plus-circle"></i></button>*/

    var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("onclick","aggiungiRigaHot();");
    button.innerHTML='<span>Aggiungi Riga</span><i style="margin-left:5px;font-size:15px" class="fad fa-plus-circle"></i>';
    
    actionBar.appendChild(button);

    getHot("parametri");
}
function getTable(table,orderBy,orderType)
{
    if(table=="parametri")
    {
        getEditableTable
        ({
            table:'parametri',
            editable: true,
            container:'parametriAnagraficheInnerContainer',
            readOnlyColumns:['id_parametro'],
            noInsertColumns:['id_parametro'],
            orderBy:orderBy,
            orderType:orderType
        });
    }
    if(table=="view_mappatura_tasti")
    {
        getEditableTable
        ({
            primaryKey:"Codice tasto",
            table:'view_mappatura_tasti',
            editable: false,
            container:'riepilogoTastiAssegnatiTableContainer',
            orderBy:orderBy,
            orderType:orderType
        });
    }
}
function editableTableLoad()
{
    if(selectetTable=="view_mappatura_tasti")
    {
        $(".btnFilter").hide();
    }
}
async function configurazioneTastierino()
{
    view=="configurazione_tastierino";
    array_funzioni_tasti=await getArrayFunzioniTasti();
	console.log(array_funzioni_tasti);

    $("#parametriAnagraficheActionBar").show("fast","swing");
    $("#parametriAnagraficheActionBar").css({"display":"flex"});
    var actionBar=document.getElementById("parametriAnagraficheActionBar");
    actionBar.innerHTML="";

    $("#parametriAnagraficheInnerContainer").css
    ({
        "flex-wrap": "wrap",
        "align-items": "flex-start",
        "justify-content": "flex-start",
        "min-height": "0px",
        "height": "auto"
    });
    
    /*var actionBarItem=document.createElement("div");
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
    
    actionBar.appendChild(actionBarItem);*/

    var buttonRegistra=document.createElement("button");
    buttonRegistra.setAttribute("class","rcb-button-text-icon");
    buttonRegistra.setAttribute("id","buttonRegistra");
    buttonRegistra.setAttribute("onclick","startKeyRecord()");
    buttonRegistra.innerHTML='<span>Registra funzione</span><i style="margin-left:5px" class="fad fa-compact-disc"></i>';
    
    actionBar.appendChild(buttonRegistra);

    var parametriAnagraficheInnerContainer=document.getElementById("parametriAnagraficheInnerContainer");
    parametriAnagraficheInnerContainer.innerHTML="";

    var keyboadChassis=document.createElement("div");
    keyboadChassis.setAttribute("id","keyboadChassis");

    var rowKey=document.createElement("div");
    rowKey.setAttribute("class","keyboard-row-key");

    var keycode=112;
    for (let index = 1; index < 13; index++)
    {
        var key=document.createElement("button");
        key.setAttribute("class","keyboard-key function-key");
        key.setAttribute("onclick","setKeyPressed("+keycode+")");
        key.innerHTML="F"+index;
        rowKey.appendChild(key);
        keycode++;
    }

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key action-key");
    key.setAttribute("style","margin-left:15px");
    key.setAttribute("onclick","setKeyPressed(38)");
    key.innerHTML="<i style='font-size:15px' class='fas fa-arrow-alt-up'></i>";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key letter-number-key");
    key.setAttribute("style","margin-left:47.5px");
    key.setAttribute("onclick","setKeyPressed(55)");
    key.innerHTML="7";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key letter-number-key");
    key.setAttribute("onclick","setKeyPressed(56)");
    key.innerHTML="8";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key letter-number-key");
    key.setAttribute("onclick","setKeyPressed(57)");
    key.innerHTML="9";
    rowKey.appendChild(key);

    keyboadChassis.appendChild(rowKey);

    var rowKey=document.createElement("div");
    rowKey.setAttribute("class","keyboard-row-key");

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key letter-number-key");
    key.setAttribute("onclick","setKeyPressed(65)");
    key.innerHTML="A";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key letter-number-key");
    key.setAttribute("onclick","setKeyPressed(66)");
    key.innerHTML="B";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key letter-number-key");
    key.setAttribute("onclick","setKeyPressed(67)");
    key.innerHTML="C";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key action-key");
    key.setAttribute("onclick","setKeyPressed(45)");
    key.innerHTML="INS";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key action-key");
    key.setAttribute("onclick","setKeyPressed(36)");
    key.innerHTML="HOME";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key action-key");
    key.setAttribute("onclick","setKeyPressed(33)");
    key.innerHTML="PgUp";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key action-key");
    key.setAttribute("onclick","setKeyPressed(8)");
    key.innerHTML="BKS";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key action-key");
    key.setAttribute("onclick","setKeyPressed(17)");
    key.innerHTML="CTRL";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key action-key");
    key.setAttribute("style","width:75px");
    key.setAttribute("onclick","setKeyPressed(27)");
    key.innerHTML="ESC";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key action-key");
    key.setAttribute("style","outline:none;height:42.5px;border-radius:0px;margin-bottom:0px;border-bottom:none;border-top-left-radius:4px;border-top-right-radius:4px");
    key.setAttribute("onclick","setKeyPressed(13)");
    key.innerHTML="<i class='far fa-horizontal-rule' style='margin-bottom:-10px;margin-left:13px;transform: rotate(90deg);font-size:23px'></i>";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key letter-number-key");
    key.setAttribute("onclick","setKeyPressed(107)");
    key.innerHTML="+";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key letter-number-key");
    key.setAttribute("style","margin-left:47.5px");
    key.setAttribute("onclick","setKeyPressed(106)");
    key.innerHTML="*";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key action-key");
    key.setAttribute("style","margin-left:10px");
    key.setAttribute("onclick","setKeyPressed(37)");
    key.innerHTML="<i style='font-size:15px' class='fas fa-arrow-alt-left'></i>";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key action-key");
    key.setAttribute("onclick","setKeyPressed(40)");
    key.innerHTML="<i style='font-size:15px' class='fas fa-arrow-alt-down'></i>";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key action-key");
    key.setAttribute("onclick","setKeyPressed(39)");
    key.innerHTML="<i style='font-size:15px' class='fas fa-arrow-alt-right'></i>";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key letter-number-key");
    key.setAttribute("onclick","setKeyPressed(52)");
    key.innerHTML="4";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key letter-number-key");
    key.setAttribute("onclick","setKeyPressed(53)");
    key.innerHTML="5";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key letter-number-key");
    key.setAttribute("onclick","setKeyPressed(54)");
    key.innerHTML="6";
    rowKey.appendChild(key);

    keyboadChassis.appendChild(rowKey);

    var rowKey=document.createElement("div");
    rowKey.setAttribute("class","keyboard-row-key");

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key letter-number-key");
    key.setAttribute("onclick","setKeyPressed(68)");
    key.innerHTML="D";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key letter-number-key");
    key.setAttribute("onclick","setKeyPressed(69)");
    key.innerHTML="E";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key letter-number-key");
    key.setAttribute("onclick","setKeyPressed(70)");
    key.innerHTML="F";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key action-key");
    key.setAttribute("onclick","setKeyPressed(46)");
    key.innerHTML="DEL";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key action-key");
    key.setAttribute("onclick","setKeyPressed(35)");
    key.innerHTML="END";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key action-key");
    key.setAttribute("onclick","setKeyPressed(34)");
    key.innerHTML="PgDn";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key action-key");
    key.setAttribute("onclick","setKeyPressed(9)");
    key.innerHTML="TAB";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key action-key");
    key.setAttribute("onclick","setKeyPressed(18)");
    key.innerHTML="ALT";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key action-key");
    key.setAttribute("style","width:75px");
    key.setAttribute("onclick","setKeyPressed(32)");
    key.innerHTML="SPACE";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key action-key");
    key.setAttribute("style","outline:none;display:flex;flex-direction:column;height:42.5px;border-radius:0px;margin-top:0px;border-top:none;border-bottom-left-radius:4px;border-bottom-right-radius:4px");
    key.setAttribute("onclick","setKeyPressed(13)");
    key.innerHTML="<i class='far fa-horizontal-rule' style='margin-bottom:-5px;margin-left:13px;transform: rotate(90deg);font-size:23px'></i><i class='fas fa-level-down-alt' style='margin-left:15px;transform: rotate(90deg);font-size:17px'></i>";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key letter-number-key");
    key.setAttribute("onclick","setKeyPressed(109)");
    key.innerHTML="-";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key letter-number-key");
    key.setAttribute("onclick","setKeyPressed(190)");
    key.innerHTML=".";
    rowKey.appendChild(key);
    
    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key letter-number-key");
    key.setAttribute("onclick","setKeyPressed(111)");
    key.innerHTML="/";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("style","margin-left:10px;width:85px");
    key.setAttribute("class","keyboard-key letter-number-key");
    //key.setAttribute("onclick","setKeyPressed('')");
    key.innerHTML="";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key letter-number-key");
    key.setAttribute("onclick","setKeyPressed(48)");
    key.innerHTML="0";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key letter-number-key");
    key.setAttribute("onclick","setKeyPressed(49)");
    key.innerHTML="1";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key letter-number-key");
    key.setAttribute("onclick","setKeyPressed(50)");
    key.innerHTML="2";
    rowKey.appendChild(key);

    var key=document.createElement("button");
    key.setAttribute("class","keyboard-key letter-number-key");
    key.setAttribute("onclick","setKeyPressed(51)");
    key.innerHTML="3";
    rowKey.appendChild(key);

    keyboadChassis.appendChild(rowKey);

    var rowKey=document.createElement("div");
    rowKey.setAttribute("class","keyboard-row-key");
    keyboadChassis.appendChild(rowKey);

    var rowKey=document.createElement("div");
    rowKey.setAttribute("class","keyboard-row-key");
    keyboadChassis.appendChild(rowKey);

    parametriAnagraficheInnerContainer.appendChild(keyboadChassis);

    var keyPressedInfo=document.createElement("div");
    keyPressedInfo.setAttribute("id","keyPressedInfoContainer");

    parametriAnagraficheInnerContainer.appendChild(keyPressedInfo);

    var riepilogoTastiAssegnatiTableContainer=document.createElement("div");
    riepilogoTastiAssegnatiTableContainer.setAttribute("id","riepilogoTastiAssegnatiTableContainer");

    parametriAnagraficheInnerContainer.appendChild(riepilogoTastiAssegnatiTableContainer);

    var span=document.createElement("span");
    span.setAttribute("id","rowsNumEditableTable");
    span.setAttribute("style","display:none");
    actionBar.appendChild(span);

    getTable("view_mappatura_tasti");

    var keyboardKeys=document.getElementsByClassName("keyboard-key");
    var enterCount=0;
    for (let index = 0; index < keyboardKeys.length; index++)
    {
        const keyboardKey = keyboardKeys[index];

        var onclick=keyboardKey.getAttribute("onclick");

        if(onclick!=null)
        {
            onclick=onclick.replace("setKeyPressed(","");
            var keyCode=parseInt(onclick.replace(")",""));

            var funzione_tasto=getFirstObjByPropValue(array_funzioni_tasti,"keyCode",keyCode);
            if(funzione_tasto!=undefined)
            {
                keyboardKey.style.border="2px solid "+funzione_tasto.color;
            }
            else
            {
                keyboardKey.style.border="2px solid #70B085";
            }
            if(keyCode==13)
            {
                if(enterCount==0)
                {
                    keyboardKey.style.borderBottom="none";
                    enterCount++;
                }
                else
                    keyboardKey.style.borderTop="none";
            }
        }
    }
}
window.addEventListener("click", function(event)
{
	try {
		if(event.target.className.indexOf("keyboard-key")>-1 || 
		   event.target.parentElement.className.indexOf("keyboard-key")>-1 || 
		   event.target.id=="selectFunzioneTastoAssegnaCabineCorridoi" || 
		   event.target.id=="buttonConferma" || 
		   event.target.parentElement.id=="selectFunzioneTastoAssegnaCabineCorridoi" || 
		   event.target.parentElement.id=="buttonConferma" || 
		   event.target.className.indexOf("swal")>-1)
		{
			//console.log("non cancello");
		}
		else
		{
			
				document.getElementById('keyPressedInfoContainer').innerHTML='';
				keyPressed=null;
			
		}
	} catch (error) {}
});
window.addEventListener("keydown", function(event)
{
    if(view=="configurazione_tastierino")
    {
        event.preventDefault();
        var keyCode=event.keyCode;
        try {
            setKeyPressed(keyCode);
        } catch (error) {}
    }
});
async function setKeyPressed(keyCode)
{
    var keyPressedInfoContainer=document.getElementById("keyPressedInfoContainer");
    keyPressedInfoContainer.innerHTML="";

    var label=document.createElement("div");
    label.setAttribute("class","key-pressed-info");
    label.innerHTML="Codice tasto: <b>"+keyCode+"</b>";
    keyPressedInfoContainer.appendChild(label);

    var key="Tasto non riconosciuto";
    for (let index = 0; index < keysMap.length; index++)
    {
        const element = keysMap[index];
        if(element.keyCode==keyCode)
            key=element.key;
    }

    try {
        document.getElementById("labelPremiUnTasto").innerHTML=key;
    } catch (error) {}

    var label=document.createElement("div");
    label.setAttribute("class","key-pressed-info");
    label.innerHTML="Nome tasto: <b id='labelNomeTasto'>"+key+"</b>";
    keyPressedInfoContainer.appendChild(label);

    var label=document.createElement("div");
    label.setAttribute("class","key-pressed-info");
    var funzione_tasto=await getFunzioneTasto(keyCode);
    if(funzione_tasto==null)
        label.innerHTML="Funzione assegnata: <b style='color:#70B085'>Nessuna</b>";
    else
        label.innerHTML="Funzione assegnata: <b style='color:#E9A93A'>"+funzione_tasto.funzione+"</b>";
    keyPressedInfoContainer.appendChild(label);

    if(ready)
    {
        var funzione=document.getElementById("selectFunzioneTastoAssegnaCabineCorridoi").value;
        keyPressed=
        {
            "keyCode":keyCode,
            "key":key,
            "funzione":funzione
        };
    }
}
function getFunzioneTasto(keyCode)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getFunzioneTasto.php",
        {
            keyCode
        },
        function(response, status)
        {
            if(status=="success")
            {
                try {
                    resolve(JSON.parse(response));
                } catch (error) {
                    resolve(null);
                }
            }
            else
                reject({status});
        });
    });
}
async function startKeyRecord()
{
    document.getElementById("buttonRegistra").style.display="none";

    var actionBar=document.getElementById("parametriAnagraficheActionBar");

    var actionBarItem=document.createElement("div");
    actionBarItem.setAttribute("class","rcb-select-container");

    var buttonAnnulla=document.createElement("button");
    buttonAnnulla.setAttribute("class","rcb-button-text-icon");
    buttonAnnulla.setAttribute("id","buttonAnnulla");
    buttonAnnulla.setAttribute("onclick","ready=false;configurazioneTastierino();keyPressed=null");
    buttonAnnulla.innerHTML='<span>Annulla</span><i style="margin-left:5px" class="fad fa-undo"></i>';
    actionBar.appendChild(buttonAnnulla);

    var buttonConferma=document.createElement("button");
    buttonConferma.setAttribute("class","rcb-button-text-icon");
    buttonConferma.setAttribute("id","buttonConferma");
    buttonConferma.setAttribute("onclick","confermaTasto()");
    buttonConferma.innerHTML='<span>Conferma</span><i style="margin-left:5px" class="fad fa-save"></i>';
    actionBar.appendChild(buttonConferma);

    var selectFunzioneTasto=document.createElement("select");
    selectFunzioneTasto.setAttribute("onchange","$('#labelPremiUnTasto').show('fast','swing');ready=true;");
    selectFunzioneTasto.setAttribute("id","selectFunzioneTastoAssegnaCabineCorridoi");

    var option=document.createElement("option");
    option.setAttribute("value","");
    option.setAttribute("disabled","disabled");
    option.setAttribute("selected","selected");
    option.innerHTML="Seleziona funzione";
    selectFunzioneTasto.appendChild(option);

    array_funzioni_tasti.forEach(function (funzione)
    {
        var option=document.createElement("option");
        option.setAttribute("value",funzione.nome);
        option.setAttribute("style","color:"+funzione.color);
        option.innerHTML=funzione.nome;
        selectFunzioneTasto.appendChild(option);
    });
    
    actionBarItem.appendChild(selectFunzioneTasto);
    actionBar.appendChild(actionBarItem);

    var actionBarItem=document.createElement("div");
    actionBarItem.setAttribute("class","rcb-text-container");
    actionBarItem.setAttribute("id","labelPremiUnTasto");
    actionBarItem.setAttribute("style","display:none;background-color:transparent;text-decoration:underline");
    actionBarItem.innerHTML="Premi un tasto";
    actionBar.appendChild(actionBarItem);
}
function getArrayFunzioniTasti()
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getArrayFunzioniTasti.php",
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
async function confermaTasto()
{
    if(keyPressed!==null)
    {
        if(document.getElementById("labelNomeTasto").innerHTML=="Tasto non riconosciuto")
        {
            Swal.fire
            ({
                icon: 'error',
                title:"Tasto non riconosciuto",
                background:"#353535",
                onOpen : function()
                        {
                            document.getElementById("swal2-title").style.color="#ddd";
                            document.getElementById("swal2-title").style.fontWeight="normal";
                            document.getElementsByClassName("swal2-close")[0].style.outline="none";
                        },
                showConfirmButton:false,
                showCloseButton:true
            });
        }
        else
        {
            var funzione_tasto=await getFunzioneTasto(keyPressed.keyCode);
            if(funzione_tasto==null)
            {
                registraFunzioneTasto();
            }
            else
            {
                Swal.fire
                ({
                    icon: 'warning',
                    title:"E' gia stata assegnata una funzione al tasto",
                    background:"#353535",
                    onOpen : function()
                            {
                                document.getElementById("swal2-title").style.color="#ddd";
                                document.getElementById("swal2-title").style.fontWeight="normal";
                                document.getElementsByClassName("swal2-close")[0].style.outline="none";
                            },
                    showConfirmButton:true,
                    showCancelButton:true,
                    confirmButtonText:"Sovrascrivi",
                    cancelButtonText:"Annulla",
                }).then((result) => 
                {
                    if (result.value)
                    {
                        registraFunzioneTasto();
                    }
                });
            }
        }
    }
}
function registraFunzioneTasto()
{
    //var JSONkeyPressed=JSON.stringify(keyPressed);
    $.get("registraFunzioneTasto.php",
    {
        key:keyPressed.key,
        keyCode:keyPressed.keyCode,
        funzione:keyPressed.funzione
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
            else
            {
                Swal.fire
                ({
                    icon:"success",
                    background:"#353535",
                    onOpen : function()
                            {
                                document.getElementById("swal2-title").style.color="#ddd";
                                document.getElementById("swal2-title").style.fontWeight="normal";
                                document.getElementsByClassName("swal2-close")[0].style.outline="none";
                            },
                    title: 'Funzione tasto registrata',
                    timer: 2000,
                    timerProgressBar: true,
                    showCloseButton:true,
                    showConfirmButton:false
                }).then((result) => 
                {
                    ready=false;
                    configurazioneTastierino();
                    keyPressed=null;
                });
            }
        }
    });
}
function getMascheraCorrispondenzaCommesse(button)
{
    newRowWBtn=false;

    view="corrispondenzaCommesse";

    $("#parametriAnagraficheActionBar").show("fast","swing");
    $("#parametriAnagraficheActionBar").css({"display":"flex"});
    var actionBar=document.getElementById("parametriAnagraficheActionBar");
    actionBar.innerHTML="";
    
    /*var actionBarItem=document.createElement("div");
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
    
    actionBar.appendChild(buttonRipristina);*/

    var button=document.createElement("button");
    button.setAttribute("class","rcb-button-text-icon");
    button.setAttribute("onclick","aggiungiRigaHot();");
    button.innerHTML='<span>Aggiungi Riga</span><i style="margin-left:5px;font-size:15px" class="fad fa-plus-circle"></i>';
    
    actionBar.appendChild(button);

    getHot("corrispondenza_commesse");
}
async function getHot(table)
{
    var container = document.getElementById('parametriAnagraficheInnerContainer');
    container.innerHTML="";

    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Caricamento in corso...",
        html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });

    var response=await getHotData(table);

    Swal.close();

    var height=document.documentElement.offsetHeight;
	height-=300;

    if(response.data.length>0)
    {
		if(hot!=undefined)
			hot.destroy();
        hot = new Handsontable
        (
            container,
            {
                data: response.data,
                rowHeaders: true,
                manualColumnResize: true,
                colHeaders: response.colHeaders,
                className: "htMiddle",
                filters: true,
                dropdownMenu: true,
                headerTooltips: true,
                language: 'it-IT',
                contextMenu: true,
                width:"100%",
                columnSorting: true,
                height,
                columns:response.columns,
                afterChange: (changes) =>
                {
                    if(changes!=null)
                    {
                        changes.forEach(([row, prop, oldValue, newValue]) =>
                        {
                            if(prop!=response.primaryKey)
                            {
                                var id=hot.getDataAtCell(row, 0);
                                aggiornaRigaHot(id,prop,newValue,table,response.primaryKey);
                            }
                        });
                    }
                },
                afterCreateRow: (index,amount,source) =>
                {
                    if(!newRowWBtn)
                        creaRigaHot(index,table,response.primaryKey);
                    else
                        newRowWBtn=false;
                },
                beforeRemoveRow: (index,amount,physicalRows,source)  =>
                {
                    for (let i = 0; i < physicalRows.length; i++)
                    {
                        const indice = physicalRows[i];
                        var id=hot.getDataAtCell(indice, 0);
                        eliminaRigaHot(id,table,response.primaryKey);
                    }
                }
            }
        );
        document.getElementById("hot-display-license-info").remove();
        $(".handsontable .changeType").css
        ({
            "background": "#eee",
            "border-radius": "0",
            "border": "none",
            "color": "#404040",
            "font-size": "14px",
            "line-height": "normal",
            "padding": "0px",
            "margin": "0px",
            "float": "right"
        });
    }
}
function aggiornaRigaHot(id,colonna,valore,table,primaryKey)
{
    $.get("aggiornaRigaHot.php",{id,colonna,valore,table,primaryKey},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
        }
    });
}
function creaRigaHot(index,table,primaryKey)
{
    console.log("salsiccia");
    $.get("creaRigaHot.php",{table,primaryKey},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
            else
                hot.setDataAtCell(index, 0, response);
        }
    });
}
function eliminaRigaHot(id,table,primaryKey)
{
    $.get("eliminaRigaHot.php",{id,table,primaryKey},
    function(response, status)
    {
        if(status=="success")
        {
            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                console.log(response);
            }
        }
    });
}
function getHotData(table)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getHotData.php",{table},
        function(response, status)
        {
            if(status=="success")
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                    console.log(response);
                    resolve([]);
                }
                else
                {
                    try {
                        resolve(JSON.parse(response));
                    } catch (error) {
                        Swal.fire({icon:"error",title: "Errore. Se il problema persiste contatta l' amministratore",onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="gray";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";}});
                        console.log(response);
                        resolve([]);
                    }
                }
            }
        });
    });
}
function aggiungiRigaHot()
{
    if(view=="corrispondenzaCommesse")
        creaRigaHot(hot.countRows(),"corrispondenza_commesse","id_commessa");

    if(view=="parametri")
        creaRigaHot(hot.countRows(),"parametri","id_parametro");

    newRowWBtn=true;
}