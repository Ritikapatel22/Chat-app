import { Box } from "@chakra-ui/react";
import React, { useState } from "react";
import ChatBox from "../components/ChatBox";
import Mychats from "../components/Mychats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";

function Chat() {
  const { user } = ChatState();
  const [fetchAgain , setFetchAgain] = useState(false)

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <Mychats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
}

export default Chat;
