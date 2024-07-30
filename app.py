import requests
from collections import defaultdict

# URL da API
url = "https://dummyjson.com/users"

# Parâmetro limit para especificar o número de usuários
params = {"limit": 10}  # Por exemplo, obter 10 usuários

# Enviar a requisição GET para a API
response = requests.get(url, params=params)

# Verificar se a requisição foi bem-sucedida
if response.status_code == 200:
    # Extrair os dados da resposta
    users = response.json().get("users", [])

    # Agrupar usuários por estado
    users_by_state = defaultdict(list)
    for user in users:
        state = user.get("address", {}).get("state", "Desconhecido")
        name = f"{user.get('firstName', '')} {user.get('lastName', '')}"
        users_by_state[state].append((name, user))

    # Ordenar estados e usuários por nome dentro de cada estado
    for state in sorted(users_by_state.keys()):  # Ordenar os estados
        sorted_users = sorted(
            users_by_state[state], key=lambda x: x[0]
        )  # Ordenar usuários por nome
        print(f"Estado: {state}")
        for name, user in sorted_users:
            print(f"  Nome: {name}")
            print(f"  Idade: {user.get('age', 'N/A')}")
            print(f"  Username: {user.get('username', 'N/A')}")
            address = user.get("address", {})
            print(
                f"  Endereço: {address.get('address', 'N/A')}, {address.get('city', 'N/A')}, {address.get('state', 'N/A')}"
            )
            print("-" * 20)
else:
    print("Falha ao obter os dados da API")
