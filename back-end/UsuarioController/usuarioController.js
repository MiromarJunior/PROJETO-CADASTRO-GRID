const router = require("express").Router();
const express = require("express");
const oracledb = require("oracledb");
const dbConfig = require("../ConfigDB/configDB.js");
const app = express();
app.use(express.json());


router.get("/listar", async(req, res)=> {
    let connection = await oracledb.getConnection(dbConfig);
    let result;

  try {

    result = await connection.execute ( 

        ` SELECT  * FROM USUARIOTESTE  `,
        [],
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
              console.log("conexão fechada");
          } catch (error) {
            console.error(error);              
          }
      }
  }




});








module.exports = router;