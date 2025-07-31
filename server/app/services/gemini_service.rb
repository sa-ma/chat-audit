class GeminiService
  include HTTParty
  
  base_uri 'https://generativelanguage.googleapis.com/v1beta'
  
  def initialize
    @api_key = Rails.application.credentials.gemini_api_key
    raise 'GEMINI_API_KEY not found in Rails credentials' if @api_key.blank?
  end
  
  def analyze_chat(transcript)
    response = self.class.post(
      "/models/gemini-2.5-flash-lite:generateContent?key=#{@api_key}",
      headers: {
        'Content-Type' => 'application/json'
      },
      body: build_request_body(transcript).to_json
    )
    
    if response.success?
      parse_response(response.body)
    else
      Rails.logger.error "Gemini API error: #{response.code} - #{response.body}"
      raise "Gemini API error: #{response.code}"
    end
  rescue => e
    Rails.logger.error "Error calling Gemini API: #{e.message}"
    raise e
  end
  
  private
  
  def build_request_body(transcript)
    {
      contents: [
        {
          parts: [
            {
              text: system_prompt
            },
            {
              text: user_prompt(transcript)
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048
      }
    }
  end
  
  def system_prompt
    "You're a compliance assistant that detects risks in customer service interactions."
  end
  
  def user_prompt(transcript)
    "Given this transcript, return:\n\n1. An overall risk score (1–10)\n2. A list of risky agent messages with:\n\n* message index\n* risk type\n* explanation\n* severity (1–10)\n\nTranscript:\n#{transcript}\n\nRespond with valid JSON in this exact format:\n{\n  \"risk_score\": 6.9,\n  \"flags\": [\n    {\n      \"message_index\": 1,\n      \"type\": \"Sensitive Info\",\n      \"description\": \"Customer shared card number\",\n      \"severity\": 7\n    }\n  ]\n}"
  end
  
  def parse_response(response_body)
    parsed = JSON.parse(response_body)
    content = parsed.dig('candidates', 0, 'content', 'parts', 0, 'text')
    
    if content.blank?
      raise "Invalid response format from Gemini API"
    end
    
    # Extract JSON from the response (in case there's additional text)
    json_match = content.match(/\{.*\}/m)
    if json_match
      json_content = JSON.parse(json_match[0])
    else
      raise "No valid JSON found in Gemini response"
    end
    
    {
      risk_score: json_content['risk_score'].to_f,
      flags: json_content['flags'] || []
    }
  rescue JSON::ParserError => e
    Rails.logger.error "Failed to parse Gemini response: #{e.message}"
    Rails.logger.error "Response content: #{content}"
    raise "Invalid JSON response from Gemini API"
  end
end 