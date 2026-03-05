#!/bin/sh
# =============================================================================
# OpenZyra - Script de démarrage pour NAS Synology
# =============================================================================
# Ce script démarre l'application OpenZyra (frontend React + backend Python)
# avec Node.js et Python embarqués dans le dossier de l'application.
# Ainsi, pas de dépendance aux versions système du NAS.
#
# PRÉREQUIS:
# - Node.js doit être extrait dans: $APP_DIR/node-vXX.X.X-linux-x64/
# - Python (venv) doit être créé dans: $APP_DIR/.venv/
# - Fichiers sources OpenZyra présents
#
# INSTALLATION NODE:
# cd /volume1/Technique/Rennes/OpenZyra
# wget https://nodejs.org/dist/v20.11.0/node-v20.11.0-linux-x64.tar.xz
# tar -xf node-v20.11.0-linux-x64.tar.xz
# rm node-v20.11.0-linux-x64.tar.xz
#
# INSTALLATION PYTHON VENV:
# cd /volume1/Technique/Rennes/OpenZyra
# python3 -m venv .venv
# .venv/bin/pip install -r server/requirements.txt
# =============================================================================

APP_DIR="/volume1/Technique/Rennes/OpenZyra"

# Configuration du PATH pour Node.js local (embarqué)
# Modifier la version selon ce que vous avez téléchargé
NODE_VERSION="v20.11.0"
FRONTEND_PORT=3080
BACKEND_PORT=3081
export PATH="$APP_DIR/node-$NODE_VERSION-linux-x64/bin:$PATH"

# Vérification que le dossier existe
cd "$APP_DIR" || { echo "ERREUR: Impossible d'accéder à $APP_DIR"; exit 1; }

echo "=========================================="
echo "OpenZyra - Démarrage sur Synology"
echo "=========================================="
echo ""

# =============================================================================
# ÉTAPE 1: Arrêt des anciennes instances
# =============================================================================
echo "[1/5] Arrêt des anciennes instances..."

# Arrêter le frontend Vite (port 3080)
pkill -f "vite" 2>/dev/null || true
pkill -f "node.*OpenZyra" 2>/dev/null || true

# Arrêter le backend Python Flask (port 3081)
pkill -f "ovh_backend.py" 2>/dev/null || true
pkill -f "python.*flask" 2>/dev/null || true

# Attendre que les ports soient libérés
echo "Attente libération des ports..."
sleep 2

# Vérifier si les ports sont encore occupés (3080 et 3081)
PORT_FRONTEND=$(netstat -tlnp 2>/dev/null | grep ":$FRONTEND_PORT" || ss -tlnp 2>/dev/null | grep ":$FRONTEND_PORT" || echo "")
PORT_BACKEND=$(netstat -tlnp 2>/dev/null | grep ":$BACKEND_PORT" || ss -tlnp 2>/dev/null | grep ":$BACKEND_PORT" || echo "")

if [ -n "$PORT_FRONTEND" ]; then
    echo "AVERTISSEMENT: Port $FRONTEND_PORT encore occupé"
fi
if [ -n "$PORT_BACKEND" ]; then
    echo "AVERTISSEMENT: Port $BACKEND_PORT encore occupé"
fi

echo ""

# =============================================================================
# ÉTAPE 2: Vérification des prérequis
# =============================================================================
echo "[2/5] Vérification des prérequis..."

# Vérifier Node.js
if [ ! -f "$APP_DIR/node-$NODE_VERSION-linux-x64/bin/node" ]; then
    echo "ERREUR: Node.js non trouvé dans $APP_DIR/node-$NODE_VERSION-linux-x64/"
    echo "Téléchargez et extrayez Node.js:"
    echo "  wget https://nodejs.org/dist/v20.11.0/node-v20.11.0-linux-x64.tar.xz"
    echo "  tar -xf node-v20.11.0-linux-x64.tar.xz"
    exit 1
fi

# Vérifier Python venv
if [ ! -f "$APP_DIR/.venv/bin/python" ]; then
    echo "ERREUR: Python venv non trouvé dans $APP_DIR/.venv/"
    echo "Créez l'environnement virtuel:"
    echo "  python3 -m venv .venv"
    echo "  .venv/bin/pip install -r server/requirements.txt"
    exit 1
fi

# Vérifier package.json
if [ ! -f "$APP_DIR/package.json" ]; then
    echo "ERREUR: package.json non trouvé. Êtes-vous dans le bon dossier?"
    exit 1
