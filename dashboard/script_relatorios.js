
function voltar_login() {
    setTimeout(() => {
        window.location.href = '/login_cadastro/login.html'
    }, 200);
}

function voltar_home() {
    setTimeout(() => {
        window.location.href = '/dashboard/dashboard.html'
    }, 200);
}

function ir_relatorios() {
    setTimeout(() => {
        window.location.href = '/dashboard/relatorios.html'
    }, 200);
}

function ir_cadastros() {
    setTimeout(() => {
        window.location.href = '/dashboard/cadastros.html'
    }, 200);
}

function abrirNovoCadastro() {
    window.location.href = '/dashboard/novocadastro.html'
}

document.addEventListener('DOMContentLoaded', () => {

    //barra de pesquisa do header igual ao da tela de dashboard (por enquanto):

    const campoPesquisa = document.getElementById('campoPesquisa')
    const resultadosPesquisa = document.getElementById('resultadosPesquisa')


    campoPesquisa.addEventListener('input', function () {
        const termo = this.value.toLowerCase().trim(); //para nao ter diferença entre maiusculas e minusculas
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        resultadosPesquisa.innerHTML = ''

        if (!termo) {
            resultadosPesquisa.style.display = 'none'
            //quando a pesquisa estiver vazia, todas as tr voltam a ficar visíveis.
            const linhas = tabela.getElementsByTagName('tr')
            for (let i = 0; i < linhas.length; i++) {
                linhas[i].style.display = '';
            }

            return;
        }

        const resultados = usuarios.filter(usuario =>
            usuario.nome && usuario.nome.toLowerCase().includes(termo) // filter percorre a array e mantem resultados cujo nome contem o termo digitado
        );

        if (resultados.length === 0) {
            resultadosPesquisa.style.display = 'none'
            return;
        }

        //cria uma div dinamicamente e coloca o nome do usuario dentro dessa div
        resultados.forEach(usuario => {
            const item = document.createElement('div');
            item.textContent = usuario.nome
            item.style.padding = '8px';
            item.style.cursor = 'pointer'

            item.addEventListener('click', () => {
                //configuração caso clique no resultado da pesquisa
                alert(`${usuario.nome} selecionado`)
                campoPesquisa.value = ''

                //quando a pesquisa estiver vazia, todas as tr voltam a ficar visíveis.
                const linhas = tabela.getElementsByTagName('tr')
                for (let i = 0; i < linhas.length; i++) {
                    linhas[i].style.display = '';
                }
                resultadosPesquisa.style.display = 'none'
            });

            resultadosPesquisa.appendChild(item); //adiciona ao resultadosPesquisa
        });

        resultadosPesquisa.style.display = 'block'

        //Filtra a tabela com os usuarios que combinam com a barra de pesquisa
        const linhas = tabela.getElementsByTagName('tr')
        for (let i = 0; i < linhas.length; i++) {
            const linha = linhas[i]
            const nomeCelula = linha.cells[0]

            if (nomeCelula) {
                const nome = nomeCelula.textContent.toLowerCase()

                if (nome.includes(termo)) {
                    linha.style.display = '';
                } else {
                    linha.style.display = 'none'
                }
            }
        }

    });

    document.addEventListener('click', function (e) {
        if (!campoPesquisa.contains(e.target)) {
            resultadosPesquisa.style.display = 'none'
        }
    });


    //reproduz a tabela como nas outras páginas.

    document.addEventListener('click', function (e) {
        if (!campoPesquisa.contains(e.target)) {
            resultadosPesquisa.style.display = 'none'
        }
    });

    const tabela = document.querySelector('#tabela_usuarios tbody')
    if (tabela) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || []

        usuarios.forEach((usuario, index) => {
            const tr = document.createElement('tr')
            tr.dataset.index = index
            tr.innerHTML = `
                <td>${usuario.nome}</td>
                <td>${usuario.email}</td>
                <td>${usuario.telefone}</td>
                <td>${usuario.status}</td>
            `;
            tabela.appendChild(tr);
        });
    }

    //abre outra pagina copiando apenas o conteudo da tabela para impressão
    const btn_imp = document.getElementById('btn_imp')

    if (btn_imp) {
        btn_imp.addEventListener('click', (evt) => {
            //clona a tabela para nao afetar a original
            const conteudo = document.getElementById('tabela_usuarios').cloneNode(true)
            conteudo.querySelectorAll('tr').forEach(tr => {
                tr.style; hover = 'none'
            });

            const estilo = `
             <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 18px;
                }
                table {
                    width: 98%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th {
                    background-color: #f2f2f2;
                    color: #333;
                    font-weight: bold;
                    padding: 10px;
                    border: 1px solid #ddd;
                }
                td {
                    padding: 8px 10px;
                    border: 1px solid #ddd;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                .no-print {
                    display: none;
                }
                @page {
                    size: A4;
                    margin: 10mm;
                }
                @page { 
                    @bottom-right {
                        content: "Página " counter(page) " de " counter(pages);
                        font-size: 10px;
                        color: #666;
                     }
                }
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                    }
                }
            </style>
            `

            const cabecalho = `
                <div style = "margin-botton: 20px; text-align: center;">
                <h1 style = "color: #333; margin-botton: 5px;"> Operação Curiosidade</h1>
                <p style = "color: #666;"> Relatórios > Lista de Usuários - ${new Date().toLocaleDateString()}</p>
                </div>
            `

            const win = window.open('', '_blank', 'height:800', 'width:600')

            win.document.head.innerHTML = `<title>Operação Curiosidade - Impressão</title>
            ${estilo}`

            win.document.body.innerHTML = `
            ${cabecalho}
            ${conteudo.outerHTML}
            <div style = "margin-top: 20px; text-align: right; color: #666; font-size: 12px;>
                Gerado em ${new Date().toLocaleString()}
                </div>
            `

            setTimeout(() => {
                win.print()
                win.close()
            }, 200);

        })
    }
});



