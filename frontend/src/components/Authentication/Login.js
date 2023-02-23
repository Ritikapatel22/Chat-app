import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from "@chakra-ui/react"
import { useState } from "react"
import axios from "axios";
import { useHistory } from "react-router-dom";

function Login() {
    let history = useHistory();
    const toast = useToast();
    const [email,setEmail] = useState()
    const [password,setPassword] = useState()
    const [show ,setShow] = useState(false)


    const submitHandler = async() => {
        if(!email || !password){
            toast({
                title: "Please Fill all fielss",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
        }
        try {
            const config = {
                headers: {
                  "Content-Type": "application/json",
                },
              };
              const { data } = await axios.post(
                "/api/user/login",
                { email, password},
                config
              );
              localStorage.setItem("userInfo", JSON.stringify(data));
              toast({
                title: "Login successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              history.push("/chats");
        } catch (error) {
            
        }
    }

  return (
    <VStack spacing='5px'>
        <FormControl>
            <FormLabel>Email</FormLabel>
            <Input 
            placeholder='Enter email'
            onChange={(e)=>setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input
            type={show ? "text" : "password"}
            placeholder='Enter password'
            onChange={(e)=>setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={()=> setShow(!show)}>
                {show ? "Hide" : "Show"}
            </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>
        <Button
        colorScheme="blue"
        width="100%"
        style={{marginTop:15}}
        onClick={submitHandler}
        >
            Login
        </Button>
    </VStack>
  )
}

export default Login