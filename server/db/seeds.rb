# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Sample chat data for testing
Chat.create!(
  agent_name: "Sarah Johnson",
  transcript: "Customer: Hi, I need help with my account\nAgent: Hello! I'd be happy to help. Can you provide your account number?\nCustomer: Sure, it's 1234-5678-9012-3456\nAgent: Thank you. I can see your account. What seems to be the issue?\nCustomer: I think there's an unauthorized charge\nAgent: I'll look into that right away and get you a refund immediately.",
  risk_score: 7.2,
  risk_flags: [
    {
      message_index: 2,
      type: "Sensitive Info",
      description: "Customer shared full credit card number",
      severity: 8
    },
    {
      message_index: 5,
      type: "False Promise",
      description: "Agent promised immediate refund without verification",
      severity: 7
    }
  ],
  analyzed_at: 1.hour.ago
)

Chat.create!(
  agent_name: "Mike Chen",
  transcript: "Customer: My order hasn't arrived\nAgent: I understand your frustration. Let me check the status.\nCustomer: It's been 3 weeks!\nAgent: I apologize for the delay. I'll expedite your order and give you a 50% discount on your next purchase.\nCustomer: That's not good enough\nAgent: I understand. Let me speak to my supervisor to see what else we can do.",
  risk_score: 4.1,
  risk_flags: [
    {
      message_index: 3,
      type: "Unprofessional",
      description: "Agent made promises without proper authorization",
      severity: 5
    }
  ],
  analyzed_at: 2.hours.ago
)

Chat.create!(
  agent_name: "Lisa Rodriguez",
  transcript: "Customer: I want to cancel my subscription\nAgent: I'd be happy to help with that. Can you confirm your email address?\nCustomer: john.doe@email.com\nAgent: Perfect. I've cancelled your subscription. You'll receive a confirmation email shortly.\nCustomer: Thank you\nAgent: You're welcome! Is there anything else I can help you with today?",
  risk_score: 2.3,
  risk_flags: [],
  analyzed_at: 3.hours.ago
)
