class ListaDeTarefas {
    constructor() {
        this.campo = document.getElementById("campo-tarefa");
        this.botaoAdicionar = document.getElementById("botao-adicionar");
        this.lista = document.getElementById("lista-tarefas");
        this.contador = document.getElementById("contador-tarefas");
        this.botaoTema = document.getElementById("botao-tema");

        this.botaoHistorico = document.getElementById("botao-historico");
        this.modalHistorico = document.getElementById("modal-historico");
        this.fecharHistorico = document.getElementById("fechar-historico");
        this.listaHistorico = document.getElementById("lista-historico");

        this.botaoMeta = document.getElementById("botao-meta");
        this.modalMeta = document.getElementById("modal-meta");
        this.fecharMeta = document.getElementById("fechar-meta");
        this.campoMeta = document.getElementById("campo-meta");
        this.botaoDefinirMeta = document.getElementById("botao-definir-meta");
        this.textoMeta = document.getElementById("texto-meta");
        this.barraMeta = document.getElementById("barra-meta");
        this.mensagemMeta = document.getElementById("mensagem-meta");

        this.botaoRequisitos = document.getElementById("botao-requisitos");
        this.modalRequisitos = document.getElementById("modal-requisitos");
        this.fecharRequisitos = document.getElementById("fechar-requisitos");

        this.historico = [];
        this.metaDiaria = 0;
        this.tarefasConcluidasHoje = 0;

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

        this.botaoHistorico.addEventListener("click", () => {
            this.atualizarHistorico();
            this.modalHistorico.classList.add("aberto");
        });

        this.fecharHistorico.addEventListener("click", () => {
            this.modalHistorico.classList.remove("aberto");
        });

        this.botaoMeta.addEventListener("click", () => {
            this.atualizarMeta();
            this.modalMeta.classList.add("aberto");
        });

        this.fecharMeta.addEventListener("click", () => {
            this.modalMeta.classList.remove("aberto");
        });

        this.botaoDefinirMeta.addEventListener("click", () => {
            this.definirMeta();
        });

        this.campoMeta.addEventListener("keydown", (evento) => {
            if (evento.key === "Enter") {
                this.definirMeta();
            }
        });

        this.botaoRequisitos.addEventListener("click", () => {
            this.modalRequisitos.classList.add("aberto");
        });

        this.fecharRequisitos.addEventListener("click", () => {
            this.modalRequisitos.classList.remove("aberto");
        });

        [this.modalHistorico, this.modalMeta, this.modalRequisitos]
            .forEach((modal) => {
                modal.addEventListener("click", (evento) => {
                    if (evento.target === modal) {
                        modal.classList.remove("aberto");
                    }
                });
            });
    }

