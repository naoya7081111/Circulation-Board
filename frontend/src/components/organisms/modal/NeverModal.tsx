import { Box, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { NeverMember } from "../../../type/NeverMember";
import { ListMembersCard } from "../../molecules/listCard/ListMembersCard";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    neverMembers: Array<NeverMember>;
};

export const NeverModal: VFC<Props> = memo((props) => {

    const { isOpen, onClose, neverMembers } = props

    return (
        <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} size='xs' motionPreset="slideInBottom">
            <ModalOverlay />
                <ModalContent bg='orange.50' marginX={4}>
                    <ModalHeader color='gray.500'>未読者一覧</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box h="360px" overflow="auto" >
                        {neverMembers.map((member, index) => (
                            <ListMembersCard key={index} id={member.userId} isHost={false} image={member.userImageName} >{member.userName}</ListMembersCard>
                        ))}
                        </Box>
                    </ModalBody>
                </ModalContent>
        </Modal>

    )
})