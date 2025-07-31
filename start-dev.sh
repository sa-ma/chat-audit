#!/bin/bash

# Start ChatAudit development servers
echo "🚀 Starting ChatAudit development servers..."

# Start Rails server in background
echo "📡 Starting Rails API server on port 3001..."
cd server
bundle exec rails server -p 3001 &
SERVER_PID=$!
cd ..

# Start Next.js client in background
echo "🎨 Starting Next.js client server on port 3000..."
cd client
npm run dev &
CLIENT_PID=$!
cd ..

echo "✅ Both servers are starting..."
echo "📱 Client: http://localhost:3000"
echo "🔧 Server API: http://localhost:3001/api"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
trap "echo '🛑 Stopping servers...'; kill $SERVER_PID $CLIENT_PID; exit" INT
wait 