const URL_API = "https://script.google.com/macros/s/AKfycbwrpGF-2n8Ou_6i02g6pB1sLWN205rCTQB81ZSBc2dSx7nvffBiNdYf1ve1MkihbEMiYw/exec";
// const URL_API = "https://script.google.com/macros/s/AKfycby-KqZpI4gPRu88Hik9noUvjvqxBpZYXO8luu8X1ujQCULf5FV1rSp8gLI6ESvrHRCT/exec"; //teste

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
        + "\n- Criação ou exclusão de usuários será feito unicamente pelo responsável do GrID ou pela administração do INCT-Infra.",
    "2": "- Não levar bebidas ou comida à mesa do computador;"
        + "\n- Não desconectar os cabos do computador, exceto com autorização do responsável pelo GrID;"
        + "\n- Desligar o computador ao final do uso (seja presencial ou remoto);"
        + "\n- Solicitações de uso remoto durante o final de semana será passivel de rejeição, tendo em vista oscilações na rede elétrica observadas na sexta-feira;"
        + "\n- Criação ou exclusão de usuários será feito unicamente pelo responsável do GrID ou pela administração do INCT-Infra.",
    "3": "- Não levar bebidas ou comida à mesa do computador;"
        + "\n- Não desconectar os cabos do computador, exceto com autorização do responsável pelo GrID;"
        + "\n- Desligar o computador ao final do uso (seja presencial ou remoto);"
        + "\n- Solicitações de uso remoto durante o final de semana será passivel de rejeição, tendo em vista oscilações na rede elétrica observadas na sexta-feira;"
        + "\n- Criação ou exclusão de usuários será feito unicamente pelo responsável do GrID ou pela administração do INCT-Infra.",
    "4": "- Não levar bebidas ou comida à mesa do computador;"
        + "\n- Não desconectar os cabos do computador, exceto com autorização do responsável pelo GrID;"
        + "\n- Desligar o computador ao final do uso (seja presencial ou remoto);"
        + "\n- Solicitações de uso remoto durante o final de semana será passivel de rejeição, tendo em vista oscilações na rede elétrica observadas na sexta-feira;"
        + "\n- Criação ou exclusão de usuários será feito unicamente pelo responsável do GrID ou pela administração do INCT-Infra.",
    "5": "- Não levar bebidas ou comida à mesa do computador;"
        + "\n- Não desconectar os cabos do computador, exceto com autorização do responsável pelo GrID;"
        + "\n- Desligar o computador ao final do uso (seja presencial ou remoto);"
        + "\n- Solicitações de uso remoto durante o final de semana será passivel de rejeição, tendo em vista oscilações na rede elétrica observadas na sexta-feira;"
        + "\n- Criação ou exclusão de usuários será feito unicamente pelo responsável do GrID ou pela administração do INCT-Infra.",
    "6": "- Não levar bebidas ou comida à mesa do computador;"
        + "\n- Não desconectar os cabos do computador, exceto com autorização do responsável pelo GrID;"
        + "\n- Desligar o computador ao final do uso (seja presencial ou remoto);"
        + "\n- Solicitações de uso remoto durante o final de semana será passivel de rejeição, tendo em vista oscilações na rede elétrica observadas na sexta-feira;"
        + "\n- Criação ou exclusão de usuários será feito unicamente pelo responsável do GrID ou pela administração do INCT-Infra.",
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
    "9": "- Não usar a estação sem treinamento prévio;"
        + "\n- A ponta é extremamente quente (300 °C). Não toque e sempre use o suporte;"
        + "\n- Evite inalar a fumaça da solda;"
        + "\n- Temperatura: Ajuste conforme a solda (≈330 °C comum | ≈370 °C sem chumbo);"
        + "\n- Mantenha a ponta limpa e estanhada. Use esponja ou lã metálica. NUNCA usar para aquecer ou derreter outros materiais;"
        + "\n- Guarde a solda, fluxo e ferramentas nos locais designados;"
        + "\n- Ao final, desligue a estação, deixe a bancada limpa, organizada e pronta para o próximo usuário.",
    "10": "- Usar ferramentas de forma adequada, sem risco de danificar submetendo-as em condições extremas para o seu uso;"
        + "\n- Manter as ferramentas limpas e preservadas;"
        + "\n- Ao final do uso, guardar as ferramentas no seu devido compartimento dentro da maleta de ferramentas.",
    "11": "- Não manusear sem treinamento prévio."
};

function configurarDataAtual() {
    const hoje = new Date();
    const dataFormatada = hoje.toISOString().split('T')[0];
    document.getElementById('data').value = dataFormatada;
    // Impede selecionar datas anteriores a hoje no calendário
    document.getElementById('data').min = new Date().toISOString().split("T")[0];
}

