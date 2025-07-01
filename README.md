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

O site está disponível para testes no endereço http://147.79.106.136:3000/

Para subir propriamente, realizei algumas alterações simples para que funcionasse:
Ao criar o banco localmente, eu usava o usuário localmente sem a necessidade da senha, no entanto, nessa máquina, que acesso apenas via terminal, estava dando erro na api.
Então eu adicionei um arquivo dotenv no diretório backend com esse conteúdo:
DATABASE_URL=postgresql://postgres:adminvoos@localhost:5432/airport_mvp
PORT=4000
Para perpetuar a mudança, rodei o comando no banco para adicionar essa senha ao usuário:
ALTER USER postgres WITH PASSWORD 'adminvoos';

Ademais, tive que alterar o valor da variável base_url no frontend/ui/src/services/api.js, de:
baseURL: 'http://localhost:4000/api/v1'
para 'http://147.79.106.136:4000/api/v1'

Adicionei a API ao PM2 além do frontend, para que esteja disponível mesmo que a conexão SSH entre o meu computador e a máquina se encerre.



Assim foi possível expor a API para uso não só na máquina local mas em browsers de máquinas diferentes.

Com essas pequenas alterações, a aplicação agora está acessível remotamente.
