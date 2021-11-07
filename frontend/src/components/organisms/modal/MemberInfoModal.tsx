import { Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spacer, Stack, Text } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { useCommunityMembers } from "../../../hooks/context/useCommunityMembers";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    id: number | null;
};

export const MemberInfoModal: VFC<Props> = memo((props) => {

    const { isOpen, onClose, id } = props;

    const { communityMembers } = useCommunityMembers();


    const selectUSer = communityMembers.find((member) => member.userId === id);


    return (
        <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} size='sm' motionPreset="slideInBottom">
            <ModalOverlay />
                <ModalContent bg='orange.50'>
                    <ModalHeader color='gray.500'>メンバー情報</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack spacing={4} >
                            <Image borderRadius="full" boxSize="42px" src={selectUSer?.userImageName === null ? `${process.env.PUBLIC_URL}/img/freemeison.jpeg` : `https://object-storage.tyo2.conoha.io/v1/nc_819897bd08504d38bcce5fc9b4d08a6f/test/${selectUSer?.userImageName}`} />
                            <Text fontSize="md" fontWeight="bold" >
                                {selectUSer?.userName}
                            </Text>
                            <Spacer />
                        </Stack>
                    </ModalBody>
                </ModalContent>
        </Modal>

    )
})