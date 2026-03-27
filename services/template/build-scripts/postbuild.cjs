const fs = require('fs');

// Caminho do arquivo package.json
const filePath = './out/package.json';

// Lê o arquivo package.json
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Erro ao ler o arquivo:', err);
    return;
  }

  try {
    // Parse o conteúdo do arquivo
    const json = JSON.parse(data);

    // Remove a propriedade 'type' se existir
    delete json.type;

    // Converte o objeto de volta para string JSON
    const updatedData = JSON.stringify(json, null, 2);

    // Escreve de volta o arquivo modificado
    fs.writeFile(filePath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error('Erro ao escrever no arquivo:', err);
      }
    });
  } catch (parseError) {
    console.error('Erro ao parsear o arquivo JSON:', parseError);
  }
});
