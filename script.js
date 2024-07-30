document.addEventListener('DOMContentLoaded', () => {
    fetch('https://dummyjson.com/users?limit=10')
        .then(response => response.json())
        .then(data => {
            const users = data.users;
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

            const userListContainer = document.getElementById('user-list');

            Object.keys(usersByState).sort().forEach(state => {
                const stateSection = document.createElement('div');
                stateSection.classList.add('mb-4');

                const stateTitle = document.createElement('h3');
                stateTitle.classList.add('state-title');
                stateTitle.textContent = state;

                stateSection.appendChild(stateTitle);

                usersByState[state].sort((a, b) => a.name.localeCompare(b.name)).forEach(user => {
                    const userCard = document.createElement('div');
                    userCard.classList.add('card', 'user-card');
                    userCard.innerHTML = `
                        <div class="card-body">
                            <h5 class="card-title">${user.name}</h5>
                            <p class="card-text"><strong>Idade:</strong> ${user.age}</p>
                            <p class="card-text"><strong>Username:</strong> ${user.username}</p>
                            <p class="card-text"><strong>Endereço:</strong> ${user.address}</p>
                        </div>
                    `;
                    stateSection.appendChild(userCard);
                });

                userListContainer.appendChild(stateSection);
            });
        });

    let limit = 10;
    let skip = 0;

    document.addEventListener('DOMContentLoaded', () => {
        const userListContainer = document.getElementById('user-list');
        const loadMoreButton = document.getElementById('load-more');

        function fetchUsers() {
            fetch(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`)
                .then(response => response.json())
                .then(data => {
                    const users = data.users;
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

                    Object.keys(usersByState).sort().forEach(state => {
                        const stateSection = document.createElement('div');
                        stateSection.classList.add('state-section');

                        const stateTitle = document.createElement('div');
                        stateTitle.classList.add('state-title');
                        stateTitle.textContent = state;

                        stateSection.appendChild(stateTitle);

                        usersByState[state].sort((a, b) => a.name.localeCompare(b.name)).forEach(user => {
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

                    // Atualizar o valor de skip para carregar mais usuários na próxima requisição
                    skip += limit;

                    // Verificar se há mais usuários para carregar
                    if (data.users.length < limit) {
                        loadMoreButton.style.display = 'none';  // Ocultar o botão se não houver mais usuários
                    }
                })
                .catch(error => console.error('Erro ao carregar os dados:', error));
        }

        // Inicializar com os primeiros usuários
        fetchUsers();

        // Adicionar o evento de clique ao botão "Carregar mais"
        loadMoreButton.addEventListener('click', fetchUsers);
    });

});