import { Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spacer, Stack, Text, Box } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { useCommunityMembers } from "../../../hooks/context/useCommunityMembers";
import { DateText } from "../../atoms/text/DateText";
import { AreaText } from "../../atoms/text/AreaText";
import { SiteText } from "../../atoms/text/SiteText";
import { useDate } from "../../../hooks/useDate";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    id: number | null;
};

export const MemberInfoModal: VFC<Props> = memo((props) => {

    const { isOpen, onClose, id } = props;

    const { communityMembers } = useCommunityMembers();
    const { dateKanji } = useDate();

    const selectUSer = communityMembers.find((member) => member.userId === id);

    return (
        <Modal isOpen={isOpen} onClose={onClose} autoFocus={false} size='sm' motionPreset="slideInBottom">
            <ModalOverlay />
                <ModalContent bg='orange.50' padding={4} marginX={4}>
                    <ModalHeader color='gray.500'>メンバー情報</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack spacing={4} >
                            <Image borderRadius="full" boxSize="42px" src={selectUSer?.userImageName === null ? `${process.env.PUBLIC_URL}/img/freemeison.jpeg` : `https://object-storage.tyo2.conoha.io/v1/nc_819897bd08504d38bcce5fc9b4d08a6f/test/${selectUSer?.userImageName}`} />
                            <Box>
                                <Text fontSize="md" fontWeight="bold" >
                                    {selectUSer?.userName}
                                </Text>
                                <DateText fontSize="xs" color='gray.500' boxSize='3'>{dateKanji({ date: selectUSer?.entryDate ?? null })}</DateText>
                            </Box>
                            {selectUSer?.sentence !== null && (
                                <>
                                <Text fontSize="sm" whiteSpace='pre-wrap'>{selectUSer?.sentence}</Text>                                
                                </>
                            )}
                            <Box>
                                {selectUSer?.area !== null && (
                                    <>
                                    <AreaText fontSize="xs" color='gray.500' boxSize='3'>{selectUSer?.area}</AreaText>                                    
                                    </>
                                )}
                                {selectUSer?.site !== null && (
                                    <>
                                    <SiteText fontSize="xs" color='gray.500' boxSize='3'>{selectUSer?.site}</SiteText>                                    
                                    </>
                                )}
                            </Box>
                            <Spacer />
                        </Stack>
                    </ModalBody>
                </ModalContent>
        </Modal>

    )
})