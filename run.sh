#!/bin/bash
# run.sh
# यह script app.js को run करेगी

echo "📥 Updating latest code from GitHub..."
git pull origin main

echo "🚀 Running the app..."
node app.js

echo "✅ App finished running."