    adicionar() {
        const texto = this.campo.value.trim();

        if (texto === "") {
            this.campo.focus();
            return;
        }

        const dataAdicao = new Date();

        const tarefa = document.createElement("li");
        tarefa.classList.add("item-tarefa");
        tarefa.dataset.dataAdicao = dataAdicao.getTime();

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
            const estavaConcluida =
                tarefa.classList.contains("concluida");

            tarefa.classList.toggle("concluida");

            if (!estavaConcluida) {
                const dataConclusao = new Date();

                const dataAdicaoOriginal = new Date(
                    Number(tarefa.dataset.dataAdicao)
                );

                const tempo =
                    dataConclusao - dataAdicaoOriginal;

                this.tarefasConcluidasHoje++;

                this.adicionarHistorico(
                    "concluida",
                    texto,
                    dataConclusao,
                    tempo
                );

                this.atualizarMeta();
            } else {
                this.tarefasConcluidasHoje =
                    Math.max(
                        0,
                        this.tarefasConcluidasHoje - 1
                    );

                this.atualizarMeta();
            }
        });

        const excluir = document.createElement("button");
        excluir.classList.add("botao-acao", "excluir");
        excluir.title = "Excluir tarefa";
        excluir.innerHTML =
            '<i class="fa-solid fa-trash"></i>';

        excluir.addEventListener("click", () => {
            const dataExclusao = new Date();

            this.adicionarHistorico(
                "excluida",
                texto,
                dataExclusao
            );

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

        this.adicionarHistorico(
            "adicionada",
            texto,
            dataAdicao
        );

        this.campo.value = "";

        this.atualizarContador();
        this.campo.focus();
    }

    adicionarHistorico(tipo, texto, data, tempo = null) {
        this.historico.push({
            tipo,
            texto,
            data,
            tempo
        });
    }

    atualizarHistorico() {
        this.listaHistorico.innerHTML = "";

        if (this.historico.length === 0) {
            this.listaHistorico.innerHTML =
                '<p class="historico-vazio">' +
                'Nenhuma atividade registrada.' +
                '</p>';

            return;
        }

        [...this.historico].reverse().forEach((registro) => {
            const item = document.createElement("div");

            item.classList.add(
                "item-historico",
                registro.tipo
            );

            const icone = document.createElement("div");
            icone.classList.add("icone-historico");

            if (registro.tipo === "adicionada") {
                icone.innerHTML =
                    '<i class="fa-solid fa-plus"></i>';
            } else if (registro.tipo === "concluida") {
                icone.innerHTML =
                    '<i class="fa-solid fa-check"></i>';
            } else {
                icone.innerHTML =
                    '<i class="fa-solid fa-trash"></i>';
            }

            const informacoes = document.createElement("div");
            informacoes.classList.add(
                "informacoes-historico"
            );

            const titulo = document.createElement("strong");

            if (registro.tipo === "adicionada") {
                titulo.textContent = "Tarefa adicionada";
            } else if (registro.tipo === "concluida") {
                titulo.textContent = "Tarefa concluída";
            } else {
                titulo.textContent = "Tarefa excluída";
            }

            const tarefaTexto = document.createElement("span");
            tarefaTexto.textContent =
                `"${registro.texto}"`;

            const horario = document.createElement("small");
            horario.textContent =
                this.formatarData(registro.data);

            informacoes.appendChild(titulo);
            informacoes.appendChild(tarefaTexto);
            informacoes.appendChild(horario);

            if (
                registro.tipo === "concluida" &&
                registro.tempo !== null
            ) {
                const tempo = document.createElement("small");

                tempo.classList.add(
                    "tempo-conclusao"
                );

                tempo.innerHTML =
                    '<i class="fa-solid fa-stopwatch"></i> ' +
                    `Tempo para concluir: ${
                        this.formatarDuracao(
                            registro.tempo
                        )
                    }`;

                informacoes.appendChild(tempo);
            }

            item.appendChild(icone);
            item.appendChild(informacoes);

            this.listaHistorico.appendChild(item);
        });
    }

    formatarData(data) {
        return data.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }

    formatarDuracao(milissegundos) {
        const segundos =
            Math.floor(milissegundos / 1000);

        const horas =
            Math.floor(segundos / 3600);

        const minutos =
            Math.floor(
                (segundos % 3600) / 60
            );

        const segundosRestantes =
            segundos % 60;

        if (horas > 0) {
            return `${horas}h ${minutos}min`;
        }

        if (minutos > 0) {
            return `${minutos}min ${segundosRestantes}s`;
        }

        return `${segundosRestantes}s`;
    }

    definirMeta() {
        const valor = Number(
            this.campoMeta.value
        );

        if (!valor || valor < 1) {
            this.campoMeta.focus();
            return;
        }

        this.metaDiaria = valor;

        this.atualizarMeta();

        this.campoMeta.value = "";
    }

    atualizarMeta() {
        if (this.metaDiaria === 0) {
            this.textoMeta.textContent = "0 / 0";
            this.barraMeta.style.width = "0%";

            this.mensagemMeta.textContent =
                "Defina uma meta para começar.";

            return;
        }

        const progresso = Math.min(
            this.tarefasConcluidasHoje,
            this.metaDiaria
        );

        const porcentagem =
            (progresso / this.metaDiaria) * 100;

        this.textoMeta.textContent =
            `${progresso} / ${this.metaDiaria}`;

        this.barraMeta.style.width =
            `${porcentagem}%`;

        if (progresso >= this.metaDiaria) {
            this.mensagemMeta.textContent =
                "🎉 Meta diária concluída!";

            this.mensagemMeta.classList.add(
                "meta-concluida"
            );
        } else {
            const faltam =
                this.metaDiaria - progresso;

            this.mensagemMeta.textContent =
                `Faltam ${faltam} ${
                    faltam === 1
                        ? "tarefa"
                        : "tarefas"
                } para atingir sua meta.`;

            this.mensagemMeta.classList.remove(
                "meta-concluida"
            );
        }
    }

    atualizarContador() {
        const quantidade =
            this.lista.children.length;

        this.contador.textContent =
            quantidade === 1
                ? "1 tarefa na lista"
                : `${quantidade} tarefas na lista`;
    }

    atualizarIconeTema() {
        const icone =
            this.botaoTema.querySelector("i");

        if (
            document.body.classList.contains(
                "modo-escuro"
            )
        ) {
            icone.className =
                "fa-solid fa-sun";

            this.botaoTema.title =
                "Mudar para tema claro";
        } else {
            icone.className =
                "fa-solid fa-moon";

            this.botaoTema.title =
                "Mudar para tema escuro";
        }
    }
}

const app = new ListaDeTarefas();