function mostrarInstrucoes() {
    const maquinaId = document.getElementById('maquina').value;
    const containerInstrucoes = document.getElementById('texto-instrucoes');
    const containerImpressora = document.getElementById('campos-impressora');
    const containerFerramentas = document.getElementById('campo-ferramentas');

    // 1. Atualiza o texto de instruções
    if (instrucoesMaquinas[maquinaId]) {
        containerInstrucoes.innerHTML = formatarInstrucao(instrucoesMaquinas[maquinaId]);
    } else {
        containerInstrucoes.innerHTML = "Selecione uma opção para ver as instruções.";
    }

    // 2. Lógica de visibilidade dos campos extras de Impressora 3D
    if (maquinaId === "7" || maquinaId === "8") {
        containerImpressora.style.display = "block";
    } else {
        containerImpressora.style.display = "none";
        document.getElementById('material').value = "";
        document.getElementById('descricao').value = "";
    }

    // 3. Lógica de visibilidade para Maleta de Ferramentas (item 10)
    if (maquinaId === "10") {
        containerFerramentas.style.display = "block";
    } else {
        containerFerramentas.style.display = "none";
        document.getElementById('descricaoFerramentas').value = "";
    }
}

configurarDataAtual();

async function carregarReservas() {
    corpoAgenda.innerHTML = '<tr><td colspan="3">Carregando horários...</td></tr>';
    try {
        const response = await fetch(URL_API);
        const dadosBrutos = await response.json();
        
        // Limpa o objeto global de reservas
        reservasGlobais = {};

        // Agrupa múltiplos nomes que agendaram no mesmo dia, máquina e horário
        for (const chave in dadosBrutos) {
            const nomeUsuario = dadosBrutos[chave];
            
            // Extrai a chave base de agendamento (remove o sufixo -RET... se existir)
            // Exemplo: "2026-09-09-M10-17-RET123" vira "2026-09-09-M10-17"
            const partes = chave.split('-');
            const chavePadrao = `${partes[0]}-${partes[1]}-${partes[2]}-${partes[3]}-${partes[4]}`;

            if (!reservasGlobais[chavePadrao]) {
                reservasGlobais[chavePadrao] = [];
            }
            // Adiciona o nome à lista do horário se ele ainda não estiver nela
            if (!reservasGlobais[chavePadrao].includes(nomeUsuario)) {
                reservasGlobais[chavePadrao].push(nomeUsuario);
            }
        }

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
        const chaveReservaPadrao = `${dataSelecionada}-M${maquinaSelecionada}-${hora}`;
        
        const ehMaleta = maquinaSelecionada === "10";
        const listaNomes = reservasGlobais[chaveReservaPadrao] || [];
        const temReserva = listaNomes.length > 0;

        // Para os outros equipamentos, se tiver reserva fica bloqueado
        // Para a Maleta (10), nunca fica bloqueado
        const estaBloqueado = !ehMaleta && temReserva;

        // Monta o texto dos status de reservas
        let textoStatus = 'Disponível';
        if (temReserva) {
            if (ehMaleta) {
                // Para a maleta, lista todos os nomes separados por vírgula
                textoStatus = `Reservado por: ${listaNomes.join(', ')}`;
            } else {
                textoStatus = `Reservado por: ${listaNomes[0]}`;
            }
        }

        const estaMarcado = selecoesTemporarias.has(chaveReservaPadrao) ? 'checked' : '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${horarioFormatado}</td>
            <td class="${estaBloqueado ? 'ocupado' : (ehMaleta && temReserva ? 'ocupado' : 'disponivel')}">
                ${textoStatus}
            </td>
            <td>
                ${estaBloqueado 
                    ? '---' 
                    : `<input type="checkbox" class="chk-reserva" value="${chaveReservaPadrao}" ${estaMarcado} onchange="gerenciarSelecao(this)">`
                }
            </td>
        `;
        corpoAgenda.appendChild(tr);
    }
}

function atualizarAgenda() {
    corpoAgenda.innerHTML = '';
    const dataSelecionada = seletorData.value;
    const maquinaSelecionada = seletorMaquina.value;

    mostrarInstrucoes();

    for (let hora = 0; hora < 24; hora++) {
        const horarioFormatado = `${hora}:00 - ${hora + 1}:00`;
        const chaveReservaPadrao = `${dataSelecionada}-M${maquinaSelecionada}-${hora}`;
        
        const ehMaleta = maquinaSelecionada === "10";
        const listaNomes = reservasGlobais[chaveReservaPadrao] || [];
        const temReserva = listaNomes.length > 0;

        // Para os outros equipamentos, se tiver reserva fica bloqueado
        // Para a Maleta (10), nunca fica bloqueado
        const estaBloqueado = !ehMaleta && temReserva;

        // Monta o texto dos status de reservas
        let textoStatus = 'Disponível';
        if (temReserva) {
            if (ehMaleta) {
                // Para a maleta, lista todos os nomes separados por vírgula
                textoStatus = `Reservado por: ${listaNomes.join(', ')}`;
            } else {
                textoStatus = `Reservado por: ${listaNomes[0]}`;
            }
        }

        const estaMarcado = selecoesTemporarias.has(chaveReservaPadrao) ? 'checked' : '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${horarioFormatado}</td>
            <td class="${estaBloqueado ? 'ocupado' : (ehMaleta && temReserva ? 'ocupado' : 'disponivel')}">
                ${textoStatus}
            </td>
            <td>
                ${estaBloqueado 
                    ? '---' 
                    : `<input type="checkbox" class="chk-reserva" value="${chaveReservaPadrao}" ${estaMarcado} onchange="gerenciarSelecao(this)">`
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
    
    const btn = document.getElementById('btn-confirmar');
    btn.innerText = selecoesTemporarias.size > 0 
        ? `Confirmar ${selecoesTemporarias.size} reserva(s)` 
        : "Confirmar Reservas Selecionadas";
}

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

async function reservarSelecionados() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const orientador = document.getElementById('orientador').value;
    const projeto = document.getElementById('projeto').value;
    const senhaInformada = document.getElementById('senha-lab').value;
    const seletor = document.getElementById('maquina');
    const maquinaId = seletor.value;

    const materialValor = document.getElementById('material').value;
    const destinoValor = document.getElementById('descricao').value;
    const ferramentasValor = document.getElementById('descricaoFerramentas').value;

    if (!senhaInformada)                            return alert("Digite a senha do laboratório!");
    if (!nome || !email || !orientador || !projeto) return alert("Preencha todos os dados!");
    if (selecoesTemporarias.size === 0)             return alert("Selecione pelo menos um horário!");
    if (!validarEmail(email))                       return alert("Insira um e-mail válido.");

    // Validação para o item 10 (Maleta de Ferramentas)
    if (maquinaId === "10" && !ferramentasValor.trim()) {
        return alert("Por favor, descreva quais ferramentas você irá retirar da maleta!");
    }

    const btn = document.getElementById('btn-confirmar');
    btn.disabled = true;
    btn.innerText = "Processando...";

    // Criamos a lista de reservas
    const listaReservas = Array.from(selecoesTemporarias).map((chave, index) => {
        const partes = chave.split('-');
        const idMaquina = partes[3].replace('M', '');
        const nomeExibido = seletor.querySelector(`option[value="${idMaquina}"]`).text;

        // Determina a informação extra baseada na máquina selecionada
        let infoExtra_ = "N/A";
        if (idMaquina === "7" || idMaquina === "8") {
            infoExtra_ = `Material: ${materialValor}g | Destino: ${destinoValor}`;
        } else if (idMaquina === "10") {
            infoExtra_ = `Ferramentas: ${ferramentasValor}`;
        }

        // Para a maleta (10), adiciona um sufixo para garantir chave única na planilha
        const chaveFinal = (idMaquina === "10") ? `${chave}-RET${Date.now()}_${index}` : chave;

        return {
            chave: chaveFinal,
            data: `${partes[0]}-${partes[1]}-${partes[2]}`,
            maquina: nomeExibido,
            infoExtra: infoExtra_
        };
    });

    try {
        const response = await fetch(URL_API, {
            method: 'POST',
            body: JSON.stringify({ 
                action: 'reservar_lote', 
                senha: senhaInformada,
                usuario: { nome, email, orientador, projeto },
                reservas: listaReservas,
                detalhesImpressao: { 
                    material: materialValor, 
                    descricao: destinoValor 
                },
                detalhesFerramentas: ferramentasValor
            })
        });

        const resultado = await response.text();
        
        if (resultado.includes("Erro: Senha Incorreta")) {
            alert("Senha incorreta!");
        } else {
            alert("Reservas confirmadas com sucesso!");
            selecoesTemporarias.clear();
            document.getElementById('senha-lab').value = "";
            carregarReservas();
        }
    } catch (e) {
        alert("Erro na conexão.");
    } finally {
        btn.disabled = false;
        btn.innerText = "Confirmar Reservas Selecionadas";
    }
}

seletorData.addEventListener('change', atualizarAgenda);
seletorMaquina.addEventListener('change', atualizarAgenda);
carregarReservas();