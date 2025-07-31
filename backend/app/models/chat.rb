class Chat < ApplicationRecord
  validates :agent_name, presence: true
  validates :transcript, presence: true
  validates :risk_score, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 10 }, allow_nil: true
end