fi

echo "  ✓ Node.js: $(node --version 2>/dev/null || echo 'N/A')"
echo "  ✓ npm: $(npm --version 2>/dev/null || echo 'N/A')"
echo "  ✓ Python venv: $APP_DIR/.venv"
echo ""

# =============================================================================
# ÉTAPE 3: Installation des dépendances (si nécessaire)
# =============================================================================
echo "[3/5] Vérification des dépendances Node..."

if [ ! -d "$APP_DIR/node_modules" ]; then
    echo "  → node_modules manquant, installation en cours..."
    npm ci
    if [ $? -ne 0 ]; then
        echo "ERREUR: npm install a échoué"
        exit 1
    fi
else
    echo "  ✓ node_modules présent"
fi

echo ""

# =============================================================================
# ÉTAPE 4: Build du frontend (production)
# =============================================================================
echo "[4/5] Build du frontend..."

# Nettoyer et rebuild
rm -rf "$APP_DIR/dist" 2>/dev/null
npm run build

if [ $? -ne 0 ]; then
    echo "ERREUR: Build frontend échoué"
    exit 1
fi

echo "  ✓ Frontend buildé dans dist/"
echo ""

# =============================================================================
# ÉTAPE 5: Démarrage des services
# =============================================================================
echo "[5/5] Démarrage des services..."
echo ""

# Créer les fichiers de log
touch "$APP_DIR/backend.log"
touch "$APP_DIR/frontend.log"

# --- Démarrage Backend Python (Flask) ---
echo "  → Démarrage Backend Python (port $BACKEND_PORT)..."
cd "$APP_DIR"
export FLASK_PORT=$BACKEND_PORT
nohup "$APP_DIR/.venv/bin/python" server/ovh_backend.py > backend.log 2>&1 &
BACKEND_PID=$!
echo "    PID backend: $BACKEND_PID"

# Attendre que le backend démarre
sleep 3

# Vérifier si le backend tourne
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "    ✗ Backend a crashé au démarrage!"
    echo "    Derniers logs:"
    tail -n 5 backend.log
    exit 1
fi

echo "    ✓ Backend démarré"

# --- Démarrage Frontend Vite (Preview mode production) ---
echo "  → Démarrage Frontend Vite (port $FRONTEND_PORT)..."
cd "$APP_DIR"
nohup npm run preview -- --port $FRONTEND_PORT > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "    PID frontend: $FRONTEND_PID"

# Attendre que le frontend démarre
sleep 3

# Vérifier si le frontend tourne
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "    ✗ Frontend a crashé au démarrage!"
    echo "    Derniers logs:"
    tail -n 5 frontend.log
    # Arrêter le backend si frontend échoue
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "    ✓ Frontend démarré"
echo ""

# =============================================================================
# RÉCAPITULATIF
# =============================================================================
echo "=========================================="
echo "OpenZyra DÉMARRÉ !"
echo "=========================================="
echo ""
echo "  Frontend: http://$(hostname -I | awk '{print $1}'):$FRONTEND_PORT"
echo "  Backend API: http://$(hostname -I | awk '{print $1}'):$BACKEND_PORT"
echo ""
echo "  Logs:"
echo "    Frontend: tail -f $APP_DIR/frontend.log"
echo "    Backend:  tail -f $APP_DIR/backend.log"
echo ""
echo "  Commandes utiles:"
echo "    Arrêter:  kill $FRONTEND_PID $BACKEND_PID"
echo "    Status:   ps aux | grep -E '(vite|ovh_backend)'"
echo ""
echo "=========================================="
echo "Vérification des services..."
echo "=========================================="
sleep 2

# Health check Frontend
curl -s http://localhost:$FRONTEND_PORT > /dev/null
if [ $? -eq 0 ]; then
    echo "✓ Frontend répond sur port $FRONTEND_PORT"
else
    echo "✗ Frontend ne répond pas"
fi

# Health check Backend
curl -s http://localhost:$BACKEND_PORT/api/groups > /dev/null
if [ $? -eq 0 ]; then
    echo "✓ Backend API répond sur port $BACKEND_PORT"
else
    echo "✗ Backend ne répond pas (peut-être normal si pas de données OVH)"
fi

echo ""
echo "Logs en temps réel:"
echo "  Frontend: tail -f $APP_DIR/frontend.log"
echo "  Backend:  tail -f $APP_DIR/backend.log"
