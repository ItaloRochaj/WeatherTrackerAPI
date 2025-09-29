#!/bin/bash

echo "=== Testando correção da APOD para 2024-08-29 ==="

# Fazer login e obter token
echo "1. Fazendo login..."
TOKEN=$(curl -k -s -X POST https://localhost:7230/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"italorochaj@gmail.com","password":"Luke@159753@"}' \
  | jq -r '.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
    echo "❌ Falha no login"
    exit 1
fi

echo "✅ Login realizado com sucesso"

# Buscar APOD atual para 2024-08-29
echo "2. Buscando APOD atual para 2024-08-29..."
CURRENT_APOD=$(curl -k -s -H "Authorization: Bearer $TOKEN" \
  "https://localhost:7230/api/nasa/apod?date=2024-08-29")

echo "APOD atual:"
echo $CURRENT_APOD | jq '.title'

# Forçar sincronização
echo "3. Forçando sincronização com NASA API..."
SYNCED_APOD=$(curl -k -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://localhost:7230/api/nasa/apod/sync?date=2024-08-29")

echo "APOD após sincronização:"
echo $SYNCED_APOD | jq '.title'

# Verificar se foi corrigido
EXPECTED_TITLE="Star Factory Messier 17"
ACTUAL_TITLE=$(echo $SYNCED_APOD | jq -r '.title')

if [ "$ACTUAL_TITLE" = "$EXPECTED_TITLE" ]; then
    echo "✅ APOD corrigida com sucesso!"
    echo "Título correto: $ACTUAL_TITLE"
else
    echo "❌ APOD ainda incorreta"
    echo "Esperado: $EXPECTED_TITLE"
    echo "Atual: $ACTUAL_TITLE"
fi