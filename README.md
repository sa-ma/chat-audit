# ChatAudit - Customer Support Chat Compliance Analysis

ChatAudit is a full-stack QA tool that simulates real-time risk analysis of customer support chats. It uses Google Gemini to analyze chat transcripts and identify potential compliance risks.

## 🚀 Features

- **Chat Upload & Analysis**: Upload chat transcripts and get instant risk analysis
- **Real-time Risk Scoring**: AI-powered risk assessment with detailed flagging
- **Compliance Monitoring**: Track sensitive information sharing, false promises, and unprofessional behavior
- **Dashboard View**: Overview of all analyzed chats with risk scores and flag counts

## 🏗️ Architecture

- **Client**: Next.js 14 with TypeScript, Tailwind CSS, and shadcn/ui
- **Server**: Ruby on Rails API with SQLite database
- **AI Integration**: Google Gemini 2.5 Flash Lite for chat analysis

## 📋 Prerequisites

- Node.js 18+ and npm
- Ruby 3.2+ and Bundler
- Google Gemini API key (required)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd chat-audit
```

### 2. Server Setup (Rails API)

```bash
cd server

# Install dependencies
bundle install

# Set up database
bundle exec rails db:migrate
bundle exec rails db:seed

# Start the Rails server (runs on port 3001)
bundle exec rails server -p 3001
```

### 3. Frontend Setup (Next.js)

```bash
cd client

# Install dependencies
npm install

# Start the development server (runs on port 3000)
npm run dev
```

### 4. Environment Configuration

Create a `.env.local` file in the client directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### Google Gemini API Setup

1. **Get an API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to create a free API key
2. **Configure Server**: Add your API key to Rails credentials:

```bash
cd server
bundle exec rails credentials:edit
```

Add your Gemini API key to the credentials file:

```yaml
# Used as the base secret for all MessageVerifiers in Rails, including the one protecting cookies.
secret_key_base: [your-secret-key-base]

# API Keys
gemini_api_key: your_actual_gemini_api_key_here
```

**Note**: A valid Gemini API key is required for the application to function.

## 🎯 Usage

1. **Dashboard**: View all analyzed chats with risk scores and flag counts
2. **Upload Chat**: Submit new chat transcripts for analysis
3. **Chat Details**: View full transcripts with highlighted risk flags
4. **Risk Analysis**: See detailed explanations for each flagged message

## 📊 Sample Data

The application comes with sample chat data including:
- High-risk chat with credit card information sharing
- Medium-risk chat with unauthorized promises
- Low-risk chat with proper handling

## 🔧 API Endpoints

### Server (Rails API)

- `GET /api/chats` - List all chats
- `GET /api/chats/:id` - Get chat details
- `POST /api/chats` - Create and analyze new chat

### Request Format

```json
{
  "chat": {
    "agent_name": "Agent Name",
    "transcript": "Customer: Hello\nAgent: Hi there..."
  }
}
```

### Response Format

```json
{
  "id": 1,
  "agent_name": "Agent Name",
  "transcript": "Full transcript...",
  "risk_score": 7.2,
  "risk_flags": [
    {
      "message_index": 2,
      "type": "Sensitive Info",
      "description": "Customer shared credit card number",
      "severity": 8
    }
  ],
  "analyzed_at": "2024-01-01T12:00:00Z"
}
```
