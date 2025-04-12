import {
  VirtuosoMessageList,
  VirtuosoMessageListLicense,
} from '@virtuoso.dev/message-list';
import styled from 'styled-components';

export interface MessageItem {
  role: string;
  message: string;
  id: string;
}

const ChatContainer = styled.div`
  height: calc(100vh - 180px);
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  overflow: hidden;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 80%;
  padding: 12px 16px;
  margin: ${props => props.isUser ? '8px 0 8px auto' : '8px auto 8px 0'};
  background-color: ${props => props.isUser ? '#1890ff' : '#fff'};
  color: ${props => props.isUser ? '#fff' : '#000'};
  border-radius: ${props => props.isUser ? '16px 16px 0 16px' : '16px 16px 16px 0'};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
`;

const MessageHeader = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
  font-size: 0.9em;
  opacity: 0.8;
`;


const MessageContainer = styled.div`
 width: 100%;
 height: 100%;
 max-height: 100%;
  overflow: auto;
`

interface ChatListProps {
  messages: MessageItem[];
}

export const ChatList = (props: ChatListProps) => {
  const { messages } = props;
  console.log("message", messages)
  return (
    <MessageContainer>
      {messages.map(message => {
        return <div>
          <MessageBubble isUser={message.role === 'user'}>
            <MessageHeader>
              {message.role === 'user' ? 'You' : 'Assistant'}
            </MessageHeader>
            {message.message}
          </MessageBubble>
        </div>
      })}
    </MessageContainer>
  );
};
