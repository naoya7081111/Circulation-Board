import { Box, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { useCommunityMembers } from "../../../hooks/context/useCommunityMembers";
import { useLoginUser } from "../../../hooks/context/useLoginUser";
import { SideBarText } from "../../atoms/text/SideBarText";
import { ListMembersCard } from "../../molecules/listCard/ListMembersCard";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export const AllMemberModal: VFC<Props> = memo((props) => {

    const { isOpen, onClose } = props;

    const { communityMembers } = useCommunityMembers();
    const { loginUser } = useLoginUser();


    return (
        <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} size='sm' motionPreset="slideInBottom">
            <ModalOverlay />
                <ModalContent bg='orange.50'　marginX={4}>
                    <ModalHeader color='gray.500'>コミュニティメンバー</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    <Box minHeight="60px" >
                        {communityMembers?.map((member) => (
                                member.userId !== loginUser?.userId ? <ListMembersCard id={member.userId} isHost={member.isHost} image={member.userImageName ?? null} key={member.userId} >{member.userName}</ListMembersCard> : null
                            ))}
                        {communityMembers.length === 1 && <SideBarText>あなた以外参加していません</SideBarText>}
                    </Box>
                    </ModalBody>
                </ModalContent>
        </Modal>
    )
})