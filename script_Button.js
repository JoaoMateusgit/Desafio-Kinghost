document.addEventListener('DOMContentLoaded', () => {
    const userListContainer = document.getElementById('user-list');
    const userLimitSelect = document.getElementById('user-limit');

    // Função para buscar e exibir os usuários
    function fetchUsers(limit) {
        fetch('https://dummyjson.com/users')
            .then(response => response.json())
            .then(data => {
                const users = data.users;

                // Agrupar usuários por estado
                const usersByState = {};
                users.forEach(user => {
                    const state = user.address.state || 'Desconhecido';
                    const name = `${user.firstName} ${user.lastName}`;
                    if (!usersByState[state]) {
                        usersByState[state] = [];
                    }
                    usersByState[state].push({
                        name: name,
                        age: user.age,
                        username: user.username,
                        address: `${user.address.address}, ${user.address.city}, ${user.address.state}`
                    });
                });

                // Limpar o container antes de adicionar novos dados
                userListContainer.innerHTML = '';

                // Mostrar apenas os primeiros `limit` usuários
                const usersToShow = [];
                Object.keys(usersByState).sort().forEach(state => {
                    usersByState[state].sort((a, b) => a.name.localeCompare(b.name)).forEach(user => {
                        if (usersToShow.length < limit) {
                            usersToShow.push({ ...user, state });
                        }
                    });
                });

                // Agrupar os usuários filtrados por estado
                const usersByStateFiltered = {};
                usersToShow.forEach(user => {
                    const state = user.state;
                    if (!usersByStateFiltered[state]) {
                        usersByStateFiltered[state] = [];
                    }
                    usersByStateFiltered[state].push(user);
                });

                // Adicionar os dados ao container
                Object.keys(usersByStateFiltered).sort().forEach(state => {
                    const stateSection = document.createElement('div');
                    stateSection.classList.add('state-section');

                    const stateTitle = document.createElement('div');
                    stateTitle.classList.add('state-title');
                    stateTitle.textContent = state;

                    stateSection.appendChild(stateTitle);

                    usersByStateFiltered[state].forEach(user => {
                        const userCard = document.createElement('div');
                        userCard.classList.add('user-card');
                        userCard.innerHTML = `
                            <p><strong>Nome:</strong> ${user.name}</p>
                            <p><strong>Idade:</strong> ${user.age}</p>
                            <p><strong>Username:</strong> ${user.username}</p>
                            <p><strong>Endereço:</strong> ${user.address}</p>
                        `;
                        stateSection.appendChild(userCard);
                    });

                    userListContainer.appendChild(stateSection);
                });
            })
            .catch(error => console.error('Erro ao carregar os dados:', error));
    }

    // Função para atualizar a visualização com base no limite selecionado
    function updateUserList() {
        const limit = parseInt(userLimitSelect.value, 10);
        fetchUsers(limit);
    }

    // Adicionar o evento de mudança ao menu suspenso
    userLimitSelect.addEventListener('change', updateUserList);

    // Inicializar com o limite padrão
    updateUserList();
});
