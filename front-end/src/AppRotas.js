import HomePage from "./Pages/Home";
import CadastrarProdutos from "./Pages/Produtos/CadastrarProdutos";
import ListarProdutos from "./Pages/Produtos/ListarProdutos";
import CadastroUsuario from "./Pages/Usuario/CadastroUsuario";


const { BrowserRouter, Routes, Route, Navigate, } = require("react-router-dom");


const AppRotas = () => {


    return (

        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<HomePage />} />
                <Route exact path="/cadastroUsuario" element={<CadastroUsuario />} />
                <Route exact path="/listarProdutos" element={<ListarProdutos />} />
                <Route exact path="/cadastrarProdutos/:id" element={<CadastrarProdutos />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRotas;