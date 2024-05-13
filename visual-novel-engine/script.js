// TODO: compartimentalizar objetos individuais: titulo, menu, caixa de texto e personagens

function carregarComponente(scene) {
  // Carrega o conteúdo HTML
  fetch('templates/' + scene + '/' + scene + '.html')
    .then(response => response.text())
    .then(data => {
      // Insere o conteúdo carregado no elemento #mainframe do HTML principal
      document.getElementById('mainframe').innerHTML = data;

      // Load and execute the script
      loadScript('templates/' + scene + '/' + scene + '.js');
    })
    .catch(error => {
      console.error('Erro ao carregar o componente:', error);
    });
}

// Função para carregar e executar um arquivo de script
function loadScript(url) {
  var script = document.createElement('script');
  script.src = url;
  document.body.appendChild(script);
}

window.loadScene = carregarComponente
loadScene('title')
