/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { agentMessage, sendMessage } from "../../services/message";
import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Center,
  Flex,
  Group,
  Loader,
  Paper,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconArrowBack, IconMessageForward } from "@tabler/icons-react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { toast } from "react-toastify";
const SingleChatBox = (props) => {
  const { fetchAgain, setFetchAgain, selectedChat, setSelectedChat, socket } =
    props;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useSelector((state) => state.user);
  const [typing, setTyping] = useState(true);
  const ref = useRef();
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const { data } = await agentMessage(selectedChat._id);
      if (data.length !== 0 && data[0].sender !== undefined) {
        setMessages(data);
        setLoading(false);
      } else {
        setMessages([]);
        setLoading(false);
      }
      socket.emit("join", selectedChat._id);
    } catch (error) {
      toast.error(error, { position: "top-right" });
    }
  };
  const handleSubmit = async () => {
    setTyping(false);
    if (newMessage) {
      try {
        const { data } = await sendMessage({
          chatId: selectedChat._id,
          content: newMessage,
          user: user.username,
        });
        socket.emit("userMessage", data);
        setMessages([...messages, data]);
        setNewMessage("");
        setTyping(true);
      } catch (error) {
        toast.error(error, { position: "top-right" });
      }
    } else {
      setTyping(true);
      alert("empty input");
    }
  };
  const messageReceived = (data) => {
    const chat = data.chat;
    if (selectedChat._id !== chat._id) {
      setFetchAgain(!fetchAgain);
    } else {
      setMessages([...messages, data]);
    }
  };
  useEffect(() => {
    selectedChat && fetchMessages();
  }, [selectedChat]);
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      messageReceived(newMessageRecieved);
    });
  });
  useEffect(() => {
    if (messages.length) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);
  return (
    <Paper m={0} p={0} h={"100%"}>
      <>
        {selectedChat ? (
          <>
            <Group
              w="100%"
              d="flex"
              justify="space-between"
              align="center"
              h={"5%"}
            >
              <Tooltip label="exit chat">
                <IconArrowBack
                  d={{ base: "flex", md: "none" }}
                  onClick={() => {
                    setSelectedChat();
                  }}
                  cursor={"pointer"}
                  size={30}
                />
              </Tooltip>
              {messages && <Text>{selectedChat.chatName.toUpperCase()}</Text>}
            </Group>

            <Box
              bg={"rgba(0, 0, 0, 0.12)"}
              justify="flex-end"
              style={{ overflowY: "scroll" }}
              h={"85%"}
              pb={"sm"}
            >
              {loading ? (
                <Loader size={"xl"} />
              ) : (
                <Flex
                  direction={"column"}
                  h={messages.length < 5 && "100%"}
                  justify={"flex-end"}
                >
                  {messages.length !== 0 ? (
                    messages.map((m, i) => (
                      <Flex key={m._id}>
                        {(isSameSender(messages, m, i, user._id) ||
                          isLastMessage(messages, i, user._id)) && (
                          <Tooltip
                            label={m.sender.username}
                            position="top-center"
                            withArrow
                          >
                            <Avatar
                              mt="7px"
                              mr={1}
                              size="30"
                              cursor="pointer"
                              name={m.sender.username}
                              src={m.sender.img}
                            />
                          </Tooltip>
                        )}
                        <Text
                          style={{
                            backgroundColor: `${
                              m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                            }`,
                            marginLeft: isSameSenderMargin(
                              messages,
                              m,
                              i,
                              user._id
                            ),
                            marginTop: isSameUser(messages, m, i, user._id)
                              ? 3
                              : 10,
                            borderRadius: "10px",
                            padding: "5px 0px",
                            maxWidth: "100%",
                          }}
                        >
                          {m.content}
                        </Text>
                      </Flex>
                    ))
                  ) : (
                    <Center h={"100%"}> No Messages Yet</Center>
                  )}
                  <div ref={ref} />
                </Flex>
              )}
            </Box>
            <TextInput
              h={"10%"}
              disabled={typing == false}
              placeholder="enter message..."
              // mt={"sm"}
              pt={"xs"}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              rightSection={<IconMessageForward onClick={handleSubmit} />}
            />
          </>
        ) : (
          <Center h="100%" w={"100%"}>
            <Text size="xl">Click on a user to start chatting</Text>
          </Center>
        )}
      </>
    </Paper>
  );
};

export default SingleChatBox;
