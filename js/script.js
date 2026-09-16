/* =========================================================
   SITAM — lógica de front-end (protótipo, sem back-end real)
   Dados mockados em memória, apenas para demonstração.
   ========================================================= */

// ---------- CADASTRO ----------
(function initCadastro() {
  const toggle = document.getElementById('roleToggle');
  if (!toggle) return;

  const btnCaminhoneiro = document.getElementById('btnCaminhoneiro');
  const btnCliente = document.getElementById('btnCliente');
  const formCaminhoneiro = document.getElementById('formCaminhoneiro');
  const formCliente = document.getElementById('formCliente');

  function showRole(role) {
    const isCaminhoneiro = role === 'caminhoneiro';
    btnCaminhoneiro.classList.toggle('active', isCaminhoneiro);
    btnCliente.classList.toggle('active', !isCaminhoneiro);
    formCaminhoneiro.style.display = isCaminhoneiro ? 'block' : 'none';
    formCliente.style.display = isCaminhoneiro ? 'none' : 'block';
  }

  btnCaminhoneiro.addEventListener('click', () => showRole('caminhoneiro'));
  btnCliente.addEventListener('click', () => showRole('cliente'));

  // define o papel inicial a partir de ?tipo= na URL, senão caminhoneiro
  const params = new URLSearchParams(window.location.search);
  const tipoInicial = params.get('tipo') === 'cliente' ? 'cliente' : 'caminhoneiro';
  showRole(tipoInicial);

  // alterna rótulos do formulário de cliente entre pessoa física / jurídica
  const tipoConta = document.getElementById('tipoConta');
  if (tipoConta) {
    tipoConta.addEventListener('change', () => {
      const labelNome = document.getElementById('labelNome');
      const labelDoc = document.getElementById('labelDoc');
      const inputNome = document.getElementById('inputNome');
      const inputDoc = document.getElementById('inputDoc');
      if (tipoConta.value === 'juridica') {
        labelNome.textContent = 'Razão social';
        inputNome.placeholder = 'Ex: Distribuidora Boa Safra Ltda.';
        labelDoc.textContent = 'CNPJ';
        inputDoc.placeholder = '00.000.000/0000-00';
      } else {
        labelNome.textContent = 'Nome completo';
        inputNome.placeholder = 'Ex: Ana Paula Ribeiro';
        labelDoc.textContent = 'CPF';
        inputDoc.placeholder = '000.000.000-00';
      }
    });
  }

  // envio simulado dos formulários
  const fCaminhoneiro = document.getElementById('fCaminhoneiro');
  fCaminhoneiro.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('msgCaminhoneiro').classList.add('show');
  });

  const fCliente = document.getElementById('fCliente');
  fCliente.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('msgCliente').classList.add('show');
  });
})();

// ---------- DASHBOARD CAMINHONEIRO ----------
(function initDashboardCaminhoneiro() {
  const lista = document.getElementById('listaFretes');
  if (!lista) return;

  const fretes = [
    { origem: 'Rio de Janeiro', destino: 'Petrópolis', carga: 'Materiais de construção', peso: '2.400 kg', distancia: '68 km', valor: 'R$ 610' },
    { origem: 'Niterói', destino: 'Nova Friburgo', carga: 'Alimentos e insumos', peso: '1.100 kg', distancia: '135 km', valor: 'R$ 890' },
    { origem: 'São Gonçalo', destino: 'Cabo Frio', carga: 'Móveis e eletrodomésticos', peso: '860 kg', distancia: '150 km', valor: 'R$ 950' },
  ];

  function render() {
    lista.innerHTML = fretes.map((f, i) => `
      <div class="load-card" data-i="${i}">
        <div>
          <span class="badge solicitado">SOLICITADO</span>
          <div class="route" style="margin-top:10px;">${f.origem} <span class="arrow">→</span> ${f.destino}</div>
          <div class="meta-row">
            <div class="meta-item">Carga: <b>${f.carga}</b></div>
            <div class="meta-item">Peso: <b>${f.peso}</b></div>
            <div class="meta-item">Distância: <b>${f.distancia}</b></div>
          </div>
        </div>
        <div>
          <div class="price-tag">${f.valor}<span>VALOR ESTIMADO</span></div>
          <button class="btn btn-primary" style="margin-top:10px;" onclick="aceitarFrete(${i})">Aceitar frete</button>
        </div>
      </div>
    `).join('') || '<div class="empty-state">Nenhum frete disponível na sua região no momento.</div>';
  }

  window.aceitarFrete = function (i) {
    const f = fretes[i];
    fretes.splice(i, 1);
    render();
    document.getElementById('painelAceitos').style.display = 'block';
    document.getElementById('painelAceitos').scrollIntoView({ behavior: 'smooth' });
  };

  const btnEntregar = document.getElementById('btnEntregar');
  if (btnEntregar) {
    btnEntregar.addEventListener('click', () => {
      const passos = document.querySelectorAll('#painelAceitos .step');
      passos.forEach(p => p.classList.add('done'));
      passos.forEach(p => p.classList.remove('active'));
      document.querySelector('#painelAceitos .badge').textContent = 'ENTREGUE';
      document.querySelector('#painelAceitos .badge').className = 'badge entregue';
      btnEntregar.disabled = true;
      btnEntregar.textContent = 'Frete concluído';
    });
  }

  render();
})();

// ---------- DASHBOARD CLIENTE ----------
(function initDashboardCliente() {
  const lista = document.getElementById('listaCaminhoneiros');
  if (!lista) return;

  const caminhoneiros = [
    { nome: 'Carlos Eduardo Souza', veiculo: 'Carreta · 12.000 kg', nota: '4.6', eta: '18 min', regiao: 'RJ e região' },
    { nome: 'Marcos Vinícius Lima', veiculo: 'Caminhão truck · 6.500 kg', nota: '4.9', eta: '32 min', regiao: 'Baixada Fluminense' },
    { nome: 'Renata Almeida', veiculo: 'Van utilitária · 1.800 kg', nota: '4.7', eta: '9 min', regiao: 'Rio de Janeiro (capital)' },
  ];

  lista.innerHTML = caminhoneiros.map(c => `
    <div class="load-card">
      <div>
        <div class="route" style="font-size:1.1rem;">${c.nome}</div>
        <div class="meta-row">
          <div class="meta-item">Veículo: <b>${c.veiculo}</b></div>
          <div class="meta-item">Avaliação: <b>★ ${c.nota}</b></div>
          <div class="meta-item">Região: <b>${c.regiao}</b></div>
        </div>
      </div>
      <div>
        <div class="price-tag" style="color:var(--ink);">${c.eta}<span>CHEGADA ESTIMADA</span></div>
        <button class="btn btn-outline" style="margin-top:10px;">Convidar para o frete</button>
      </div>
    </div>
  `).join('');

  // cálculo automático de frete estimado (simulação didática)
  const peso = document.getElementById('pesoCarga');
  const valor = document.getElementById('valorEstimado');
  const DISTANCIA_SIMULADA_KM = 90;

  function calcular() {
    const kg = parseFloat(peso.value) || 0;
    const total = DISTANCIA_SIMULADA_KM * 4.2 + kg * 0.35;
    valor.value = kg > 0 ? `R$ ${total.toFixed(2).replace('.', ',')}` : '';
  }

  peso.addEventListener('input', calcular);

  document.getElementById('fSolicitacao').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Solicitação publicada. Em uma versão completa, ela apareceria em tempo real para os caminhoneiros da região.');
  });
})();
