const { useContext, useState } = require("react");
const { useNavigate } = require("react-router-dom");
const { AuthContext } = require("../Autenticação/auth.jsx");



const LoginPage = ()=>{
    

    const [usuario,setUsuario] = useState("");
    const [senha,setSenha] = useState(""); 
    const navigate = useNavigate();
    const {login} =useContext(AuthContext);

    const acessoLogin =(e)=>{
        e.preventDefault();
     //   login(usuario,senha);
    }
    




    return(
        <div>
            <h1> Pagina de Login</h1>
            <div className="centralizarInput">
                <form>
                    <label>Usuário</label><br/>
                    <input type={"text"} onChange={(e)=> setUsuario(e.target.value)} placeholder={"Nome o usuário"}/><br/>
                    <label>Senha</label><br/>
                    <input type={"password"} onChange={(e)=> setSenha(e.target.value)} placeholder={"Senha"} />
                </form>
                <br/>
                <button onClick={(e)=>acessoLogin(e)}>Login</button>
            </div>

        </div>
    )
}
export default LoginPage;