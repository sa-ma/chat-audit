class Api::ChatsController < ApplicationController
  def index
    chats = Chat.order(analyzed_at: :desc)
    render json: chats.map { |chat| chat_summary(chat) }
  end

  def show
    chat = Chat.find(params[:id])
    render json: chat_detail(chat)
  end

  def create
    chat = Chat.new(chat_params)
    
    if chat.save
      # Analyze chat with Gemini
      analysis_result = analyze_chat_with_gemini(chat.transcript)
      
      # Update chat with analysis results
      chat.update!(
        risk_score: analysis_result[:risk_score],
        risk_flags: analysis_result[:flags],
        analyzed_at: Time.current
      )
      
      render json: chat_detail(chat), status: :created
    else
      render json: { errors: chat.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def chat_params
    params.require(:chat).permit(:agent_name, :transcript)
  end

  def chat_summary(chat)
    {
      id: chat.id,
      agent_name: chat.agent_name,
      risk_score: chat.risk_score,
      analyzed_at: chat.analyzed_at,
      flag_count: chat.risk_flags&.length || 0
    }
  end

  def chat_detail(chat)
    {
      id: chat.id,
      agent_name: chat.agent_name,
      transcript: chat.transcript,
      risk_score: chat.risk_score,
      risk_flags: chat.risk_flags,
      analyzed_at: chat.analyzed_at
    }
  end

  def analyze_chat_with_gemini(transcript)
    gemini_service = GeminiService.new
    gemini_service.analyze_chat(transcript)
  end
end
