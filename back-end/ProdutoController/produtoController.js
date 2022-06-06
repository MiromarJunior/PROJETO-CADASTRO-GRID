const router = require("express").Router();
const express = require("express");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;
const oracledb = require("oracledb");
const dbConfig = require("../ConfigDB/configDB.js");
const { dataBR } = require("../Service/utilService.js");
const app = express();
app.use(express.json());



router.post("/listarProduto", async(req, res)=> {
  let {token} =req.body;
    let connection = await oracledb.getConnection(dbConfig);
    let result;

  //   jwt.verify(token, SECRET, (err, decoded) => {
  //     if (err) {
  //         console.log(err, "err");
  //         erroAcesso = "erroLogin";

  //     } else{         
          
  //     }
  // })






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
          const objExterno = (result.rows).map(({PRDT_DESCRICAO,PRDT_CODIGO,PRDT_VALOR,PRDT_DT_VALIDADE,PRDT_ID})=>
          ({PRDT_DESCRICAO : PRDT_DESCRICAO,PRDT_CODIGO : PRDT_CODIGO,
            PRDT_VALOR : PRDT_VALOR ,PRDT_DT_VALIDADE : dataBR(PRDT_DT_VALIDADE),PRDT_ID : PRDT_ID}))
  
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

router.post("/cadastrarProduto", async(req, res)=> {
  let = {descricao, codigo,valor,dataVal,id, token} = req.body;
  
  let connection = await oracledb.getConnection(dbConfig);
  let data_brasileira = dataVal.split('-').reverse().join('/');

  let result;

try {



  jwt.verify(token, SECRET, async (err, decoded) => {
    if (err) {
        console.log(err, "err");
        erroAcesso = "erroLogin";
        res.send("erroLogin").end();

    } else{  
      if(id > 0) {
        await connection.execute( `
    
        UPDATE PRODUTO
        SET PRDT_DESCRICAO = :DESCRICAO,
        PRDT_CODIGO =:CODIGO,
        PRDT_VALOR = :VALOR,
        PRDT_DT_VALIDADE = :DATA
        WHERE  PRDT_ID = :ID   
        
        
        ` ,[descricao,codigo,valor,data_brasileira,id],{
    
          outFormat  :  oracledb.OUT_FORMAT_OBJECT,
          autoCommit : true
    
    
        });
    
        res.send("Atualizado com sucesso !").status(200).end();
    
    
    
      }else{
    
    
    
       await connection.execute ( 
          ` 
          INSERT INTO PRODUTO
                (PRDT_DESCRICAO, PRDT_CODIGO, PRDT_VALOR, PRDT_DT_VALIDADE, PRDT_ID)
                 VALUES
                (:DESCRICAO,
                 :CODIGO,
                  :VALOR,
               :VALIDADE,
                 SQ_PRDT.NEXTVAL)       
          
          
          `,
          [descricao, codigo,valor,data_brasileira],
          { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
            autoCommit : true
          
          } 
           );
           res.send("Cadastrado com sucesso!").status(200).end();
          }   
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

router.post("/listarProdutoID", async(req, res)=> {
  let {id} = req.body;
  let connection = await oracledb.getConnection(dbConfig);
  let result;



try {

  result = await connection.execute ( 

      ` SELECT  * FROM PRODUTO WHERE PRDT_ID = :ID
      `,
      [id],
      { outFormat  :  oracledb.OUT_FORMAT_OBJECT} 
       );
       res.send(result.rows).status(200);
      
  
    
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
  let {id,token} = req.body;
  let connection = await oracledb.getConnection(dbConfig);
  let result;

try {



  jwt.verify(token, SECRET, async (err, decoded) => {
    if (err) {
        console.log(err, "err");
        erroAcesso = "erroLogin";
        res.send("erroLogin").end();

    } else{  
      await connection.execute ( 

        ` DELETE PRODUTO PRDT 
        WHERE PRDT_ID = :ID
        `,
        [id],
        { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
          autoCommit : true
        } 
         );
         res.send("Produto Excluído com Sucesso").status(200).end();
        
    

              
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

router.post("/editarListaProdutos", async(req, res)=> {
  let {lista,token} = req.body;
  let connection = await oracledb.getConnection(dbConfig);
  let result;

function formataValorString(valor){
  if(typeof(valor) === "string"){
  return  valor.replace(",",".");
  }
  return valor;
}

try {
  jwt.verify(token, SECRET, async (err, decoded) => {
    if (err) {
        console.log(err, "err");
        erroAcesso = "erroLogin";
        res.send("erroLogin").end();

    } else{  

      lista.map(async (l)=>{
        try {
          
       await connection.execute (
          ` UPDATE PRODUTO
          SET PRDT_DESCRICAO = '${l.PRDT_DESCRICAO}',
          PRDT_CODIGO = '${l.PRDT_CODIGO}',
          PRDT_VALOR = ${formataValorString(l.PRDT_VALOR)},
          PRDT_DT_VALIDADE = '${l.PRDT_DT_VALIDADE}'
          WHERE PRDT_ID = '${l.PRDT_ID}' `,
    
          [],
          { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
            autoCommit : true} 
             
           );          
          
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