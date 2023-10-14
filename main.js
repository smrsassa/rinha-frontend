const elemJsonUploadArea = document.getElementById('jsonUploadArea');
const elemJsonCodeArea = document.getElementById('jsonCodeArea');
const elemJsonCodeContent = document.getElementById('json-code')
const elemJsonInput = document.getElementById('seletorArquivo');
const elemSalvarJson = document.getElementById('salvarJson');
const elemListaJson = document.getElementById('listaJson');

var fileName;

function showJsonUploadArea() {
	elemJsonUploadArea.style.display = 'flex';
	elemJsonCodeArea.style.display = 'none';
	elemSalvarJson.style.display = 'none';

	elemJsonCodeContent.textContent = "";
	elemJsonInput.value = '';
}
function showJsonCodeArea() {
	elemJsonUploadArea.style.display = 'none';
	elemJsonCodeArea.style.display = 'flex';
	elemSalvarJson.style.display = 'block';
}

function clearLocalStorage() {
	localStorage.clear();
	listSavedJsons();
}

function saveJson() {
	localStorage.setItem(fileName, elemJsonCodeContent.textContent);

	listSavedJsons();
}

function getSavedJson(key) {
	var valorSalvo = localStorage.getItem(key);

	elemJsonCodeContent.textContent = valorSalvo;
	elemJsonCodeContent.removeAttribute("data-highlighted");
	hljs.highlightElement(elemJsonCodeContent);
}

function deleteJson(key) {
	localStorage.removeItem(key);
	listSavedJsons();
	showJsonUploadArea();
}

function listSavedJsons() {
	while (elemListaJson.firstChild) {
		elemListaJson.removeChild(elemListaJson.firstChild);
	}

	let numItems = localStorage.length;

	if (numItems > 0) {
		for (let i = 0; i < numItems; i++) {
			let key = localStorage.key(i);

            var newItem = document.createElement("li");
            var link = document.createElement("a");
            var span = document.createElement("span");

            link.href = "#";
			link.className = "btnDestaque file";
			link.textContent = key;
			link.setAttribute("data-filename", key);

            link.addEventListener("click", (event) => {
                event.preventDefault();
                var valorDoAtributo = event.target.getAttribute('data-filename');

				fileName = valorDoAtributo;
				getSavedJson(valorDoAtributo);
				showJsonCodeArea();
            });

            span.innerHTML = '<a href="#" onclick="deleteJson(\''+key+'\')" class="deleteJson"><svg width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="#9CA3AF" d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z"/></svg></a>';

            newItem.appendChild(link);
            newItem.appendChild(span);

            elemListaJson.appendChild(newItem);
		}
	}
}

elemJsonInput.addEventListener('change', (e) => {
	const arquivoSelecionado = e.target.files[0];

	if (arquivoSelecionado) {
		const leitor = new FileReader();

		leitor.onload = function(e) {
			const conteudo = e.target.result;
			var formatted;
			try {
				formatted = JSON.stringify(JSON.parse(conteudo), null, 4);
			} catch (error) {
				if (error == "RangeError: Invalid string length")
					formatted = "ERRO: Arquivo muito grande";
				else
					formatted = "ERRO: JSON Invalido!"
			}
			elemJsonCodeContent.textContent = formatted;
		};

		fileName = elemJsonInput.files[0].name;

		leitor.readAsText(arquivoSelecionado);
		showJsonCodeArea();
		elemJsonCodeContent.removeAttribute("data-highlighted");
		hljs.highlightElement(elemJsonCodeContent);
	}
});

window.onload = () => {
	listSavedJsons();
};
