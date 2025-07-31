class CreateChats < ActiveRecord::Migration[7.1]
  def change
    create_table :chats do |t|
      t.string :agent_name
      t.text :transcript
      t.float :risk_score
      t.datetime :analyzed_at
      t.json :risk_flags

      t.timestamps
    end
  end
end
