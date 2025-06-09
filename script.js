const STORAGE_KEY = 'fmp_turmas';

// Funções para a página index.html
if (document.getElementById('laboratorios')) {
  const relogio = document.getElementById('relogio');
  const horaAtualizacao = document.getElementById('hora-atualizacao');
  
  function atualizarRelogio() {
    const agora = new Date();
    relogio.textContent = agora.toLocaleTimeString();
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
          <p><strong>Horário:</strong> ${turma.horario}</p>
        `;
        laboratoriosContainer.appendChild(box);
      } 
      else if (turma.sala === 'Auditório Principal') {
        box.innerHTML = `
          <h3>${turma.sala}</h3>
          <p><strong>Evento:</strong> ${turma.turma}</p>
          <p><strong>Palestrante:</strong> ${turma.professor}</p>
          ${turma.tema ? `<p><strong>Tema:</strong> ${turma.tema}</p>` : ''}
          <p><strong>Horário:</strong> ${turma.horario}</p>
        `;
        auditorioContainer.appendChild(box);
      } 
      else if (turma.sala === 'Sala Multiuso') {
        box.innerHTML = `
          <h3>${turma.sala}</h3>
          <p><strong>Atividade:</strong> ${turma.turma}</p>
          <p><strong>Responsável:</strong> ${turma.professor}</p>
          <p><strong>Horário:</strong> ${turma.horario}</p>
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
  const salaSelect = document.getElementById('sala');
  
  // Configurar eventos
  tipoSalaSelect.addEventListener('change', atualizarCamposSala);
  formTurma.addEventListener('submit', adicionarTurma);
  botaoLimpar.addEventListener('click', limparTudo);
  
  // Carregar turmas ao iniciar
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
  
  function adicionarTurma(e) {
    e.preventDefault();
    
    const tipoSala = tipoSalaSelect.value;
    const sala = salaSelect.value;
    const horario = document.getElementById('horario').value;
    const turma = document.getElementById('turma').value.trim();
    const professor = document.getElementById('professor').value.trim();
    const tema = tipoSala === 'auditorio' ? document.getElementById('tema').value.trim() : '';
    
    if (!sala || !turma || !professor || !horario) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }
    
    const novaTurma = { 
      tipoSala,
      sala, 
      turma, 
      professor,
      horario,
      tema
    };
    
    const turmas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    turmas.push(novaTurma);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(turmas));
    
    formTurma.reset();
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
          <strong>${turma.sala}</strong>: ${turma.turma} - ${turma.professor} (${turma.horario})
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