var origineTabellaComposizioneLotto;

function importaDatiGea(button)
{
    document.getElementById("inputImportaFileGea").click();
}
async function importaFileGea(input)
{
    var buttons=document.getElementsByClassName("importaDatiButton");
    for (let index = 0; index < buttons.length; index++)
    {
        buttons[index].disabled=true;
    }
    var button=document.getElementById("importaDatiGeaButton");
    button.innerHTML='<span>Importazione in corso...</span><i class="fad fa-spinner-third fa-spin"></i>';

    Swal.fire
    ({
        width:"100%",
        background:"transparent",
        title:"Importazione in corso...",
        html:'<span id="importaDatiGeaProgress" style="color:white;margin-top:5px;display:block"></span><br><i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
        allowOutsideClick:false,
        showCloseButton:false,
        showConfirmButton:false,
        allowEscapeKey:false,
        showCancelButton:false,
        onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
    });
    
    var files = input.files;
    var nFiles=0;
    var errorsFiles=[];
    var uploadedFiles=[];
    var count=1;
    var countLength=files.length;
    var lotti=[];

    if(files.length>0)
    {
        for (var i = 0; i < files.length; i++)
        {
            document.getElementById("importaDatiGeaProgress").innerHTML="("+count+" / "+countLength+")";
            
            var file=files[i];
            var fileName=file.name;
            var format=fileName.split(".")[fileName.split(".").length-1];
            var fileSize_kb= file.size;
            var fileSize_mb=fileSize_kb/1000000;
            if(format.indexOf("txt")>-1)
            {
                if(fileSize_mb<90)
                {
                    var response=await uploadFile(file);
                    if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                    {
                        var errorFile=
                        {
                            file,
                            message:"Errore upload"
                        }
                        errorsFiles.push(errorFile);
                    }
                    else
                    {
                        var response2=await importaFile(fileName);
                        if(response2.toLowerCase().indexOf("error")>-1 || response2.toLowerCase().indexOf("notice")>-1 || response2.toLowerCase().indexOf("warning")>-1)
                        {
                            var errorFile=
                            {
                                file,
                                message:"Errore importazione"
                            }
                            errorsFiles.push(errorFile);
                        }
                        else
                        {
                            var lotto=JSON.parse(response2);
                            lotti.push(lotto);
                            nFiles++;
                            uploadedFiles.push(fileName);
                        }
                    }
                        
                }
                else
                {
                    var errorFile=
                    {
                        file,
                        message:"Errore. Dimensione massima 90MB"
                    }
                    errorsFiles.push(errorFile);
                }
            }
            else
            {
                var errorFile=
                {
                    file,
                    message:"Errore. Formato non valido"
                }
                errorsFiles.push(errorFile);
            }
            count++;
        }
        if(errorsFiles.length>0)
        {
            var outerContainer=document.createElement("div");
            outerContainer.setAttribute("style","display:flex;width:100%;flex-direction:column;align-items:center")

            errorsFiles.forEach(function(errorFile)
            {
                var div=document.createElement("div");
                div.setAttribute("style","margin-top:5px;width:100%;text-align:left;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;");
                div.innerHTML=errorFile.file.name + ": <b style='color:#DA6969'>" + errorFile.message + "</b>";
                outerContainer.appendChild(div);
            });

            Swal.fire
            ({
                icon: 'error',
                title: 'Non è stato possibile caricare tutti i file',
                html:outerContainer.outerHTML,
                showConfirmButton:false,
                showCloseButton:true
            });
        }
        if(nFiles>0)
        {
            Swal.fire
            ({
                icon:"success",
                title:"Dati importati",
                html:'<i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
                allowOutsideClick:true,
                showCloseButton:true,
                showConfirmButton:false,
                allowEscapeKey:true,
                showCancelButton:false,
                onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="black";}
            });

            button.style.color="#70B085";
            button.innerHTML='<span>Dati importati</span><i class="fad fa-check-circle"></i>';
            
            setTimeout(function()
            {
                var buttons=document.getElementsByClassName("importaDatiButton");
                for (let index = 0; index < buttons.length; index++)
                {
                    buttons[index].disabled=false;
                }
                button.style.color="";
                button.innerHTML='<span>Importa dati da Gea</span><i class="fad fa-file-import"></i>';
            }, 5000);    
        }
        else
        {
            button.style.color="#DA6969";
            button.innerHTML='<span>Nessun dato importato</span><i class="fad fa-exclamation-circle"></i>';
            
            setTimeout(function()
            {
                var buttons=document.getElementsByClassName("importaDatiButton");
                for (let index = 0; index < buttons.length; index++)
                {
                    buttons[index].disabled=false;
                }
                button.style.color="";
                button.innerHTML='<span>Importa dati da Gea</span><i class="fad fa-file-import"></i>';
            }, 5000);    
        }
        getElencoLotti();
    }
    else
    {
        var buttons=document.getElementsByClassName("importaDatiButton");
        for (let index = 0; index < buttons.length; index++)
        {
            buttons[index].disabled=false;
        }
        button.style.color="";
        button.innerHTML='<span>Importa dati da Gea</span><i class="fad fa-file-import"></i>';
    }
}
async function getElencoLotti()
{
    var container=document.getElementById("lottiContainer");
    container.innerHTML="";

    var table=document.createElement("table");
    table.setAttribute("id","tabellaLottiImportaDati");

    var tr=document.createElement("tr");
    tr.setAttribute("class","tableLottiHeaderRow");

    var th=document.createElement("th");
    th.setAttribute("style","border-top-left-radius:3px;border-bottom-left-radius:3px");
    th.innerHTML="Commessa";
    tr.appendChild(th);

    var th=document.createElement("th");
    th.setAttribute("style","display:flex;flex-direction:row;align-items:center;justify-content:flex-start");
    var span=document.createElement("span");
    span.innerHTML="Lotto";
    th.appendChild(span);
    var input=document.createElement("input");
    input.setAttribute("type","search");
    input.setAttribute("placeholder","Cerca...");
    input.setAttribute("onkeyup","cercaTabellaLotti(this)");
    input.setAttribute("onsearch","cercaTabellaLotti(this)");
    input.setAttribute("id","searchInputTabellaImportaDati");
    th.appendChild(input);
    tr.appendChild(th);

    var th=document.createElement("th");
    th.setAttribute("style","border-top-right-radius:3px;border-bottom-right-radius:3px");
    th.innerHTML="Producibile";
    tr.appendChild(th);

    table.appendChild(tr);

    var lotti=await getLotti("data_importazione","DESC");

    lotti.forEach(function(lotto)
    {
        var tr=document.createElement("tr");
        tr.setAttribute("class","tableLottiBodyRow");

        var td=document.createElement("td");
        td.setAttribute("style","border-top-right-radius:3px;border-bottom-right-radius:3px");
        td.innerHTML=lotto.commessa;
        tr.appendChild(td);

        var td=document.createElement("td");
        td.innerHTML=lotto.lotto;
        tr.appendChild(td);

        var td=document.createElement("td");
        td.setAttribute("style","border-top-right-radius:3px;border-bottom-right-radius:3px");
        var div=document.createElement("div");
        var checkbox=document.createElement("input");
        checkbox.setAttribute("type","checkbox");
        if(lotto.producibile.indexOf("true")>-1)
            checkbox.setAttribute("checked","checked");
        checkbox.setAttribute("onchange","checkProducibilitaLotto(this,"+lotto.id_lotto+",'"+lotto.lotto+"','"+lotto.commessa+"')");
        div.appendChild(checkbox);
        td.appendChild(div);
        tr.appendChild(td);

        table.appendChild(tr);
    });

    container.appendChild(table);
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
async function checkProducibilitaLotto(checkbox,id_lotto,lotto,commessa)
{
    if(!checkbox.checked)
        setProducibilitaLotto(checkbox.checked.toString(),lotto,commessa);
    else
    {
        Swal.fire
        ({
            width:"100%",
            background:"transparent",
            title:"Messa in produzione lotto "+lotto+" in corso...",
            html:'<span id="importaDatiGeaProgress" style="color:white;margin-top:5px;display:block"></span><br><i class="fad fa-spinner-third fa-spin fa-3x" style="color:white"></i>',
            allowOutsideClick:false,
            showCloseButton:false,
            showConfirmButton:false,
            allowEscapeKey:false,
            showCancelButton:false,
            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.fontWeight="bold";document.getElementsByClassName("swal2-title")[0].style.color="white";}
        });

        var pdf_mancanti=await checkPdfLotto(lotto,commessa);
        if(pdf_mancanti.length>0)
        {
            checkbox.checked=false;
            var outerContainer=document.createElement("div");
            outerContainer.setAttribute("style","display:flex;width:100%;flex-direction:column;align-items:center;max-height:500px;overflow:auto")

            pdf_mancanti.forEach(function(pdf_mancante)
            {
                var div=document.createElement("div");
                div.setAttribute("style","text-align:center;margin-top:5px;width:100%;");
                div.innerHTML=pdf_mancante.text;
                outerContainer.appendChild(div);
            });

            Swal.fire
            ({
                icon: 'error',
                title: 'Impossibile impostare il lotto come producibile',
                html:outerContainer.outerHTML,
                showConfirmButton:false,
                showCloseButton:true
            });
        }
        else
        {
            var composizione_lotto=await getComposizioneLotto(lotto,commessa);
            console.log(composizione_lotto)
            if(composizione_lotto.length>0)
            {
                origineTabellaComposizioneLotto="gea";

                var outerContainer=document.createElement("div");
                outerContainer.setAttribute("class","outer-container-composizione-lotto");

                var actionBar=document.createElement("div");
                actionBar.setAttribute("class","action-bar-composizione-lotto");

                var span=document.createElement("span");
                span.setAttribute("style","margin-left:10px");
                span.innerHTML='Composizione lotto '+lotto;
                actionBar.appendChild(span);

                var button=document.createElement("button");
                button.setAttribute("id","btnEsportaExcelComposizioneLotto");
                button.setAttribute("onclick","esportaExcelComposizioneLotto('"+lotto+"')");
                button.innerHTML="<span>Esporta</span><i style='margin-left:10px' class='fad fa-file-excel'></i>";
                actionBar.appendChild(button);

                outerContainer.appendChild(actionBar);

                var innerContainer=document.createElement("div");
                innerContainer.setAttribute("class","inner-container-composizione-lotto");

                var table=document.createElement("table");
                table.setAttribute("class","composizione-lotto-table");
                table.setAttribute("id","composizioneLottoTable");

                var thead=document.createElement("thead");
                
                var tr=document.createElement("tr");
                tr.setAttribute("style","box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);border-bottom:none;");

                var th=document.createElement("th");
                th.setAttribute("style","border-top-left-radius:3px;border-bottom-left-radius:3px");
                th.innerHTML="Codice carrello";
                tr.appendChild(th);

                var th=document.createElement("th");
                th.innerHTML="Numero cabina";
                tr.appendChild(th);

                var th=document.createElement("th");
                th.innerHTML="Codice cabina";
                tr.appendChild(th);

                var th=document.createElement("th");
                th.innerHTML="Codice componente";
                tr.appendChild(th);

                var th=document.createElement("th");
                th.innerHTML="Descrizione";
                tr.appendChild(th);

                var th=document.createElement("th");
                th.innerHTML="Posizione";
                tr.appendChild(th);

                var th=document.createElement("th");
                th.innerHTML="Quantità";
                tr.appendChild(th);

                var th=document.createElement("th");
                th.setAttribute("id","colonnaOrigineTabellaComposizioneLotto");
                th.setAttribute("title","Cambia...");
                th.setAttribute("onclick","filtraOrigineTabellaComposizioneLotto()");
                th.innerHTML="Origine (gea)";
                tr.appendChild(th);

                thead.appendChild(tr);

                table.appendChild(thead);

                var count=1;

                var tbody=document.createElement("tbody");

                composizione_lotto.forEach(function(materiale)
                {
                    var tr=document.createElement("tr");
                    if(count==composizione_lotto.length)
                        tr.setAttribute("style","border-bottom:1px solid transparent");

                    var td=document.createElement("td");
                    td.setAttribute("style","border-top-right-radius:3px;border-bottom-right-radius:3px");
                    td.innerHTML=materiale.codice_carrello;
                    tr.appendChild(td);

                    var td=document.createElement("td");
                    td.innerHTML=materiale.numero_cabina;
                    tr.appendChild(td);

                    var td=document.createElement("td");
                    td.innerHTML=materiale.codice_cabina;
                    tr.appendChild(td);

                    var td=document.createElement("td");
                    td.innerHTML=materiale.codice_componente;
                    tr.appendChild(td);

                    var td=document.createElement("td");
                    td.innerHTML=materiale.descrizione;
                    tr.appendChild(td);

                    var td=document.createElement("td");
                    td.innerHTML=materiale.posizione;
                    tr.appendChild(td);

                    var td=document.createElement("td");
                    td.innerHTML=materiale.qnt;
                    tr.appendChild(td);

                    var td=document.createElement("td");
                    td.setAttribute("style","border-top-right-radius:3px;border-bottom-right-radius:3px");
                    td.innerHTML=materiale.origine;
                    tr.appendChild(td);

                    tbody.appendChild(tr);

                    count++;
                });

                table.appendChild(tbody);

                innerContainer.appendChild(table);

                outerContainer.appendChild(innerContainer);

                Swal.fire
                ({
                    width:"80%",
                    background:"#404040",
                    html:outerContainer.outerHTML,
                    showConfirmButton:true,
                    showCancelButton:true,
                    onOpen:function ()
                    {
                        document.getElementsByClassName("swal2-title")[0].style.color="#bbb";

                        document.getElementsByClassName("swal2-confirm")[0].style.color="#bbb";
                        document.getElementsByClassName("swal2-confirm")[0].style.backgroundColor="rgb(75, 75, 75)";
                        document.getElementsByClassName("swal2-confirm")[0].style.boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)";
                        document.getElementsByClassName("swal2-confirm")[0].style.width="300px";
                        document.getElementsByClassName("swal2-confirm")[0].style.outline="none";       
                        document.getElementsByClassName("swal2-confirm")[0].style.fontSize="15px";       
                        document.getElementsByClassName("swal2-confirm")[0].style.borderRadius="3px";          
                        document.getElementsByClassName("swal2-confirm")[0].style.marginLeft="20px";    
                        document.getElementsByClassName("swal2-confirm")[0].style.marginRight="20px";                            

                        document.getElementsByClassName("swal2-cancel")[0].style.color="#bbb";
                        document.getElementsByClassName("swal2-cancel")[0].style.backgroundColor="rgb(75, 75, 75)";
                        document.getElementsByClassName("swal2-cancel")[0].style.boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)";
                        document.getElementsByClassName("swal2-cancel")[0].style.width="300px";       
                        document.getElementsByClassName("swal2-cancel")[0].style.outline="none";      
                        document.getElementsByClassName("swal2-cancel")[0].style.fontSize="15px";       
                        document.getElementsByClassName("swal2-cancel")[0].style.borderRadius="3px";   
                        document.getElementsByClassName("swal2-cancel")[0].style.marginLeft="20px";    
                        document.getElementsByClassName("swal2-cancel")[0].style.marginRight="20px"; 
                        
                        filtraOrigineTabellaComposizioneLotto();
                    },
                    confirmButtonText:"Rendi producibile",
                    cancelButtonText:"Annulla",
                    allowOutsideClick:true,
                    showCloseButton:false
                    //allowOutsideClick:false
                }).then(async function (result)
                {
                    if (result.value)
                    {
                        setProducibilitaLotto(checkbox.checked.toString(),lotto,commessa);

                        creaTabellaChecklist(lotto,commessa);

                        let timerInterval;
                        Swal.fire
                        ({
                            icon:"success",
                            title: "Lotto "+lotto+" producibile",
                            background:"#404040",
                            showCloseButton:false,
                            showConfirmButton:false,
                            allowOutsideClick:false,
                            timer: 2000,
                            timerProgressBar: true,
                            onOpen : function(){document.getElementsByClassName("swal2-title")[0].style.color="white";document.getElementsByClassName("swal2-title")[0].style.fontSize="14px";document.getElementsByClassName("swal2-close")[0].style.outline="none";},
                            onClose: () => {clearInterval(timerInterval)}
                        });
                    }
                    else
                        checkbox.checked=false;
                });
            }
            else
            {
                Swal.close();
                setProducibilitaLotto(checkbox.checked.toString(),lotto,commessa);
            }
        }
    }
}
function creaTabellaChecklist(lotto,commessa)
{
    $.post("creaTabellaChecklist.php",
    {
        lotto,
        commessa
    },
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
function esportaExcelComposizioneLotto(lotto)
{
    var fileName="composizione_lotto_"+lotto;

    var composizioneLottoTable=document.getElementById("composizioneLottoTable").cloneNode(true)

    var headerRow=composizioneLottoTable.getElementsByTagName("thead")[0].getElementsByTagName("tr")[0];
    var thead=composizioneLottoTable.getElementsByTagName("thead")[0];

    var newRow=document.createElement("tr");
    var ths=headerRow.getElementsByTagName("th");
    for (let index = 0; index < ths.length; index++)
    {
        const th = ths[index];
        var td=document.createElement("td");
        if(th.innerHTML=="Quantità")
            td.innerHTML="Quantita";
        else
            td.innerHTML=th.innerHTML;
        newRow.appendChild(td);
    }
    headerRow.remove();
    thead.appendChild(newRow);

    for (var i = 1, row; row = composizioneLottoTable.rows[i]; i++)
    {
        if(row.style.display=="none")
            row.innerHTML="";
    }

    console.log(composizioneLottoTable);

    var composizioneLottoTableString="<html>"+composizioneLottoTable.outerHTML+"</html>";

    var blob;
    var wb = {SheetNames:[], Sheets:{}};

    var ws1 = XLSX.read(composizioneLottoTableString, {type:"binary"}).Sheets.Sheet1;
    wb.SheetNames.push("composizione_lotto_"+lotto); 
    wb.Sheets["composizione_lotto_"+lotto] = ws1;

    blob = new Blob([s2ab(XLSX.write(wb, {bookType:'xlsx', type:'binary'}))],
    {
        type: "application/octet-stream"
    });

    saveAs(blob, fileName+".xlsx");
}
function s2ab(s)
{
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}
function filtraOrigineTabellaComposizioneLotto()
{
    switch (origineTabellaComposizioneLotto)
    {
        case "tutti":origineTabellaComposizioneLotto="gea";break;
        case "gea":origineTabellaComposizioneLotto="db_tecnico";break;
        case "db_tecnico":origineTabellaComposizioneLotto="tutti";break;
    }
    document.getElementById("colonnaOrigineTabellaComposizioneLotto").innerHTML="Origine ("+origineTabellaComposizioneLotto+")";
    var table=document.getElementById("composizioneLottoTable");
    for (var i = 1, row; row = table.rows[i]; i++)
    {
        if(origineTabellaComposizioneLotto=="tutti")
            row.style.display="";
        else
        {
            if(row.cells[7].innerHTML==origineTabellaComposizioneLotto)
                row.style.display="";
            else
                row.style.display="none";
        }
    }
}
function getComposizioneLotto(lotto,commessa)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getComposizioneLotto.php",
        {
            lotto,
            commessa
        },
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
function checkPdfLotto(lotto,commessa)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("checkPdfLotto.php",
        {
            lotto,
            commessa
        },
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
function setProducibilitaLotto(producibile,lotto,commessa)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("setProducibilitaLotto.php",
        {
            producibile,
            lotto,
            commessa
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
                }
            }
            else
            {
                if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire
                    ({
                        icon: 'error',
                        title: "Errore. Se il problema persiste contatta l' amministratore"
                    });
                }
            }
        });
    });
}
function importaFile(fileName)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("importaFile.php",
        {
            fileName
        },
        function(response, status)
        {
            if(status=="success")
            {
                resolve(response);
                //resolve(JSON.parse(response));
            }
            else
                reject({status});
        });
    });
}
function uploadFile(file)
{
    return new Promise(function (resolve, reject) 
    {
        var data= new FormData();
        data.append('file',file);
        $.ajax(
        {
            url:'uploadTxtGea.php',
            data:data,
            processData:false,
            contentType:false,
            type:'POST',
            success:function(response)
                {
                    resolve(response);
                }
        });
    });
}
function importaDatiDbTecnico(button)
{
    var buttons=document.getElementsByClassName("importaDatiButton");
    for (let index = 0; index < buttons.length; index++)
    {
        buttons[index].disabled=true;
    }
    var icon=button.getElementsByTagName("I")[0];
    var iconClass=icon.getAttribute("class");
    icon.setAttribute("class","fad fa-spinner-third fa-spin");

    /*$.get("importaDatiDbTecnico.php");
    Swal.fire
    ({
        icon: 'success',
        title: "Importazione avviata"
    });*/

    $.get("importaDatiDbTecnico.php",
    function(response, status)
    {
        console.log(status);
        if(status=="success")
        {
            console.log(response);
            for (let index = 0; index < buttons.length; index++)
            {
                buttons[index].disabled=false;
            }
            icon.setAttribute("class",iconClass);

            if(response.toLowerCase().indexOf("error")>-1 || response.toLowerCase().indexOf("notice")>-1 || response.toLowerCase().indexOf("warning")>-1)
            {
                Swal.fire
                ({
                    icon: 'error',
                    title: "Errore. Se il problema persiste contatta l' amministratore"
                });
            }
            else
            {
                if(response.indexOf("ko")>-1)
                {
                    Swal.fire
                    ({
                        icon: 'error',
                        title: "E' in corso un' altra importazione. Riprova in seguito"
                    });
                }
                else
                {
                    Swal.fire
                    ({
                        icon: 'success',
                        title: "Importazione avviata"
                    });
                }
            }
        }
        else
            console.log(status);
    });
}
function cercaTabellaLotti(input)
{
    var table=document.getElementById("tabellaLottiImportaDati");
    for (var i = 1, row; row = table.rows[i]; i++)
    {
        if(row.cells[1].innerHTML.toLowerCase().indexOf(input.value.toLowerCase())>-1)
            row.style.display="";
        else
            row.style.display="none";
    }
}