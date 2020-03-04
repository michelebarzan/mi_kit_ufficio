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
    button.innerHTML='<span>Importazione in corso...</span><i class="fad fa-spinner-third fa-spin"></i><div id="importaDatiGeaProgress"></div>';

    var containerElencoLotti=document.getElementById("lottiContainer")
    containerElencoLotti.innerHTML="";

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
                        console.log(fileName+"->"+response2+"\n\n");
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

                            /*if(nFiles==1)
                            {
                                var table=document.createElement("table");

                                var tr=document.createElement("tr");
                                tr.setAttribute("class","tableLottiHeaderRow");

                                var th=document.createElement("th");
                                th.setAttribute("style","border-top-left-radius:3px;border-bottom-left-radius:3px");
                                th.innerHTML="Commessa";
                                tr.appendChild(th);

                                var th=document.createElement("th");
                                th.innerHTML="Lotto";
                                tr.appendChild(th);

                                var th=document.createElement("th");
                                th.setAttribute("style","border-top-right-radius:3px;border-bottom-right-radius:3px");
                                th.innerHTML="Producibile";
                                tr.appendChild(th);

                                table.appendChild(tr);

                                container.appendChild(table);
                            }
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
                            checkbox.setAttribute("onchange","checkProducibilitaLotto(this,"+lotto.id_lotto+",'"+lotto.lotto+"','"+lotto.commessa+"')");
                            div.appendChild(checkbox);
                            td.appendChild(div);
                            tr.appendChild(td);

                            table.appendChild(tr);*/
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

    var tr=document.createElement("tr");
    tr.setAttribute("class","tableLottiHeaderRow");

    var th=document.createElement("th");
    th.setAttribute("style","border-top-left-radius:3px;border-bottom-left-radius:3px");
    th.innerHTML="Commessa";
    tr.appendChild(th);

    var th=document.createElement("th");
    th.innerHTML="Lotto";
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
    var container=checkbox.parentElement;
    var spinner=document.createElement("i");
    spinner.setAttribute("class","fad fa-spinner-third fa-spin");
    spinner.setAttribute("id","spinnerCheckProducibilitaLotto"+id_lotto);
    container.appendChild(spinner);

    if(!checkbox.checked)
    {
        var response=await setProducibilitaLotto(checkbox.checked.toString(),lotto,commessa);
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
        var response2=await checkPdfLotto(lotto,commessa);
        //console.log(response2);
        if(response2.toLowerCase().indexOf("error")>-1 || response2.toLowerCase().indexOf("notice")>-1 || response2.toLowerCase().indexOf("warning")>-1)
        {
            Swal.fire
            ({
                icon: 'error',
                title: "Errore. Se il problema persiste contatta l' amministratore"
            });
        }
        else
        {
            var pdf_mancanti=JSON.parse(response2);
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
                var response3=await getMaterialiAggiuntiviCarrello(lotto,commessa);
                if(response3.toLowerCase().indexOf("error")>-1 || response3.toLowerCase().indexOf("notice")>-1 || response3.toLowerCase().indexOf("warning")>-1)
                {
                    Swal.fire
                    ({
                        icon: 'error',
                        title: "Errore. Se il problema persiste contatta l' amministratore"
                    });
                }
                else
                {
                    var materiali_aggiuntivi_carrello=JSON.parse(response3);
                    //console.log(materiali_aggiuntivi_carrello)
                    if(materiali_aggiuntivi_carrello.length>0)
                    {
                        var outerContainer=document.createElement("div");
                        outerContainer.setAttribute("class","containerTableMaterialiAggiuntiviCarrello");

                        var table=document.createElement("table");
                        table.setAttribute("class","tableMaterialiAggiuntiviCarrello")

                        var tr=document.createElement("tr");
                        tr.setAttribute("class","tableCompletamentiHeaderRow");

                        var th=document.createElement("th");
                        th.setAttribute("style","border-top-left-radius:3px;border-bottom-left-radius:3px");
                        th.innerHTML="Tipo";
                        tr.appendChild(th);

                        var th=document.createElement("th");
                        th.innerHTML="Codice";
                        tr.appendChild(th);

                        var th=document.createElement("th");
                        th.innerHTML="N disegni";
                        tr.appendChild(th);

                        var th=document.createElement("th");
                        th.innerHTML="Completamento";
                        tr.appendChild(th);

                        var th=document.createElement("th");
                        th.innerHTML="Qnt";
                        tr.appendChild(th);

                        var th=document.createElement("th");
                        th.setAttribute("style","border-top-right-radius:3px;border-bottom-right-radius:3px");
                        th.innerHTML="Posizione";
                        tr.appendChild(th);

                        table.appendChild(tr);

                        var count=1;

                        materiali_aggiuntivi_carrello.forEach(function(materiale)
                        {
                            var tr=document.createElement("tr");
                            tr.setAttribute("class","tableCompletamentiBodyRow");
                            if(count==materiali_aggiuntivi_carrello.length)
                                tr.setAttribute("style","border-bottom:1px solid transparent");

                            var td=document.createElement("td");
                            td.setAttribute("style","border-top-right-radius:3px;border-bottom-right-radius:3px");
                            td.innerHTML=materiale.tipo;
                            tr.appendChild(td);

                            var td=document.createElement("td");
                            td.innerHTML=materiale.codice;
                            tr.appendChild(td);

                            var td=document.createElement("td");
                            td.innerHTML=materiale.n_disegni;
                            tr.appendChild(td);

                            var td=document.createElement("td");
                            td.innerHTML=materiale.completamento;
                            tr.appendChild(td);

                            var td=document.createElement("td");
                            td.innerHTML=materiale.qnt;
                            tr.appendChild(td);

                            var td=document.createElement("td");
                            td.setAttribute("style","border-top-right-radius:3px;border-bottom-right-radius:3px");
                            td.innerHTML=materiale.posizione;
                            tr.appendChild(td);

                            table.appendChild(tr);

                            count++;
                        });

                        outerContainer.appendChild(table);

                        Swal.fire
                        ({
                            icon: 'warning',
                            title: 'Trovati i seguenti materiali aggiuntivi nel lotto',
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
                            },
                            confirmButtonText:"Rendi producibile",
                            cancelButtonText:"Non rendere producibile",
                            allowOutsideClick:true,
                            showCloseButton:true
                            //allowOutsideClick:false
                        }).then(async function (result)
                        {
                            if (result.value)
                            {
                                var response4=await setProducibilitaLotto(checkbox.checked.toString(),lotto,commessa);
                                if(response4.toLowerCase().indexOf("error")>-1 || response4.toLowerCase().indexOf("notice")>-1 || response4.toLowerCase().indexOf("warning")>-1)
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
                                checkbox.checked=false;
                            }
                        });
                    }
                    else
                    {
                        var response4=await setProducibilitaLotto(checkbox.checked.toString(),lotto,commessa);
                        if(response4.toLowerCase().indexOf("error")>-1 || response4.toLowerCase().indexOf("notice")>-1 || response4.toLowerCase().indexOf("warning")>-1)
                        {
                            Swal.fire
                            ({
                                icon: 'error',
                                title: "Errore. Se il problema persiste contatta l' amministratore"
                            });
                        }
                    }
                }
            }
        }
    }

    document.getElementById("spinnerCheckProducibilitaLotto"+id_lotto).remove();
}
function getMaterialiAggiuntiviCarrello(lotto,commessa)
{
    return new Promise(function (resolve, reject) 
    {
        $.get("getMaterialiAggiuntiviCarrello.php",
        {
            lotto,
            commessa
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
                resolve(response);
            }
            else
                reject({status});
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
                resolve(response);
            }
            else
                reject({status});
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