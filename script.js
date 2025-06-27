const STORAGE_KEY = 'fmp_turmas';

// Horários disponíveis por período
const HORARIOS = {
  matutino: [
    '08:00 - 09:30',
    '09:40 - 11:10',
    '11:20 - 12:50'
  ],
  vespertino: [
    '13:00 - 15:00',
    '15:10 - 16:40',
    '16:50 - 18:30'
  ],
  noturno: [
    '19:00 - 20:30',
    '20:40 - 22:00'
  ]
};

// Funções para a página index.html
if (document.getElementById('laboratorios')) {
  const relogio = document.getElementById('relogio');
  const dataAtual = document.getElementById('data-atual');
  const horaAtualizacao = document.getElementById('hora-atualizacao');
  
  function atualizarRelogio() {
    const agora = new Date();
    relogio.textContent = agora.toLocaleTimeString();
    dataAtual.textContent = agora.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
  
  function atualizarHoraAtualizacao() {
    const agora = new Date();
    horaAtualizacao.textContent = agora.toLocaleTimeString();
  }
  
  function carregarTurmas() {
    const turmas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const laboratoriosContainer = document.getElementById('laboratorios');
    const auditorioContainer = document.getElementById('auditorio');
    const multiusoContainer = document.getElementById('multiuso');
    
    // Limpar containers
    laboratoriosContainer.innerHTML = '';
    auditorioContainer.innerHTML = '';
    multiusoContainer.innerHTML = '';
    
    if (turmas.length === 0) {
      laboratoriosContainer.innerHTML = '<div class="box vazio">Nenhuma turma cadastrada</div>';
      auditorioContainer.innerHTML = '<div class="box vazio">Nenhum evento cadastrado</div>';
      multiusoContainer.innerHTML = '<div class="box vazio">Nenhuma atividade cadastrada</div>';
      return;
    }
    
    // Agrupar turmas por tipo de sala
    turmas.forEach(turma => {
      const box = document.createElement('div');
      box.className = 'box';
      
      if (turma.sala.startsWith('Laboratório')) {
        box.innerHTML = `
          <h3>${turma.sala}</h3>
          <p><strong>Turma:</strong> ${turma.turma}</p>
          <p><strong>Professor:</strong> ${turma.professor}</p>
          <p><strong>Horário:</strong> ${turma.horario.join(', ')}</p>
        `;
        laboratoriosContainer.appendChild(box);
      } 
      else if (turma.sala === 'Auditório Principal') {
        box.innerHTML = `
          <h3>${turma.sala}</h3>
          <p><strong>Evento:</strong> ${turma.turma}</p>
          <p><strong>Palestrante:</strong> ${turma.professor}</p>
          ${turma.tema ? `<p><strong>Tema:</strong> ${turma.tema}</p>` : ''}
          <p><strong>Horário:</strong> ${turma.horario.join(', ')}</p>
        `;
        auditorioContainer.appendChild(box);
      } 
      else if (turma.sala === 'Sala Multiuso') {
        box.innerHTML = `
          <h3>${turma.sala}</h3>
          <p><strong>Atividade:</strong> ${turma.turma}</p>
          <p><strong>Responsável:</strong> ${turma.professor}</p>
          <p><strong>Horário:</strong> ${turma.horario.join(', ')}</p>
        `;
        multiusoContainer.appendChild(box);
      }
    });
    
    atualizarHoraAtualizacao();
  }
  
  // Inicialização
  atualizarRelogio();
  setInterval(atualizarRelogio, 1000);
  carregarTurmas();
  
  // Atualizar a cada 5 segundos
  setInterval(carregarTurmas, 5000);
}

// Funções para a página admin.html
if (document.getElementById('form-turma')) {
  const formTurma = document.getElementById('form-turma');
  const listaTurmas = document.getElementById('turmas-cadastradas');
  const botaoLimpar = document.getElementById('limpar-tudo');
  const tipoSalaSelect = document.getElementById('tipo-sala');
  const grupoNumeroSala = document.getElementById('grupo-numero-sala');
  const grupoTema = document.getElementById('grupo-tema');
  const grupoHorarios = document.getElementById('grupo-horarios');
  const periodoSelect = document.getElementById('periodo');
  const salaSelect = document.getElementById('sala');
  const horariosDisponiveis = document.getElementById('horarios-disponiveis');
  const relogio = document.getElementById('relogio');
  const dataAtual = document.getElementById('data-atual');
  
  function atualizarRelogio() {
    const agora = new Date();
    relogio.textContent = agora.toLocaleTimeString();
    dataAtual.textContent = agora.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
  
  // Configurar eventos
  tipoSalaSelect.addEventListener('change', atualizarCamposSala);
  periodoSelect.addEventListener('change', atualizarHorariosDisponiveis);
  formTurma.addEventListener('submit', adicionarTurma);
  botaoLimpar.addEventListener('click', limparTudo);
  
  // Inicialização
  atualizarRelogio();
  setInterval(atualizarRelogio, 1000);
  carregarTurmasAdmin();
  
  function atualizarCamposSala() {
    const tipoSala = tipoSalaSelect.value;
    
    // Mostrar/ocultar campos conforme o tipo de sala
    grupoNumeroSala.style.display = tipoSala === 'laboratorio' ? 'block' : 'none';
    grupoTema.style.display = tipoSala === 'auditorio' ? 'block' : 'none';
    
    // Atualizar opções do select de sala
    salaSelect.innerHTML = '';
    
    if (tipoSala === 'laboratorio') {
      for (let i = 1; i <= 5; i++) {
        const option = document.createElement('option');
        option.value = `Laboratório ${i}`;
        option.textContent = `Laboratório ${i}`;
        salaSelect.appendChild(option);
      }
    } else if (tipoSala === 'auditorio') {
      const option = document.createElement('option');
      option.value = 'Auditório Principal';
      option.textContent = 'Auditório Principal';
      salaSelect.appendChild(option);
    } else if (tipoSala === 'multiuso') {
      const option = document.createElement('option');
      option.value = 'Sala Multiuso';
      option.textContent = 'Sala Multiuso';
      salaSelect.appendChild(option);
    }
  }
  
  function atualizarHorariosDisponiveis() {
    const periodo = periodoSelect.value;
    
    if (!periodo) {
      grupoHorarios.style.display = 'none';
      return;
    }
    
    grupoHorarios.style.display = 'block';
    horariosDisponiveis.innerHTML = '';
    
    HORARIOS[periodo].forEach(horario => {
      const div = document.createElement('div');
      div.className = 'horario-option';
      div.innerHTML = `
        <input type="checkbox" id="horario-${horario}" value="${horario}">
        <label for="horario-${horario}">${horario}</label>
      `;
      horariosDisponiveis.appendChild(div);
    });
  }
  
  function adicionarTurma(e) {
    e.preventDefault();
    
    const tipoSala = tipoSalaSelect.value;
    const sala = tipoSala === 'laboratorio' ? salaSelect.value : 
                 tipoSala === 'auditorio' ? 'Auditório Principal' : 'Sala Multiuso';
    const periodo = periodoSelect.value;
    const turma = document.getElementById('turma').value.trim();
    const professor = document.getElementById('professor').value.trim();
    const tema = tipoSala === 'auditorio' ? document.getElementById('tema').value.trim() : '';
    
    // Obter horários selecionados
    const checkboxes = horariosDisponiveis.querySelectorAll('input[type="checkbox"]:checked');
    const horarios = Array.from(checkboxes).map(cb => cb.value);
    
    if (!sala || !turma || !professor || !periodo || horarios.length === 0) {
      alert('Por favor, preencha todos os campos obrigatórios e selecione pelo menos um horário!');
      return;
    }
    
    const novaTurma = { 
      tipoSala,
      sala, 
      turma, 
      professor,
      periodo,
      horario: horarios,
      tema
    };
    
    const turmas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    turmas.push(novaTurma);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(turmas));
    
    formTurma.reset();
    grupoHorarios.style.display = 'none';
    grupoNumeroSala.style.display = 'none';
    grupoTema.style.display = 'none';
    carregarTurmasAdmin();
    alert('Turma/Evento cadastrado com sucesso!');
  }
  
  function carregarTurmasAdmin() {
    const turmas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    listaTurmas.innerHTML = '';
    
    if (turmas.length === 0) {
      listaTurmas.innerHTML = '<p>Nenhuma turma cadastrada ainda.</p>';
      return;
    }
    
    turmas.forEach((turma, index) => {
      const div = document.createElement('div');
      div.className = 'turma-item';
      div.innerHTML = `
        <div class="turma-info">
          <strong>${turma.sala}</strong>: ${turma.turma} - ${turma.professor} (${turma.horario.join(', ')})
          ${turma.tema ? `<br><em>Tema: ${turma.tema}</em>` : ''}
        </div>
        <div class="turma-acoes">
          <button class="botao-remover" data-index="${index}">Remover</button>
        </div>
      `;
      listaTurmas.appendChild(div);
    });
    
    // Adicionar eventos aos botões de remover
    document.querySelectorAll('.botao-remover').forEach(botao => {
      botao.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        removerTurma(index);
      });
    });
  }
  
  function removerTurma(index) {
    const turmas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    turmas.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(turmas));
    carregarTurmasAdmin();
  }
  
  function limparTudo() {
    if (confirm('Tem certeza que deseja remover TODAS as turmas/eventos?')) {
      localStorage.removeItem(STORAGE_KEY);
      carregarTurmasAdmin();
    }
  }
}
