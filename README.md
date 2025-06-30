# ProjetoWebDevSD
Projeto conjunto Disciplina Sistemas Distribuídos (5954025) e Introdução ao Desenvolvimento Web (5954024)

Para facilitar, adotei um nome padrão para a aplicacao como airport mvp, pois a ideia seria o mínimo produto
viável para utilizacao do funcionário de gerência dos voos do aeroporto.

Instrucoes para rodar localmente e testar
Acesso ao banco de dados:
Dentro do projeto, terá a pasta database, com o arquivo 'estrutura.sql'. Esse arquivo contém os comandos para recriar a base de dados utilizada no meu projeto, tanto as tabelas como a populacao do banco, através da tecnologia PostgreSQL. 
Assim, basta executar o comando:
createdb airport_mvp
psql airport_mvp -f database/airportdb_completo.sql

Execução do frontend (lado cliente):
cd backend
npm install
npm run dev

Execução do backend (lado servidor): 
cd frontend/ui
npm install
npm start

A aplicacao estará disponível para testes no local gerado pelo vite.

Atualizarei esse arquivo quando a aplicação estiver disponível em algum servidor.

Tive um problema para o commit com o meu mac, ele gerou diversos arquivos Ds_Store indesejados, por isso, recomitei no linux, para acabar com esses arquivos.
Os outros commits era para remover um a um, porém estava demorando muito tempo.
