import {
  Card,
  CardSection,
  Indicator,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { useSelector } from "react-redux";

const Chats = (props) => {
  const { setChats, chats, selectedChat, setSelectedChat } = props;
  const { user } = useSelector((state) => state.user);
  const checkUnread = (values) => {
    if (values?.readBy.find((userInGroup) => userInGroup === user._id)) {
      return true;
    }
    return false;
  };
  return (
    <Paper h={"90vh"} style={{ overflowY: "scroll" }}>
      {chats ? (
        <>
          <Title order={3} ta={"center"}>
            Chats
          </Title>
          <Stack>
            {Object.entries(chats)
              ?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
              .map((chat) => (
                <Indicator
                  size={17}
                  disabled={checkUnread(chat.latestMessage)}
                  label="New Message"
                  key={chat._id}
                  position="top-left"
                >
                  <Card
                    onClick={() => {
                      setSelectedChat(chat);
                      //   await chatRead(chat);
                      //   params(chat._id);
                    }}
                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                    color={selectedChat === chat ? "white" : "black"}
                    onMouseEnter={(e) => (e.target.style.cursor = "pointer")}
                  >
                    <CardSection>
                      <Text size="xl" ta={"center"}>
                        {chat.chatName.startsWith(`user-`)
                          ? `AnoUser-${chat.chatName.substr(-5)}`
                          : `${chat.chatName}`}
                      </Text>
                      <Text
                        span
                        size="md"
                        c={checkUnread(chat.latestMessage) ? "gray" : "red"}
                      >
                        {chat?.latestMessage?.sender?.username ===
                          chat.chatName && chat.isUser === false ? (
                          <b>{`AnoUser-${chat.chatName.substr(-5)}`}</b>
                        ) : (
                          <b>{chat?.latestMessage?.sender?.username}</b>
                        )}
                        <b> : </b>
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 35) + "..."
                          : chat.latestMessage.content}
                      </Text>
                    </CardSection>
                  </Card>
                </Indicator>
              ))}
          </Stack>
        </>
      )
    :<Loader size={100}/>
    }
    </Paper>
  );
};

export default Chats;
