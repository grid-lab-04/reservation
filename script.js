const URL_API = "https://script.google.com/macros/s/AKfycbxrPBYVHOejuLsENsYu6pMz3z-Nc4_tthyvH9sk0uV1Ow_cUOZxAWG-kYGaAQ4eFr67/exec";

const corpoAgenda = document.getElementById('corpo-agenda');
const seletorData = document.getElementById('data');
const seletorMaquina = document.getElementById('maquina');
let reservasGlobais = {};
// Esta "sacola" guarda as chaves selecionadas de vários dias/máquinas
let selecoesTemporarias = new Set();

function formatarInstrucao(texto) {
  return texto.replace(
    "Equipamentos:",
    "<strong>Equipamentos:</strong>"
  ).replace(/\n/g, "<br>");
}

const instrucoesMaquinas = {
    "1": "- Não levar bebidas ou comida à mesa do computador;"
        + "\n- Não desconectar os cabos do computador, exceto com autorização do responsável pelo GrID;"
        + "\n- Desligar o computador ao final do uso (seja presencial ou remoto);"
        + "\n- Solicitações de uso remoto durante o final de semana será passivel de rejeição, tendo em vista oscilações na rede elétrica observadas na sexta-feira;"
        + "\n- Criação ou excluisão de usuários será feito unicamente pelo responsável do GrID ou pela administração do INCT-Infra.",
    "2": "- Não levar bebidas ou comida à mesa do computador;"
        + "\n- Não desconectar os cabos do computador, exceto com autorização do responsável pelo GrID;"
        + "\n- Desligar o computador ao final do uso (seja presencial ou remoto);"
        + "\n- Solicitações de uso remoto durante o final de semana será passivel de rejeição, tendo em vista oscilações na rede elétrica observadas na sexta-feira;"
        + "\n- Criação ou excluisão de usuários será feito unicamente pelo responsável do GrID ou pela administração do INCT-Infra.",
    "3": "- Não levar bebidas ou comida à mesa do computador;"
        + "\n- Não desconectar os cabos do computador, exceto com autorização do responsável pelo GrID;"
        + "\n- Desligar o computador ao final do uso (seja presencial ou remoto);"
        + "\n- Solicitações de uso remoto durante o final de semana será passivel de rejeição, tendo em vista oscilações na rede elétrica observadas na sexta-feira;"
        + "\n- Criação ou excluisão de usuários será feito unicamente pelo responsável do GrID ou pela administração do INCT-Infra.",
    "4": "- Não levar bebidas ou comida à mesa do computador;"
        + "\n- Não desconectar os cabos do computador, exceto com autorização do responsável pelo GrID;"
        + "\n- Desligar o computador ao final do uso (seja presencial ou remoto);"
        + "\n- Solicitações de uso remoto durante o final de semana será passivel de rejeição, tendo em vista oscilações na rede elétrica observadas na sexta-feira;"
        + "\n- Criação ou excluisão de usuários será feito unicamente pelo responsável do GrID ou pela administração do INCT-Infra.",
    "5": "- Não levar bebidas ou comida à mesa do computador;"
        + "\n- Não desconectar os cabos do computador, exceto com autorização do responsável pelo GrID;"
        + "\n- Desligar o computador ao final do uso (seja presencial ou remoto);"
        + "\n- Solicitações de uso remoto durante o final de semana será passivel de rejeição, tendo em vista oscilações na rede elétrica observadas na sexta-feira;"
        + "\n- Criação ou excluisão de usuários será feito unicamente pelo responsável do GrID ou pela administração do INCT-Infra.",
    "6": "- Não levar bebidas ou comida à mesa do computador;"
        + "\n- Não desconectar os cabos do computador, exceto com autorização do responsável pelo GrID;"
        + "\n- Desligar o computador ao final do uso (seja presencial ou remoto);"
        + "\n- Solicitações de uso remoto durante o final de semana será passivel de rejeição, tendo em vista oscilações na rede elétrica observadas na sexta-feira;"
        + "\n- Criação ou excluisão de usuários será feito unicamente pelo responsável do GrID ou pela administração do INCT-Infra.",
    "7": "- Toda e qualquer impressão deverá ser comunicada ao responsável pelo GrID, informando a aplicação da peça impressa e quanto material será gasto;"
        + "\n- Em caso de comportamento inesperado, falhas ou mal funcionamento, o usuário deverá relatar imediatamente o responsável pelo GrID;"    
        + "\n- É prioritário o uso de filamentos já abertos;"
        + "\n- Caso algum rolo de filamento se esgote, o usuário deverá relatar ao resposável pelo GrID para que seja dado baixa no quantitativo;"
        + "\n- Manter a impressora limpa de resíduos de filamento e limpar a bandeja antes e após o uso;"
        + "\n- Não usar as ferramentas da impressora para outros fins (Ex: alicate, espátula, etc.).",
    "8": "- Toda e qualquer impressão deverá ser comunicada ao responsável pelo GrID, informando a aplicação da peça impressa e quanto material será gasto;"
        + "\n- Em caso de comportamento inesperado, falhas ou mal funcionamento, o usuário deverá relatar imediatamente o responsável pelo GrID;"    
        + "\n- É prioritário o uso de filamentos já abertos;"
        + "\n- Caso algum rolo de filamento se esgote, o usuário deverá relatar ao resposável pelo GrID para que seja dado baixa no quantitativo;"
        + "\n- Manter a impressora limpa de resíduos de filamento e limpar a bandeja antes e após o uso;"
        + "\n- Não usar as ferramentas da impressora para outros fins (Ex: alicate, espátula, etc.).",
    "9": "- Manter a sala limpa e organizada após o uso;"
        + "\n- O uso de qualquer máquina durante a utilização da sala ocorrerá apenas se não ouver conflito de reservas."
};

