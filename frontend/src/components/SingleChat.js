import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getSender, getSenderFull } from "../config/ChatLogic";
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import "./style.css"
import * as io from 'socket.io-client'

const ENDPOINT = "http://localhost:8080"
var soket , selectedChatCompare

function SingleChat({ fetchAgain, setFetchAgain }) {

  const toast = useToast();
  const [message,setMessage] = useState([])
  const [loading , setLoading] = useState(false)
  const [newMessage,setNewMessage] = useState()
  const [soketConnected , setSoketConnected] = useState(false)
  const [typing,setTyping] = useState(false)
  const [isTyping,setIsTyping] = useState(false)
  const { user, selectedChat, setSelectedChat ,notification , setNotification } = ChatState();

  const FetchMessage = async() => {
    if(!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true)
      const {data} = await axios.get(`/api/message/${selectedChat._id}`,config)
      setMessage(data)
      setLoading(false)
      soket.emit('join chat' , selectedChat._id);
    } catch (error) {
      toast({
        title: error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  }
  useEffect(()=>{
    soket = io.connect(ENDPOINT);
    soket.emit('setup',user)
    soket.on('connected', () => setSoketConnected(true))
    soket.on('typing',()=> setIsTyping(true))
    soket.on('stop typing',()=> setIsTyping(false))
  },[])

  useEffect(()=>{
    FetchMessage()
    selectedChatCompare = selectedChat;
  },[selectedChat])

  useEffect(()=>{
    soket.on("message recieved",(newMessageRecived)=>{
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecived.chat._id){
        if(!notification.includes(newMessageRecived)){
          setNotification([newMessageRecived, ...notification])
          setFetchAgain(!fetchAgain)
        }
      }else{
        setMessage([...message,newMessageRecived])
      }
    })
  })


  const sendMessage = async(e) => {
    if(e.key === "Enter" && newMessage){
      soket.emit('stop typing', selectedChat._id)
      try {
        const config = {
          headers: {
            "Content-type" : "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("")
        const {data} = await axios.post('/api/message',{
          content : newMessage,
          chatId : selectedChat._id
        },config)
        soket.emit('new message',data)
        setMessage([...message,data])
      } catch (error) {
        toast({
          title: error,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
      }
    }
  }

  const typingHangler = (e) =>{
    setNewMessage(e.target.value)

    if(!soketConnected) return;
    if(!typing){
      setTyping(true)
      soket.emit('typing',selectedChat._id)
    }
    let lastTypingTime  = new Date().getTime()
    var timerLength = 3000
    setTimeout(()=>{
      var timeNow = new Date().getTime()
      var timeDiff = timeNow - lastTypingTime
      if(timeDiff >= timerLength && typing){
        soket.emit('stop typing',selectedChat._id)
        setTyping(false)
      }
    },timerLength)
  }

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  FetchMessage={FetchMessage}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {
              loading ? (<Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />) : 
              (<>
              <div className="messages">
                <ScrollableChat message={message}/>
              </div>
              </>)
            }
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {
                isTyping ? <div>
                  loading...
                </div> : <></>
              }
            <Input 
             variant="filled"
             bg="#E0E0E0"
             placeholder="Enter a message.."
             onChange={typingHangler}
             value={newMessage}
            />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
