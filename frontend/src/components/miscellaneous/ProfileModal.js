import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

function ProfileModal({user,childern}) {

    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
   <>
   {
       childern ? <span style={{paddingLeft:"12px"}} onClick={onOpen}>{childern}</span> :
       <IconButton
       display={{base:"flex"}}
       icon={<ViewIcon />}
       onClick={onOpen}
       />
   }
   <Modal size="lg" blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="400px">
          <ModalHeader
          fontSize="40px"
          fontFamily="Work sans"
          display="flex"
          justifyContent="center"
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="space-between"
          >
             <Image 
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
             />
             <Text>
                 {user.email}
             </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
   </>
  )
}

export default ProfileModal