function configurarDataAtual() {
    const hoje = new Date();
    const dataFormatada = hoje.toISOString().split('T')[0];
    document.getElementById('data').value = dataFormatada;
}

function mostrarInstrucoes() {
    const maquinaId = document.getElementById('maquina').value;
    const labelInstrucoes = document.getElementById('texto-instrucoes').innerHTML = formatarInstrucao(instrucoesMaquinas[maquinaId]);
    
    // Busca a instrução no objeto, ou usa um texto padrão se não encontrar
    labelInstrucoes.innerText = instrucoesMaquinas[maquinaId] || "Sem instruções específicas.";
}

configurarDataAtual();

async function carregarReservas() {
    corpoAgenda.innerHTML = '<tr><td colspan="3">Carregando horários...</td></tr>';
    try {
        const response = await fetch(URL_API);
        reservasGlobais = await response.json();
        atualizarAgenda();
    } catch (e) {
        corpoAgenda.innerHTML = '<tr><td colspan="3">Erro ao carregar dados.</td></tr>';
    }
}

function atualizarAgenda() {
    corpoAgenda.innerHTML = '';
    const dataSelecionada = seletorData.value;
    const maquinaSelecionada = seletorMaquina.value;

    mostrarInstrucoes();

    for (let hora = 0; hora < 24; hora++) {
        const horarioFormatado = `${hora}:00 - ${hora + 1}:00`;
        const chaveReserva = `${dataSelecionada}-M${maquinaSelecionada}-${hora}`;
        const nomeReserva = reservasGlobais[chaveReserva];

        // Verifica se esta chave já está na nossa "sacola" de seleções
        const estaMarcado = selecoesTemporarias.has(chaveReserva) ? 'checked' : '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${horarioFormatado}</td>
            <td class="${nomeReserva ? 'ocupado' : 'disponivel'}">
                ${nomeReserva ? `Reservado por: ${nomeReserva}` : 'Disponível'}
            </td>
            <td>
                ${nomeReserva 
                    ? '---' 
                    : `<input type="checkbox" class="chk-reserva" value="${chaveReserva}" ${estaMarcado} onchange="gerenciarSelecao(this)">`
                }
            </td>
        `;
        corpoAgenda.appendChild(tr);
    }
}

// Função que adiciona ou remove da "sacola" ao clicar no checkbox
function gerenciarSelecao(checkbox) {
    if (checkbox.checked) {
        selecoesTemporarias.add(checkbox.value);
    } else {
        selecoesTemporarias.delete(checkbox.value);
    }
    
    // Opcional: Atualiza o texto do botão com a contagem
    const btn = document.getElementById('btn-confirmar');
    btn.innerText = selecoesTemporarias.size > 0 
        ? `Confirmar ${selecoesTemporarias.size} reserva(s)` 
        : "Confirmar Reservas Selecionadas";
}

async function reservarSelecionados() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const orientador = document.getElementById('orientador').value;
    const senhaInformada = document.getElementById('senha-lab').value;

    if (!senhaInformada) return alert("Digite a senha do laboratório!");
    if (!nome || !email || !orientador) return alert("Preencha todos os dados!");
    if (selecoesTemporarias.size === 0) return alert("Selecione pelo menos um horário!");

    const btn = document.getElementById('btn-confirmar');
    btn.disabled = true;
    const textoOriginal = btn.innerText;
    btn.innerText = "Processando reservas...";

    // Agora iteramos sobre a nossa "sacola" (Set)
    for (let chave of selecoesTemporarias) {
        // Extraímos a data e máquina da própria chave (Formato: YYYY-MM-DD-M1-H)
        const partes = chave.split('-');
        const dataAgend = `${partes[0]}-${partes[1]}-${partes[2]}`;
        const numMaquina = partes[3].replace('M', '');

        try {
            const response = await fetch(URL_API, {
                method: 'POST',
                body: JSON.stringify({ 
                    action: 'reservar', 
                    senha: senhaInformada,
                    chave: chave, 
                    nome: nome,
                    email: email,
                    orientador: orientador,
                    dataAgendamento: dataAgend,
                    maquina: `Computador 0${numMaquina}` // Ajusta conforme seus nomes no HTML
                })
            });

            const resultado = await response.text();
            
            if (resultado.includes("Erro: Senha Incorreta")) {
                alert("A senha informada está incorreta!");
                btn.disabled = false;
                btn.innerText = textoOriginal;
                return;
            }
        } catch (e) {
            console.error("Erro ao reservar chave: " + chave);
        }
    }

    alert("Todas as reservas foram concluídas com sucesso!");
    selecoesTemporarias.clear(); // Limpa a sacola após o sucesso
    document.getElementById('senha-lab').value = "";
    btn.disabled = false;
    btn.innerText = "Confirmar Reservas Selecionadas";
    carregarReservas();
}

seletorData.addEventListener('change', atualizarAgenda);
seletorMaquina.addEventListener('change', atualizarAgenda);
carregarReservas();