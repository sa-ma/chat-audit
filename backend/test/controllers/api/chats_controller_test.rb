require "test_helper"

class Api::ChatsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @chat = chats(:one)
  end

  test "should get index" do
    get api_chats_url
    assert_response :success
  end

  test "should get show" do
    get api_chat_url(@chat)
    assert_response :success
  end

  test "should create chat" do
    assert_difference('Chat.count') do
      post api_chats_url, params: { 
        chat: { 
          agent_name: "Test Agent", 
          transcript: "Customer: Hello\nAgent: Hi there" 
        } 
      }
    end

    assert_response :created
  end
end
