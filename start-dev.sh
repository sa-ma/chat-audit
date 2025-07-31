#!/bin/bash

# Start ChatAudit development servers
echo "🚀 Starting ChatAudit development servers..."

# Start Rails backend in background
echo "📡 Starting Rails API server on port 3001..."
cd backend
bundle exec rails server -p 3001 &
BACKEND_PID=$!
cd ..

# Start Next.js frontend in background
echo "🎨 Starting Next.js frontend server on port 3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Both servers are starting..."
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3001/api"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
trap "echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait 