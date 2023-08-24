function abrirMenu() {
  document.getElementById("menuLateral").style.width = "250px";
}

function fecharMenu() {
  document.getElementById("menuLateral").style.width = "0";
}

var selectedAtividades = [];
let alertShown = false;

function evitaConflito() {
  var grupos = document.querySelectorAll('.group-checkbox');

  grupos.forEach(function (grupo) {
    var grupoId = grupo.getAttribute('data-group');
    var checkboxes = grupo.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener('click', function () {
        if (this.checked) {
          var currentStart = parseInt(this.getAttribute('start'));
          var currentEnd = parseInt(this.getAttribute('end'));

          var canAddAtividade = true;
          var checkboxesMesmoGrupo = grupo.querySelectorAll('input[type="checkbox"]:checked');
          checkboxesMesmoGrupo.forEach(function (selectedCheckbox) {
            if (selectedCheckbox !== checkbox) {
              var selectedStart = parseInt(selectedCheckbox.getAttribute('start'));
              var selectedEnd = parseInt(selectedCheckbox.getAttribute('end'));

              if (currentStart >= selectedEnd || currentEnd <= selectedStart) {
                console.log("");
              } else {
                canAddAtividade = false;
              }
            }
          });

          if (canAddAtividade) {
            selectedAtividades.push(checkbox.getAttribute('atividade'));
            console.log("A atividade " + atividade + " foi adicionada à lista de nomes.");
            atualizarTabela(checkbox);
          } else {
              this.checked = false;
              var atividade = checkbox.getAttribute("atividade");
              console.log("A atividade " + atividade + " não foi adicionada à lista de nomes.");
              alert("Conflito de horário. A atividade: " + atividade + " não pôde ser adicionada.");

          }
        } else {
          var index = selectedAtividades.indexOf(checkbox.getAttribute('atividade'));
          if (index !== -1) {
            selectedAtividades.splice(index, 1);
            atualizarTabela(checkbox);
            console.log("Checkbox " + checkbox.id + " removida da lista de nomes.");
          }
        }
      });
    });
  });

  
  function atualizarTabela(checkbox) {
    var i = checkbox.getAttribute("linha");
    console.log(checkbox)
    atualizarCelula("L" + i + "S" + i, document.getElementById("segunda" + i));
    atualizarCelula("L" + i + "T" + i, document.getElementById("terça" + i));
    atualizarCelula("L" + i + "Q" + i, document.getElementById("quarta" + i));
    atualizarCelula("L" + i + "QT" + i, document.getElementById("quinta" + i));
    atualizarCelula("L" + i + "SEX" + i, document.getElementById("sexta" + i));
  }

  // Função auxiliar para atualizar uma célula da tabela
  function atualizarCelula(celulaID, checkbox) {
    var celula = document.getElementById(celulaID);
    if (checkbox?.checked) {
      celula.textContent = checkbox.getAttribute("atividade");
    } else {
      celula.textContent = "";
    }
  }

}

document.addEventListener('DOMContentLoaded', evitaConflito);
function gerar() {
        
  const tabela = document.getElementById('tabela'); // Coloque o ID correto da sua tabela aqui
  let restaurador = document.getElementById('tabela').innerHTML;

  const rows = tabela.rows;

  const linhasVazias = [];
  for (let i = rows.length - 1; i >= 0; i--) {
      const row = rows[i];
      let isEmpty = true;
      for (let j = 0; j < row.cells.length; j++) {
          if (row.cells[j].textContent.trim() !== '') {
              isEmpty = false;
              break;
          }
      }
      if (isEmpty) {
          linhasVazias.push(i);
      }
  }

  linhasVazias.forEach(rowIndex => {
      tabela.deleteRow(rowIndex);
  });

  var doc = new jsPDF({ orientation: 'vertical', unit: 'mm', lineHeight: 1.0 });

  html2canvas(document.getElementById("tabela")).then(function (canvas) {
    var imgData = canvas.toDataURL('image/png');

    doc.addImage(imgData, 'PNG', 10, 10, 190, 0);


    doc.save('tabela.pdf');
    document.getElementById('tabela').innerHTML = restaurador;
  });
}


