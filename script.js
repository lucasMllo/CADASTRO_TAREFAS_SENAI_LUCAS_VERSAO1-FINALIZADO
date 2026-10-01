class ListaDeTarefas {
    constructor() {
        this.campo = document.getElementById("campo-tarefa");
        this.botaoAdicionar = document.getElementById("botao-adicionar");
        this.lista = document.getElementById("lista-tarefas");
        this.contador = document.getElementById("contador-tarefas");
        this.botaoTema = document.getElementById("botao-tema");

        this.iniciar();
    }

    iniciar() {
        this.botaoAdicionar.addEventListener("click", () => {
            this.adicionar();
        });

        this.campo.addEventListener("keydown", (evento) => {
            if (evento.key === "Enter") {
                this.adicionar();
            }
        });

        this.botaoTema.addEventListener("click", () => {
            document.body.classList.toggle("modo-escuro");
            this.atualizarIconeTema();
        });
    }

    adicionar() {
        const texto = this.campo.value.trim();

        if (texto === "") {
            this.campo.focus();
            return;
        }

        const tarefa = document.createElement("li");
        tarefa.classList.add("item-tarefa");

        const indicador = document.createElement("span");
        indicador.classList.add("indicador-tarefa");

        const textoTarefa = document.createElement("span");
        textoTarefa.classList.add("texto-tarefa");
        textoTarefa.textContent = texto;

        const acoes = document.createElement("div");
        acoes.classList.add("acoes-tarefa");

        const concluir = document.createElement("button");
        concluir.classList.add("botao-acao", "concluir");
        concluir.title = "Marcar como concluída";
        concluir.innerHTML = '<i class="fa-solid fa-check"></i>';

        concluir.addEventListener("click", () => {
            tarefa.classList.toggle("concluida");
        });

        const excluir = document.createElement("button");
        excluir.classList.add("botao-acao", "excluir");
        excluir.title = "Excluir tarefa";
        excluir.innerHTML = '<i class="fa-solid fa-trash"></i>';

        excluir.addEventListener("click", () => {
            tarefa.classList.add("removendo");

            setTimeout(() => {
                tarefa.remove();
                this.atualizarContador();
            }, 250);
        });

        acoes.appendChild(concluir);
        acoes.appendChild(excluir);

        tarefa.appendChild(indicador);
        tarefa.appendChild(textoTarefa);
        tarefa.appendChild(acoes);

        this.lista.appendChild(tarefa);

        this.campo.value = "";

        this.atualizarContador();
        this.campo.focus();
    }

    atualizarContador() {
        const quantidade = this.lista.children.length;

        this.contador.textContent =
            quantidade === 1
                ? "1 tarefa na lista"
                : `${quantidade} tarefas na lista`;
    }

    atualizarIconeTema() {
        const icone = this.botaoTema.querySelector("i");

        if (document.body.classList.contains("modo-escuro")) {
            icone.className = "fa-solid fa-sun";
            this.botaoTema.title = "Mudar para tema claro";
        } else {
            icone.className = "fa-solid fa-moon";
            this.botaoTema.title = "Mudar para tema escuro";
        }
    }
}

const app = new ListaDeTarefas();