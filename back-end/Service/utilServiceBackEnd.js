
 const dataBRa = (data)=>{
    return(
    new Date(data).getFullYear()+"-"+
    ((new Date(data).getMonth()+(1))< 10 ?
    "0"+(new Date(data).getMonth()+(1)) :
    (new Date(data).getMonth()+(1)) 
    )+"-"+
    ((new Date(data).getDate())< 10 ?
    "0"+(new Date(data).getDate()) :
    (new Date(data).getDate()) 

    )
    )
  

}
 const dataBR =(data)=>{
    return(        
        ((new Date(data).getDate()) < 10 ? "0"+new Date(data).getDate() : new Date(data).getDate())+"/"
        +((new Date(data).getMonth()+(1)) < 10 ? "0"+(new Date(data).getMonth()+(1)) : (new Date(data).getMonth()+(1))) +"/"
        +new Date(data).getFullYear()
    )
}

 const valorBR =(data)=>{
    return data.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}

const  formataArrayStr = (id)=>{
    let ids = "";
    id.map(l=> ids +=`'${l}',`);
  return  ids.substring(0,ids.length -1)
  
  }

const valorLiquido = (valor, desconto)=>{
    return (valor - (valor * (desconto/100)));
}

module.exports ={valorLiquido,dataBR,formataArrayStr};
