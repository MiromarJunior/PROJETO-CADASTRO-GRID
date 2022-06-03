import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiProdutosService, { dataFormatadaInput, updateListaProd } from "../../Service/produtoService";
import { AgGridReact } from 'ag-grid-react';
import { dataBR, valorBR } from "../../Service/utilService";


let rowImmutableStore;

function ListarProdutos(){




    

    const ButtonDelete = p =>{
            const deleteP = useCallback(()=> deletarProduto(p.data.PRDT_ID)  );
            return(<button onClick={deleteP}>DELETE</button> )
    }
    const CorBotao = p =>{       
        return(<div className="corFont">{p.value}</div> )
}



//     const InputData = p =>{
//         const dataInput = useCallback(()=> (p.data.PRDT_DT_VALIDADE)  );
//         return(<input placeholder={dataFormatadaInput(p.data.PRDT_DT_VALIDADE)} type={"date"} /> )
// }
    
    

    const deletarProduto = useCallback((id)=>{
        let dados = {id};
        if(window.confirm("deseja excluir o item ?") ){                   
            apiProdutosService.deleteProduto(dados)
            .then((res)=>{
                alert(res.data); 
                buscarProdutos(); 
            })
            .catch((res)=>{
                console.log(res);
            })
        }  
    
    });
    

    const [listaProdutos, setListaProdutos] = useState([]);
    const [rowData, setRowData] = useState();
 
    const navigate = useNavigate();
    const [columnDefs, setColumnDefs] = useState([
        {field: 'PRDT_ID', filter: true, headerName : "ID",editable : false, cellRenderer : CorBotao},
        {field: 'PRDT_DESCRICAO', filter: true,headerName : "DESCRIÇÃO"},
        {field: 'PRDT_CODIGO', filter: true, headerName : "CÓDIGO"},
        {field: 'PRDT_VALOR', filter: true, headerName : "VALOR", pinned : " right",
        valueFormatter : p=>{
            return valorBR(p.data.PRDT_VALOR)
        }
    
    },
        {field: 'PRDT_DT_VALIDADE', filter: true, headerName : "DATA VALIDADE",editable : true,
        
        
        // valueGetter : params=>{
        //     return dataBR(params.data.PRDT_DT_VALIDADE);
           
        // }
    
    }, {field: 'EXCLUIR', filter: true, headerName : "EXCLUIR",cellRenderer : ButtonDelete,editable : false,
    //   valueGetter : params=>{
    //         return n;
           
    //     }


},
      
      ]);

    const defaultColDef = useMemo(()=>({
        sortable : true,
        editable : true,
        resizable : true,
        flex : 1
    }),[]);

    const getRowId = useCallback((params) => params.data.id, []);
    const onCellEditRequest = useCallback(
        (e)=>{
            const data = e.data;
            const field = e.colDef.field;
            const newValue = e.newValue;
            const newItem = {...data};
            newItem[field] = e.newValue;
            console.log('onCellEditRequest, updating ' + field + ' to ' + newValue);
            rowImmutableStore = rowImmutableStore.map((oldItem)=>oldItem.id == newItem.id ? newItem : oldItem);
            setRowData(rowImmutableStore);
        },
        [rowImmutableStore]
    );

    // const cellClickedListener = useCallback(e=>{       
    //     console.log("celulaSelecionada",e.data.PRDT_VALOR);
    // },[]);


    useEffect(() => {
        buscarProdutos();
      
    }, []);



    function buscarProdutos(){
        apiProdutosService.getProdutos()
        .then((res)=>{
            setListaProdutos(res.data); 
            (res.data).forEach((item, index)=>(item.id = index));
            rowImmutableStore = res.data;
            setRowData(rowImmutableStore); 
        })
        .catch((res)=>{
            console.log(res);
        })
    }
    const updateProdutos = ()=>{          
        let dados = {lista : rowData};
        updateListaProd(dados)
        .then((res)=>{
            alert(res.data)
            buscarProdutos();

        })
        .catch((err)=>{
            console.error("erro ao ataulizar",err)
        })
    }

// function deletarProduto(id){
//     let dados = {id};
//     if(window.confirm("deseja excluir o item ?") ){
       
//         apiProdutosService.deleteProduto(dados)
//         .then((res)=>{
//             alert(res.data); 
//             buscarProdutos(); 
//         })
//         .catch((res)=>{
//             console.log(res);
//         })
//     }  

// }

return(
    <div>        
         
        <h1>Listar Produtos</h1>

        <div className="centralizar">
        <button onClick={()=>navigate("/")}  > HOME</button>
        <button onClick={()=>navigate("/cadastrarProdutos/0")}  > CADASTRAR</button>
        <button onClick={(e)=>updateProdutos(e)}  > SALVAR PRODUTOS</button>
        </div>  
        <div id="myGrid" className="ag-theme-alpine" style={{width : "100%", height : 400}}>
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}  
                getRowId={getRowId}  
                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                rowSelection='multiple' // Options - allows click selection of rows
               // onCellClicked={cellClickedListener} // Optional - registering for Grid Event
                pagination={true}
                enableRangeSelection={true}
                paginationPageSize={10}    
                editType={'fullRow'}            
                paginationAutoPageSize={[5,10,15]}
      

                
                
            />
   

        </div>

        {/* <div className="centralizar tableLista" >
         <table>
         <tbody>
                 <tr style={{backgroundColor : "silver"}} >
                     <th>DESCRIÇÃO</th>
                     <th>CÓDIGO</th>
                     <th>VALOR</th>
                     <th>DATA VENCIMENTO</th>
                     <th>ALTERAÇÃO</th>
                     <th>EXCLUIR</th>

                 </tr>
             </tbody>

             <tbody>         
                      { listaProdutos.map((a)=>
                 <tr key={a.PRDT_ID}>
                     <th>{a.PRDT_DESCRICAO}</th>
                     <th>{a.PRDT_CODIGO}</th>
                     <th className="alinharDir" >{(a.PRDT_VALOR).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</th>
                     <th>            
                         {apiProdutosService.dataFormatadaListar(a.PRDT_DT_VALIDADE)}
                     </th>


                     <th>
                         <button onClick={()=>navigate( `/cadastrarProdutos/${a.PRDT_ID}`)}>EDITAR</button>
                         </th>


                         <th>
                         <button onClick={()=>deletarProduto(a.PRDT_ID)}>EXCLUIR</button>                      
                            </th>
            
                 </tr>

                  )} 

             </tbody> 
             



             </table>  
             </div>        */}


    </div>

)

}

export default ListarProdutos;