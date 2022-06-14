const router = require("express").Router();
const express = require("express");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;
const oracledb = require("oracledb");
const dbConfig = require("../ConfigDB/configDB.js");
const { dataBR, formataArrayStr, valorLiquido, formataValorString } = require("../Service/utilServiceBackEnd.js");
const app = express();
app.use(express.json());



router.post("/listarProduto", async(req, res)=> {
  let {token} =req.body;
    let connection = await oracledb.getConnection(dbConfig);
    let result;

  try {

    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
          console.log(err, "err");
          erroAcesso = "erroLogin";
          res.send("erroLogin").end();

      } else{  
        result = await connection.execute ( 

          ` SELECT  * FROM PRODUTO  
           ORDER BY PRDT_ID DESC
          `,
          [],
          { outFormat  :  oracledb.OUT_FORMAT_OBJECT} 
           );
          const objExterno = (result.rows).map(({PRDT_DESCRICAO,PRDT_CODIGO,PRDT_VALOR,PRDT_DT_VALIDADE,PRDT_ID,PRDT_PERC_DESCONTO,PRDT_VALOR_LIQUIDO})=>
          ({PRDT_DESCRICAO : PRDT_DESCRICAO,PRDT_CODIGO : PRDT_CODIGO,
            PRDT_VALOR : PRDT_VALOR ,PRDT_DT_VALIDADE : dataBR(PRDT_DT_VALIDADE),PRDT_ID : PRDT_ID,PRDT_PERC_DESCONTO : PRDT_PERC_DESCONTO , PRDT_VALOR_LIQUIDO : PRDT_VALOR_LIQUIDO,   }))
  
           res.send(objExterno).status(200).end();           
      }
  })      
      
  } catch (error) {
      console.error(error);
      res.send("erro de conexao").status(500);
      
  }finally {
      if(connection){
          try {
              await connection.close();
            
          } catch (error) {
            console.error(error);              
          }
      }
  }




});


router.post("/excluirProduto", async(req, res)=> {
  let {id ,token} = req.body;
  console.log(formataArrayStr(id))
  let connection = await oracledb.getConnection(dbConfig);
try {
  jwt.verify(token, SECRET, async (err, decoded) => {
    if (err) {
        console.log(err, "err");
        erroAcesso = "erroLogin";
        res.send("erroLogin").end();

    } else{  
      await connection.execute ( 

        ` DELETE PRODUTO PRDT 
        WHERE PRDT_ID IN (${formataArrayStr(id)})
        `,
        [],
        { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
          autoCommit : true
        } 
         );
         res.send("Produto Excluído com Sucesso").status(200).end();                    
    }
})  ;    
   
    
} catch (error) {
    console.error(error);
    res.send("erro de conexao").status(500);
    
}finally {
    if(connection){
        try {
            await connection.close();
          
        } catch (error) {
          console.error(error);              
        }
    }
}




});

router.post("/editarListaProdutos", async(req, res)=> {
  let {lista,token} = req.body;
  let connection = await oracledb.getConnection(dbConfig);
  let result;



const objExterno = (lista).map(
  ({PRDT_DESCRICAO,PRDT_CODIGO,PRDT_VALOR,PRDT_DT_VALIDADE,PRDT_ID,PRDT_PERC_DESCONTO})=>

  ({PRDT_DESCRICAO : PRDT_DESCRICAO,PRDT_CODIGO : PRDT_CODIGO,
      PRDT_VALOR : PRDT_VALOR ,PRDT_DT_VALIDADE : PRDT_DT_VALIDADE,
      PRDT_ID : PRDT_ID,
      PRDT_PERC_DESCONTO : formataValorString(PRDT_PERC_DESCONTO) , 
      PRDT_VALOR_LIQUIDO : formataValorString(valorLiquido(PRDT_VALOR,PRDT_PERC_DESCONTO )) 
     }))
  


try {
  jwt.verify(token, SECRET, async (err, decoded) => {
    if (err) {
        console.log(err, "err");
        erroAcesso = "erroLogin";
        res.send("erroLogin").end();

    } else{  
      
      objExterno.map(async (l)=>{
        try {

          if(l.PRDT_ID === undefined || l.PRDT_ID === null || l.PRDT_ID === "" ){

            await connection.execute ( 
              ` 
              INSERT INTO PRODUTO
                    (PRDT_DESCRICAO, PRDT_CODIGO, PRDT_VALOR, PRDT_DT_VALIDADE,PRDT_ID,PRDT_PERC_DESCONTO,PRDT_VALOR_LIQUIDO)
                     VALUES
                    ('${l.PRDT_DESCRICAO}','${l.PRDT_CODIGO}',${formataValorString(l.PRDT_VALOR)},
                    '${l.PRDT_DT_VALIDADE}',                     
                     SQ_PRDT.NEXTVAL, '0', '0')       
              
              
              `,
              [],
              { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
                autoCommit : true
              
              } 
               );
           
          }else{

            await connection.execute (
              ` UPDATE PRODUTO
              SET PRDT_DESCRICAO = '${l.PRDT_DESCRICAO}',
              PRDT_CODIGO = '${l.PRDT_CODIGO}',
              PRDT_VALOR = ${formataValorString(l.PRDT_VALOR)},
              PRDT_DT_VALIDADE = '${l.PRDT_DT_VALIDADE}',
              PRDT_PERC_DESCONTO = ${formataValorString(l.PRDT_PERC_DESCONTO)},  
              PRDT_VALOR_LIQUIDO = ${formataValorString(l.PRDT_VALOR_LIQUIDO)}
             
              WHERE PRDT_ID = '${l.PRDT_ID}' `,
        
              [],
              { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
                autoCommit : true} 
                 
               );




          }
          
                
          
          }  catch(error){
            console.log("Erro ao registrar", error)   
     
        }
      })      
          
          res.send("Produtos Atualizados").status(200).end();
               
    }
})   

  
  
    
} catch (error) {
    console.error(error);
    res.send("erro ao tentar atualizar produto").status(500).end();
    
}finally {
    if(connection){
        try {
            await connection.close();
          
        } catch (error) {
          console.error(error);              
        }
    }
}




});








module.exports = router;


/*


'${formataValorString(l.PRDT_PERC_DESCONTO)}',  '${formataValorString(l.PRDT_VALOR_LIQUIDO)}'
 PRDT_PERC_DESCONTO = '${formataValorString(l.PRDT_PERC_DESCONTO)}',  
              PRDT_VALOR_LIQUIDO = '${formataValorString(l.PRDT_VALOR_LIQUIDO)}'


const objExterno = (lista).map(({PRDT_DESCRICAO,PRDT_CODIGO,PRDT_VALOR,PRDT_DT_VALIDADE,PRDT_ID,PRDT_PERC_DESCONTO})=>
          ({PRDT_DESCRICAO : PRDT_DESCRICAO,PRDT_CODIGO : PRDT_CODIGO,
            PRDT_VALOR : PRDT_VALOR ,PRDT_DT_VALIDADE : PRDT_DT_VALIDADE,PRDT_ID : PRDT_ID,PRDT_PERC_DESCONTO : Number(PRDT_PERC_DESCONTO) , PRDT_VALOR_LIQUIDO : valorLiquido(PRDT_VALOR,PRDT_PERC_DESCONTO )  }))
  







*/